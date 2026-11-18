"""ASCA backend monitoring: read-only analytics + local admin sessions.

Local development: serve FastAPI on 127.0.0.1 and access it through Vite proxy.
Sessions are kept in process memory (restart logs out everyone).
For internet deployment use HTTPS, stronger credentials and persistent session storage.
"""
import hashlib
import hmac
import secrets
import threading
import time as clock
import logging
import os
import re
from pathlib import Path
from collections import Counter, defaultdict
from datetime import date, datetime, time, timedelta
from functools import lru_cache
from zoneinfo import ZoneInfo

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request, Response, status
from pydantic import BaseModel, Field
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import MetaData, Table, and_, create_engine, func, or_, select
from sqlalchemy.exc import SQLAlchemyError

load_dotenv()
TZ = ZoneInfo('Asia/Jakarta')
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./demo.sqlite3')
TABLE_NAME = os.getenv('MONITOR_TABLE', 'chatbot_logs')
SCHEMA_NAME = os.getenv('MONITOR_SCHEMA') or None
EXCLUDE_TEST = os.getenv('MONITOR_EXCLUDE_TEST', 'true').lower() == 'true'
DEMO = DATABASE_URL.startswith('sqlite:') and 'demo.sqlite3' in DATABASE_URL

for name in (TABLE_NAME, SCHEMA_NAME):
    if name is not None and not re.fullmatch(r'[A-Za-z_][A-Za-z0-9_]*', name):
        raise RuntimeError('MONITOR_TABLE / MONITOR_SCHEMA hanya boleh huruf, angka, dan underscore')

engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={'check_same_thread': False} if DATABASE_URL.startswith('sqlite:') else {})
# Dokumentasi interaktif (/docs) dimatikan secara default agar skema API tidak terbuka
# untuk publik. Nyalakan hanya saat lokal: FASCA_ENABLE_DOCS=true.
_docs_on = os.getenv('FASCA_ENABLE_DOCS', 'false').lower() == 'true'
app = FastAPI(
    title='FASCA Monitoring (read-only)', version='0.1.0',
    docs_url='/docs' if _docs_on else None,
    redoc_url=None,
    openapi_url='/openapi.json' if _docs_on else None,
)
logger = logging.getLogger('uvicorn.error')

# --- Autentikasi admin lokal ----------------------------------------------------
# Kredensial di .env BACKEND saja; jangan pernah gunakan variabel VITE_ untuk password.
def _env_any(*names, default=None):
    """Terima nama FASCA_* maupun ASCA_* (contoh .env lama memakai ASCA_*)."""
    for n in names:
        v = os.getenv(n)
        if v:
            return v
    return default

ADMIN_USERNAME = _env_any('FASCA_ADMIN_USERNAME', 'ASCA_ADMIN_USERNAME', default='admin')
ADMIN_PASSWORD = _env_any('FASCA_ADMIN_PASSWORD', 'ASCA_ADMIN_PASSWORD')

COOKIE_NAME = 'fasca_admin_session'
COOKIE_SECURE = _env_any('FASCA_COOKIE_SECURE', 'ASCA_COOKIE_SECURE', default='false').lower() == 'true'

# Mode internet (cookie secure): tolak password kosong / lemah sejak server start,
# bukan baru error saat seseorang mencoba login.
if COOKIE_SECURE and (not ADMIN_PASSWORD or ADMIN_PASSWORD.lower() in {'admin', 'password', '12345678'} or len(ADMIN_PASSWORD) < 10):
    raise RuntimeError('FASCA_ADMIN_PASSWORD wajib diisi dan kuat (min. 10 karakter) saat FASCA_COOKIE_SECURE=true')
SESSION_LIFETIME = 8 * 60 * 60  # 8 jam
_login_lock = threading.Lock()
_sessions = {}  # SHA-256 token acak -> unix waktu kedaluwarsa
_failed_logins = {}  # IP -> [timestamp gagal] (pembatas sederhana untuk prototipe lokal)

class LoginPayload(BaseModel):
    username: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=1, max_length=256)

def admin_public_profile():
    return {'username': ADMIN_USERNAME, 'displayName': 'Administrator ASCA', 'role': 'Administrator'}

def session_key(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode('utf-8')).hexdigest()

def valid_admin(request: Request) -> bool:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return False
    with _login_lock:
        expiration = _sessions.get(session_key(token))
        if expiration is None:
            return False
        if expiration <= clock.time():
            _sessions.pop(session_key(token), None)
            return False
        return True

@app.middleware('http')
async def require_admin_on_api(request: Request, call_next):
    path = request.url.path
    # Login dan pemeriksaan sesi mempunyai respons 401 sendiri.
    open_auth_paths = {'/api/auth/login', '/api/auth/me', '/api/auth/logout'}
    if path.startswith('/api/') and path not in open_auth_paths:
        if not valid_admin(request):
            return JSONResponse(status_code=401, content={'detail': 'Sesi admin tidak aktif. Silakan login.'}, headers={'Cache-Control': 'no-store'})
    response = await call_next(request)
    if path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response

@app.post('/api/auth/login')
def admin_login(payload: LoginPayload, request: Request, response: Response):
    # Limit 5 kesalahan tiap 5 menit dari IP yang sama (cocok untuk satu admin lokal).
    ip = request.client.host if request.client else 'unknown'
    now = clock.time()
    with _login_lock:
        attempts = [t for t in _failed_logins.get(ip, []) if now - t < 300]
        _failed_logins[ip] = attempts
        if len(attempts) >= 5:
            raise HTTPException(status_code=429, detail='Terlalu banyak percobaan. Coba lagi dalam beberapa menit.')

    if not ADMIN_PASSWORD:
        raise HTTPException(status_code=503, detail='Password admin belum dikonfigurasi di server (FASCA_ADMIN_PASSWORD).')

    # Bandingkan hash dengan panjang tetap, tanpa mencetak password ke log.
    candidate = hashlib.sha256(payload.password.encode('utf-8')).digest()
    expected = hashlib.sha256(ADMIN_PASSWORD.encode('utf-8')).digest()
    correct = hmac.compare_digest(candidate, expected) and hmac.compare_digest(payload.username.encode('utf-8'), ADMIN_USERNAME.encode('utf-8'))
    if not correct:
        with _login_lock:
            _failed_logins.setdefault(ip, []).append(now)
        raise HTTPException(status_code=401, detail='Username atau password salah.')

    with _login_lock:
        _failed_logins.pop(ip, None)
        # Bersihkan sesi lama saat login agar penyimpanan tetap kecil.
        for k, expiration in list(_sessions.items()):
            if expiration <= now:
                _sessions.pop(k, None)
        token = secrets.token_urlsafe(32)
        _sessions[session_key(token)] = now + SESSION_LIFETIME

    response.set_cookie(
        COOKIE_NAME, token, max_age=SESSION_LIFETIME, path='/api',
        httponly=True, secure=COOKIE_SECURE, samesite='strict',
    )
    return {'data': admin_public_profile(), 'meta': {'source': 'auth'}}

@app.get('/api/auth/me')
def admin_me(request: Request):
    if not valid_admin(request):
        raise HTTPException(status_code=401, detail='Belum login sebagai admin.')
    return {'data': admin_public_profile(), 'meta': {'source': 'auth'}}

@app.post('/api/auth/logout')
def admin_logout(request: Request, response: Response):
    token = request.cookies.get(COOKIE_NAME)
    if token:
        with _login_lock:
            _sessions.pop(session_key(token), None)
    response.delete_cookie(
        COOKIE_NAME, path='/api', httponly=True,
        secure=COOKIE_SECURE, samesite='strict',
    )
    return {'data': {'loggedOut': True}, 'meta': {'source': 'auth'}}
# --- Akhir autentikasi admin ----------------------------------------------------

@lru_cache(maxsize=1)
def log_table():
    table = Table(TABLE_NAME, MetaData(), schema=SCHEMA_NAME, autoload_with=engine)
    # Kategori monitoring berasal dari hasil Intent Classification.
    required = {'question', 'created_at', 'intent'}
    missing = required - set(table.c.keys())
    if missing:
        raise RuntimeError(f'Kolom wajib tidak ditemukan: {", ".join(sorted(missing))}')
    return table

def column(t, name):
    return t.c[name] if name in t.c else None

def base_filter(t):
    conditions = []
    if EXCLUDE_TEST:
        status = column(t, 'status')
        if status is not None:
            conditions.append(or_(status.is_(None), func.lower(status) != 'test'))
        conditions.append(~func.lower(func.trim(t.c.question)).like('tes %'))
    return and_(*conditions) if conditions else True

def as_datetime(value):
    if isinstance(value, str):
        value = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if isinstance(value, date) and not isinstance(value, datetime):
        value = datetime.combine(value, time.min)
    if value.tzinfo is None:
        return value.replace(tzinfo=TZ)
    return value.astimezone(TZ)

def iso(value):
    return as_datetime(value).isoformat() if value else None

def cat_label(value):
    return str(value).strip() if value is not None and str(value).strip() else 'Belum Dikategorikan'

def key(label):
    common = {
        'krs': 'krs', 'ta': 'ta', 'kp': 'kp', 'lainnya': 'lainnya',
        'belum dikategorikan': 'belum-dikategorikan',
        'kalender akademik': 'kalender-akademik',
        'panduan akademik': 'panduan-akademik',
        'mata kuliah': 'mata-kuliah',
        'capstone': 'capstone', 'administrasi': 'administrasi',
    }
    lower = label.lower().strip()
    return common.get(lower, re.sub(r'[^a-z0-9]+', '-', lower).strip('-') or 'lainnya')

# Label yang dijelaskan pada Capstone; label lain tetap ditampilkan sebagai
# intent tersimpan (tidak ditafsirkan ulang menjadi enam kelas secara paksa).
INTENT_LABELS = {
    'definition': 'Pengertian',
    'procedure': 'Prosedur',
    'requirements': 'Persyaratan',
    'schedule': 'Jadwal',
    'consequence': 'Konsekuensi',
    'general': 'Umum',
    'belum-dikategorikan': 'Belum terklasifikasi',
}


def intent_key(value):
    """ID untuk UI/filter; normalisasi format, bukan mengubah kelas intent."""
    normalized = str(value).strip().lower() if value is not None else ''
    return re.sub(r'[^a-z0-9]+', '-', normalized).strip('-') or 'belum-dikategorikan'


def intent_label(value):
    value_id = intent_key(value)
    return INTENT_LABELS.get(value_id) or str(value).strip()


def intent_counts(conn, t, *conditions):
    """Hitung hasil intent (bukan kategori dokumen); satukan beda huruf besar/format."""
    intent = t.c.intent
    grouped = Counter()
    labels = {}
    rows = conn.execute(
        select(intent, func.count()).select_from(t)
        .where(scoped(t, *conditions)).group_by(intent)
    ).all()
    for raw_value, n in rows:
        value_id = intent_key(raw_value)
        grouped[value_id] += int(n)
        labels.setdefault(value_id, intent_label(raw_value))
    return [(value_id, labels[value_id], n) for value_id, n in
            sorted(grouped.items(), key=lambda item: (-item[1], item[0]))]


def record(r, idx=0):
    mapping = r._mapping
    # No fabricated student ID, semester or response-time.
    question = mapping['question'] or ''
    ts = iso(mapping['created_at'])
    fingerprint = hashlib.sha256(f'{ts}:{question}:{idx}'.encode()).hexdigest()[:16]
    raw_intent = mapping.get('intent')
    return {
        'id': str(mapping.get('id') or f'LOG-{fingerprint}'),
        'timestamp': ts,
        'user': 'Tidak tercatat',
        'userId': None,
        'question': question,
        'answer': mapping.get('answer'),
        # Field categoryId/category dipertahankan untuk kontrak API frontend.
        # Keduanya SEKARANG berasal dari intent, bukan kolom category DB.
        'categoryId': intent_key(raw_intent),
        'category': intent_label(raw_intent),
        'institution': mapping.get('institution') or 'Tidak diketahui',
        'intent': str(raw_intent).strip() if raw_intent is not None and str(raw_intent).strip() else 'Belum terklasifikasi',
        'semester': None,
        'status': mapping.get('status') or 'unknown',
        'responseTimeMs': None,
        'source': mapping.get('source_file') or 'Tidak tersedia',
        'channel': 'telegram',
    }

def scoped(t, *conditions):
    return and_(base_filter(t), *conditions)

def total(conn, t, *conditions):
    return conn.execute(select(func.count()).select_from(t).where(scoped(t, *conditions))).scalar_one()

def counts(conn, t, field, *conditions):
    c = column(t, field)
    if c is None:
        return []
    rows = conn.execute(select(c, func.count()).select_from(t).where(scoped(t, *conditions)).group_by(c).order_by(func.count().desc())).all()
    return [(cat_label(v), int(n)) for v, n in rows]

def wrap(data, meta=None):
    return {'data': data, 'meta': {'source': 'simulation' if DEMO else 'database', **(meta or {})}}

@app.exception_handler(SQLAlchemyError)
def db_error_handler(request, exc):
    logger.exception('Query database monitoring gagal: %s', type(exc).__name__)
    return JSONResponse(status_code=503, content={'detail': 'Database monitoring belum dapat diakses. Periksa DATABASE_URL dan akses read-only.'})

@app.exception_handler(RuntimeError)
def config_error_handler(request, exc):
    logger.error('Skema database monitoring belum cocok: %s', exc)
    return JSONResponse(status_code=503, content={'detail': 'Tabel database monitoring belum cocok. Periksa MONITOR_TABLE dan kolom yang tersedia.'})

@app.get('/api/health')
def health():
    # Only reports monitoring DB access, not Telegram bot availability.
    with engine.connect() as conn:
        t = log_table()
        conn.execute(select(func.count()).select_from(t).limit(1)).scalar_one()
    return wrap({'monitoring': 'ready', 'source': 'database-readonly'})

# Normalisasi nilai institution untuk ringkasan monitoring.
# Satu interaksi tetap dihitung satu kali, termasuk bila memuat banyak institusi.
def normalize_institution(value):
    name = str(value or '').strip()
    lower = name.lower()

    if lower in ('', 'tidak diketahui', 'belum dikategorikan',
                 'unknown', 'null', 'none', '-'):
        return 'Tidak diketahui'

    detected = []
    if 'mercu buana' in lower or re.search(r'\bumb\b', lower):
        detected.append('Universitas Mercu Buana')
    if 'negeri jakarta' in lower or re.search(r'\bunj\b', lower):
        detected.append('Universitas Negeri Jakarta')
    if 'trisakti' in lower:
        detected.append('Universitas Trisakti')

    if len(detected) > 1:
        return 'Multi-institusi'
    if len(detected) == 1:
        return detected[0]
    return 'Tidak diketahui'


def group_institution_counts(institutions):
    grouped = Counter()
    for name, n in institutions:
        grouped[normalize_institution(name)] += n
    return sorted(grouped.items(), key=lambda item: (-item[1], item[0]))


@app.get('/api/analytics/overview')
def overview():
    start_month = datetime.now(TZ).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    with engine.connect() as conn:
        t = log_table()
        total_questions = total(conn, t)
        this_month = total(conn, t, t.c.created_at >= start_month)
        intents = intent_counts(conn, t)
        institutions = counts(conn, t, 'institution')
        
        missing_intent = sum(n for value_id, _, n in intents if value_id == 'belum-dikategorikan')
    institution_distribution = [
        {'institution': label, 'questions': n}
        for label, n in group_institution_counts(institutions)
    ]
    return wrap({
        'stats': {
            'totalQuestions': total_questions,
            'questionsThisMonth': this_month,
            'uncategorizedQuestions': missing_intent,
            'categorizedQuestions': total_questions - missing_intent,
        },
        # Total seluruh waktu, sejalan dengan 'stats.totalQuestions'.
        'institutionDistribution': institution_distribution,
        'quick': {
            'mostAskedCategory': next((label for value_id, label, n in intents if value_id != 'belum-dikategorikan'), '—'),
            'mostAskedInstitution': institution_distribution[0]['institution'] if institution_distribution else '—',
            'mostCommonIntent': intents[0][1] if intents else '—',
            'categoryCompleteness': round((total_questions - missing_intent) / total_questions * 100, 1) if total_questions else 0,
        },
    })

@app.get('/api/analytics')
def analytics(range_name: str = Query('30d', alias='range', pattern=r'^(7d|30d)$')):
    days = 7 if range_name == '7d' else 30
    today = datetime.now(TZ).date()
    start = datetime.combine(today - timedelta(days=days - 1), time.min, tzinfo=TZ)
    with engine.connect() as conn:
        t = log_table()
        timestamps = conn.execute(select(t.c.created_at).where(scoped(t, t.c.created_at >= start))).scalars().all()
        intents = intent_counts(conn, t, t.c.created_at >= start)
        institutions = counts(conn, t, 'institution', t.c.created_at >= start)
        popular = _popular(conn, t, limit=7, since=start)
    daily = Counter(as_datetime(ts).date().isoformat() for ts in timestamps)
    hours = Counter(as_datetime(ts).hour for ts in timestamps)
    dates = [today - timedelta(days=days - i - 1) for i in range(days)]
    return wrap({
        'questionsPerDay': [{'date': d.isoformat(), 'label': d.strftime('%d/%m'), 'questions': daily[d.isoformat()]} for d in dates],
        # Nama properti tetap agar Dashboard/Analytics yang ada tidak putus.
        'questionsByCategory': [{'categoryId': value_id, 'label': label, 'questions': n} for value_id, label, n in intents],
        'questionsByInstitution': [{'institution': label, 'questions': n} for label, n in group_institution_counts(institutions)],
        'questionsByIntent': [{'intent': value_id, 'label': label, 'questions': n} for value_id, label, n in intents],
        'topTopics': [{'topic': row['question'][:42], 'count': row['count']} for row in popular],
        'hourlyUsage': [{'hour': f'{h:02}', 'questions': hours[h]} for h in range(24)],
    })

def _popular(conn, t, limit, since=None):
    expression = func.lower(func.trim(t.c.question))
    c = t.c.intent
    fields = [expression.label('text'), func.count().label('count')]
    fields.append(func.max(c).label('intent'))
    constraints = [t.c.created_at >= since] if since is not None else []
    rows = conn.execute(select(*fields).where(scoped(t, *constraints)).group_by(expression).order_by(func.count().desc()).limit(limit)).mappings().all()
    return [{'id': f'pq-{i}', 'question': r['text'], 'categoryId': intent_key(r.get('intent')), 'count': int(r['count'])} for i, r in enumerate(rows, 1)]

@app.get('/api/analytics/popular-questions')
def popular_questions(limit: int = Query(7, ge=1, le=50)):
    with engine.connect() as conn:
        return wrap(_popular(conn, log_table(), limit))

@app.get('/api/analytics/monthly-categories')
def monthly_categories(months: int = Query(6, ge=1, le=24)):
    now = datetime.now(TZ)
    first = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    begin_year = first.year + (first.month - months) // 12
    begin_month = (first.month - months) % 12 + 1
    begin = first.replace(year=begin_year, month=begin_month)
    with engine.connect() as conn:
        t = log_table()
        intent = t.c.intent
        records = conn.execute(select(t.c.created_at, intent).where(scoped(t, t.c.created_at >= begin))).all()
    grouped = defaultdict(Counter)
    labels = {}
    for timestamp, value in records:
        k = intent_key(value)
        grouped[as_datetime(timestamp).strftime('%Y-%m')][k] += 1
        labels[k] = intent_label(value)
    series = [{'key': k, 'label': lbl} for k, lbl in sorted(labels.items())]
    result = []
    for step in range(months):
        index = (first.month - months + step) % 12 + 1
        year = first.year + (first.month - months + step) // 12
        mo = f'{year:04}-{index:02}'
        result.append({'month': mo, 'label': mo, **dict(grouped[mo])})
    return wrap({'series': series, 'rows': result})

@app.get('/api/interactions')
def interactions(search: str = '', categoryId: str = 'all', from_date: date | None = Query(None, alias='from'), to: date | None = None, page: int = Query(1, ge=1), pageSize: int = Query(10, ge=1, le=100)):
    with engine.connect() as conn:
        t = log_table()
        conditions = []
        if search.strip():
            escaped = search.strip()[:120].replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')
            conditions.append(t.c.question.ilike(f'%{escaped}%', escape='\\'))
        intent = t.c.intent
        if categoryId and categoryId != 'all':
            if categoryId in ('belum-dikategorikan', 'belum-terklasifikasi'):
                conditions.append(or_(intent.is_(None), func.trim(intent) == ''))
            else:
                # Toleransi huruf besar, underscore, tanda hubung, dan spasi
                # untuk nilai intent yang tersimpan dari berbagai versi bot.
                normalized = func.lower(func.trim(intent))
                normalized = func.replace(func.replace(normalized, '_', '-'), ' ', '-')
                conditions.append(normalized == categoryId.strip().lower())
        if from_date:
            conditions.append(t.c.created_at >= datetime.combine(from_date, time.min, tzinfo=TZ))
        if to:
            conditions.append(t.c.created_at < datetime.combine(to + timedelta(days=1), time.min, tzinfo=TZ))
        where = scoped(t, *conditions)
        n = conn.execute(select(func.count()).select_from(t).where(where)).scalar_one()
        records = conn.execute(select(t).where(where).order_by(t.c.created_at.desc()).offset((page - 1) * pageSize).limit(pageSize)).all()
    return wrap([record(r, i) for i, r in enumerate(records)], {
        'total': n, 'page': page, 'pageSize': pageSize, 'totalPages': max(1, (n + pageSize - 1) // pageSize),
    })

@app.get('/api/interactions/recent')
def recent(limit: int = Query(6, ge=1, le=50)):
    with engine.connect() as conn:
        t = log_table()
        records = conn.execute(select(t).where(base_filter(t)).order_by(t.c.created_at.desc()).limit(limit)).all()
    return wrap([record(r, i) for i, r in enumerate(records)])

@app.get('/api/bot/status')
def bot_status():
    now = datetime.now(TZ)
    today = datetime.combine(now.date(), time.min, tzinfo=TZ)
    with engine.connect() as conn:
        t = log_table()
        all_count = total(conn, t)
        today_count = total(conn, t, t.c.created_at >= today)
        latest = conn.execute(select(func.max(t.c.created_at)).where(base_filter(t))).scalar_one()
    # There is no bot health / uptime / response latency in the supplied DB columns.
    return wrap({
        'name': 'ASCA Telegram Bot', 'status': 'unknown',
        'totalInteractions': all_count, 'interactionsToday': today_count,
        'lastActivityMinutesAgo': max(0, round((now - as_datetime(latest)).total_seconds() / 60)) if latest else None,
        'uptimePercent': None, 'averageResponseMs': None, 'queueDepth': None,
    })

# --- Sajikan frontend hasil build (npm run build -> dist/) dari origin yang sama ------
# Satu origin dengan /api = cookie sesi HttpOnly + SameSite=strict bekerja tanpa CORS.
# Letakkan PALING BAWAH agar tidak menimpa route /api di atas.
DIST_DIR = Path(os.getenv('FRONTEND_DIST') or Path(__file__).resolve().parent.parent / 'dist').resolve()
if (DIST_DIR / 'index.html').is_file():
    if (DIST_DIR / 'assets').is_dir():
        app.mount('/assets', StaticFiles(directory=DIST_DIR / 'assets'), name='assets')

    @app.get('/{full_path:path}', include_in_schema=False)
    def serve_frontend(full_path: str):
        if full_path == 'api' or full_path.startswith('api/'):
            raise HTTPException(status_code=404, detail='Endpoint tidak ditemukan.')
        candidate = (DIST_DIR / full_path).resolve()
        # Cegah path traversal; file statis di root dist (favicon, dll.) boleh dilayani.
        if full_path and candidate.is_file() and DIST_DIR in candidate.parents:
            return FileResponse(candidate)
        # SPA fallback: React Router yang menangani /login, /dashboard, dst.
        return FileResponse(DIST_DIR / 'index.html', headers={'Cache-Control': 'no-cache'})
