import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  Database,
  LayoutDashboard,
  MessageCircle,
  Send,
  Sparkles,
} from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import Footer from "@/components/landing/Footer";
import TelegramMockup from "@/components/landing/TelegramMockup";
import FlowDiagram from "@/components/landing/FlowDiagram";
import Button from "@/components/ui/Button";
import { getTelegramUrl } from "@/config/env";
import { formatNumber } from "@/utils/format";
import { getOverview } from "@/services/analyticsService";
import { useAsync, usePolling } from "@/hooks/useAsync";

const STEPS = [
  {
    n: "01",
    title: "Buka Telegram",
    body: "Cari bot ASCA atau buka tautan undangan. Tidak perlu memasang aplikasi baru.",
    icon: Send,
  },
  {
    n: "02",
    title: "Kirim pertanyaan",
    body: "Tulis pertanyaan dengan bahasa sehari-hari, misalnya “syarat ambil Capstone apa saja?”.",
    icon: MessageCircle,
  },
  {
    n: "03",
    title: "ASCA memproses",
    body: "Pertanyaan dicocokkan dengan panduan akademik dan data mata kuliah yang terdaftar.",
    icon: Bot,
  },
  {
    n: "04",
    title: "Jawaban diterima",
    body: "Jawaban dikirim beserta rujukan dokumen sumbernya agar bisa diperiksa ulang.",
    icon: BookOpen,
  },
];

const SCOPE = [
  {
    title: "Kalender akademik",
    body: "Jadwal kegiatan perkuliahan, tanggal penting, dan periode akademik berdasarkan dokumen resmi yang tersedia.",
    icon: CalendarDays,
  },
  {
    title: "KRS & mata kuliah",
    body: "Jadwal pengisian KRS, batas SKS, prasyarat antar mata kuliah, dan struktur kurikulum.",
    icon: BookOpen,
  },
  {
    title: "Panduan akademik",
    body: "Aturan studi, evaluasi, dan dokumen resmi yang menjadi sumber jawaban chatbot.",
    icon: Database,
  },
];

// Sembunyikan sementara, tanpa menghapus komponen agar mudah diaktifkan lagi.
const SHOW_CATALOG_BUTTON = false;
const SHOW_BOTTOM_CTA = false;

export default function Landing() {
  const telegramUrl = getTelegramUrl();
  const reduce = useReducedMotion();

  // Sama dengan Dashboard: data berasal dari GET /api/analytics/overview.
  const overview = useAsync(() => getOverview(), []);
  usePolling(overview.refresh, 30000);
  const stats = overview.data?.stats;
  const landingStats = [
    { label: "Total pertanyaan", value: stats?.totalQuestions },
    { label: "Pertanyaan bulan ini", value: stats?.questionsThisMonth },
    { label: "Sudah berkategori", value: stats?.categorizedQuestions },
  ];

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <div className="min-h-screen bg-canvas">
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="grid-paper pointer-events-none absolute inset-0 opacity-70
          [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2
          rounded-full bg-purple-500/10 blur-[110px]"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_auto] lg:pb-28 lg:pt-24">
          <div>
            <motion.div {...rise(0)} className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1.5
                text-[11.5px] font-semibold tracking-wide text-purple-700 dark:text-purple-200"
              >
                <Sparkles size={12} strokeWidth={2.4} aria-hidden /> AI POWERED
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3 py-1.5
                text-[11.5px] font-semibold tracking-wide text-blue-700 dark:text-blue-300"
              >
                <Send size={12} strokeWidth={2.4} aria-hidden /> TELEGRAM
                INTEGRATED
              </span>
            </motion.div>

            <motion.h1
              {...rise(0.06)}
              className="mt-6 font-display text-display-lg text-ink"
            >
              Informasi akademik lebih mudah dengan ASCA
            </motion.h1>

            <motion.p
              {...rise(0.12)}
              className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-muted"
            >
              ASCA (Academic Assistant) membantu mahasiswa memperoleh informasi
              akademik melalui AI Chatbot yang terintegrasi dengan Telegram.
            </motion.p>

            <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap gap-3">
              {telegramUrl ? (
                <Button
                  href={telegramUrl}
                  variant="gradient"
                  size="lg"
                  icon={Send}
                >
                  Buka ASCA di Telegram
                </Button>
              ) : (
                <Button
                  as="button"
                  variant="gradient"
                  size="lg"
                  icon={Send}
                  disabled
                  title="Atur VITE_TELEGRAM_BOT_URL pada berkas .env"
                >
                  Buka ASCA di Telegram
                </Button>
              )}
              <Button
                to="/dashboard"
                variant="secondary"
                size="lg"
                icon={LayoutDashboard}
              >
                Lihat dashboard
              </Button>
            </motion.div>

            <motion.dl
              {...rise(0.24)}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-7"
              aria-busy={overview.loading && !stats}
            >
              {landingStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[12.5px] leading-snug text-muted">
                    {stat.label}
                  </dt>
                  <dd className="tabular mt-1.5 font-mono text-[24px] leading-none text-ink">
                    {stat.value == null ? "—" : formatNumber(stat.value)}
                  </dd>
                </div>
              ))}
            </motion.dl>
            {overview.error ? (
              <p className="mt-3 text-[12px] text-muted" role="status">
                {stats
                  ? "Pembaruan statistik gagal; menampilkan data terakhir."
                  : "Statistik belum dapat dimuat."}{" "}
                <button
                  type="button"
                  onClick={overview.refresh}
                  className="font-semibold text-purple-600 hover:underline dark:text-purple-300"
                >
                  Coba lagi
                </button>
              </p>
            ) : null}
          </div>

          <motion.div
            {...rise(0.3)}
            className="flex justify-center lg:justify-end"
          >
            <TelegramMockup />
          </motion.div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="font-display text-display-md text-ink">
                Apa itu ASCA?
              </h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
                ASCA adalah academic assistant yang membantu mahasiswa
                mendapatkan informasi akademik melalui chatbot Telegram.
                Alih-alih menelusuri berkas panduan berpuluh halaman, mahasiswa
                cukup bertanya seperti berbicara dengan staf akademik.
              </p>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
                Setiap jawaban bersumber dari dokumen resmi yang terdaftar, dan
                setiap percakapan tercatat dalam bentuk anonim sebagai bahan
                evaluasi layanan.
              </p>

              <div className="mt-7 rounded-card border border-purple-500/20 bg-purple-500/[0.06] p-5">
                <p className="font-display text-[17px] text-ink">
                  Di mana chatbot-nya?
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  Di Telegram. Situs ini tidak menjalankan percakapan AI —
                  perannya adalah halaman informasi sekaligus dashboard
                  pemantauan layanan.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-6 text-[13.5px] font-semibold text-muted">
                Alur layanan, dari pertanyaan sampai data
              </p>
              <FlowDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section id="cara-kerja" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <h2 className="font-display text-display-md text-ink">
            Cara kerjanya
          </h2>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted">
            Empat langkah, seluruhnya di dalam aplikasi yang sudah ada di ponsel
            mahasiswa.
          </p>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ n, title, body, icon: Icon }) => (
              <li
                key={n}
                className="group bg-surface p-6 transition-colors duration-300 hover:bg-purple-500/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-500">
                    <Icon size={18} strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="font-mono text-[13px] text-muted">{n}</span>
                </div>
                <p className="mt-5 font-display text-[19px] leading-snug text-ink">
                  {title}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CAKUPAN */}
      <section id="cakupan" className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-display-md text-ink">
                Yang bisa ditanyakan
              </h2>
              <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted">
                Cakupan jawaban dibatasi pada dokumen akademik yang terdaftar
                dalam knowledge base.
              </p>
            </div>
            {SHOW_CATALOG_BUTTON && (
              <Button to="/academic-info" variant="secondary" icon={BookOpen}>
                Lihat katalog informasi
              </Button>
            )}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {SCOPE.map(({ title, body, icon: Icon }) => (
              <article
                key={title}
                className="card p-6 transition-shadow duration-300 ease-calm hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Icon size={19} strokeWidth={1.9} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-[19px] leading-snug text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA PENUTUP: sementara disembunyikan sesuai permintaan */}
      {SHOW_BOTTOM_CTA && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-purple-700 via-purple-500 to-blue-500 px-8 py-14 text-center sm:px-14">
              <div
                aria-hidden
                className="grid-paper absolute inset-0 opacity-20"
              />
              <div className="relative">
                <h2 className="mx-auto max-w-xl font-display text-display-md text-white">
                  Mulai bertanya lewat Telegram
                </h2>
                <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/80">
                  Temukan informasi akademik dengan lebih mudah melalui ASCA AI
                  Chatbot.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {telegramUrl ? (
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-semibold text-purple-700
                      transition-transform duration-200 hover:scale-[1.02]"
                    >
                      <Send size={17} aria-hidden /> Buka ASCA di Telegram
                    </a>
                  ) : null}
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-[15px]
                    font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
                  >
                    <BarChart3 size={17} aria-hidden /> Lihat dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Teks prototipe dalam Footer.jsx akan disesuaikan terpisah. */}
      <Footer />
    </div>
  );
}
