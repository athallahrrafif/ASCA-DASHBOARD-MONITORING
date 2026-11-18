# Satu image: build frontend (Node) -> disajikan oleh FastAPI (Python) pada origin yang sama.

FROM node:20-alpine AS web
WORKDIR /web
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.js postcss.config.js tailwind.config.js .env.production ./
COPY src ./src
RUN npm run build

FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app
COPY backend-monitoring/requirements.txt ./backend-monitoring/requirements.txt
RUN pip install -r backend-monitoring/requirements.txt
COPY backend-monitoring ./backend-monitoring
COPY --from=web /web/dist ./dist
WORKDIR /app/backend-monitoring
# Segarkan data simulasi dengan tanggal terkini (dipakai hanya jika DATABASE_URL kosong).
RUN python make_demo_db.py

# Render menyuntik $PORT. SATU worker: sesi login disimpan di memori proses.
# --proxy-headers: IP asli pengunjung (untuk pembatas percobaan login) di balik proxy Render.
ENV PORT=10000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 1 --proxy-headers --forwarded-allow-ips='*'"]
