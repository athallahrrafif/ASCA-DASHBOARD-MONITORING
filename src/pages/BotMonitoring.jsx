import {
  Bot,
  CalendarDays,
  Clock,
  ExternalLink,
  MessageSquareText,
  Send,
  ShieldAlert,
  Tags,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/cards/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";
import Button from "@/components/ui/Button";
import { StatCardSkeleton, Skeleton } from "@/components/ui/LoadingSkeleton";
import { useAsync, usePolling } from "@/hooks/useAsync";
import { getBotStatus, getOverview } from "@/services/analyticsService";
import { env, getTelegramUrl } from "@/config/env";
import { formatNumber } from "@/utils/format";

// Endpoint /bot/status membaca log PostgreSQL, bukan memeriksa komponen chatbot.
// Jangan menampilkan status 'Normal' untuk layanan yang belum punya health check.
const CHECKS = [
  {
    id: "database",
    label: "Akses riwayat interaksi",
    detail: "API monitoring berhasil membaca catatan interaksi.",
    verified: true,
  },
  {
    id: "webhook",
    label: "Webhook Telegram",
    detail: "Belum ada pemeriksaan webhook dari Bot API.",
    verified: false,
  },
  {
    id: "backend",
    label: "Layanan pemrosesan chatbot",
    detail: "Status layanan pemrosesan bot belum dipantau.",
    verified: false,
  },
  {
    id: "kb",
    label: "Knowledge base",
    detail: "Kondisi knowledge base belum dipantau.",
    verified: false,
  },
  {
    id: "queue",
    label: "Antrean pesan",
    detail: "Jumlah pesan dalam antrean belum dicatat.",
    verified: false,
  },
];

export default function BotMonitoring() {
  const { data, meta, loading, error, refresh, refreshedAt } = useAsync(
    () => getBotStatus(),
    [],
  );
  const overview = useAsync(() => getOverview(), []);
  const telegramUrl = getTelegramUrl();

  // Sama seperti Dashboard: baca ulang data secara berkala tanpa refresh manual.
  usePolling(refresh, 30000);
  usePolling(overview.refresh, 30000);

  const refreshAll = () => {
    refresh();
    overview.refresh();
  };
  const lastActivity = Number.isFinite(data?.lastActivityMinutesAgo)
    ? `${data.lastActivityMinutesAgo} menit lalu`
    : "Belum ada data";
  const categorized = overview.error
    ? null
    : overview.data?.stats?.categorizedQuestions;
  const dataSource =
    meta?.source === "simulation"
      ? "Simulasi lokal"
      : meta?.source === "database"
        ? "Database melalui API monitoring"
        : "Belum diketahui";

  return (
    <>
      <PageHeader
        title="Status Bot"
        subtitle="Pantau interaksi yang tercatat dan ketersediaan data monitoring chatbot Telegram."
        onRefresh={refreshAll}
        refreshedAt={refreshedAt}
        loading={loading || overview.loading}
      />

      {error ? (
        <ErrorState error={error} onRetry={refresh} />
      ) : (
        <>
          <section className="card overflow-hidden">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  <Bot size={24} strokeWidth={1.9} aria-hidden />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="font-display text-[22px] leading-tight text-ink">
                      {loading ? "Memuat…" : data.name}
                    </h2>
                    {!loading && data ? (
                      data.status && data.status !== "unknown" ? (
                        <StatusBadge status={data.status} dot />
                      ) : (
                        <span className="text-[12px] text-muted">
                          Status bot belum terverifikasi
                        </span>
                      )
                    ) : null}
                  </div>
                  <p className="mt-1 font-mono text-[13px] text-muted">
                    {env.telegramBotUsername}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                {telegramUrl ? (
                  <Button
                    href={telegramUrl}
                    variant="gradient"
                    icon={Send}
                    iconRight={ExternalLink}
                  >
                    Buka Telegram
                  </Button>
                ) : (
                  <>
                    <Button
                      as="button"
                      variant="secondary"
                      icon={Send}
                      disabled
                    >
                      Buka Telegram
                    </Button>
                    <p className="text-[12px] text-muted">
                      Isi VITE_TELEGRAM_BOT_URL pada .env untuk mengaktifkan.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-line bg-ink/[0.015] px-6 py-4 dark:bg-white/[0.02]">
              <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
                <ShieldAlert
                  size={15}
                  className="mt-0.5 shrink-0 text-purple-500"
                  aria-hidden
                />
                Percakapan berlangsung sepenuhnya di Telegram. Situs ini hanya
                membaca ringkasan status dan catatan interaksi yang sudah
                dianonimkan.
              </p>
            </div>
          </section>

          <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading || overview.loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            ) : (
              <>
                <StatCard
                  label="Total interaksi"
                  value={data?.totalInteractions ?? "—"}
                  icon={MessageSquareText}
                  hint="Tercatat dalam log"
                />
                <StatCard
                  label="Aktivitas terakhir"
                  value={lastActivity}
                  icon={Clock}
                  accent="blue"
                  hint="Interaksi terakhir tercatat"
                />
                <StatCard
                  label="Interaksi hari ini"
                  value={data?.interactionsToday ?? "—"}
                  icon={CalendarDays}
                  hint="Sejak pukul 00.00 WIB"
                />
                <StatCard
                  label="Sudah berkategori"
                  value={typeof categorized === "number" ? categorized : "—"}
                  icon={Tags}
                  accent="blue"
                  hint={
                    overview.error
                      ? "Statistik kategori belum tersedia"
                      : "Dari total interaksi tercatat"
                  }
                />
              </>
            )}
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="card p-5">
              <h2 className="font-display text-[19px] text-ink">
                Pemeriksaan layanan
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                Status terverifikasi dari API monitoring; komponen bot lain
                belum dipantau.
              </p>

              <ul className="mt-4 divide-y divide-line">
                {CHECKS.map((check) => (
                  <li key={check.id} className="flex items-start gap-3 py-3.5">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${check.verified ? "bg-emerald-500" : "bg-slate-400"}`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold text-ink">
                        {check.label}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-muted">
                        {check.detail}
                      </p>
                    </div>
                    <StatusBadge
                      status={check.verified ? "online" : "unknown"}
                      tone={check.verified ? "success" : "neutral"}
                      label={check.verified ? "Terbaca" : "Belum dipantau"}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5">
              <h2 className="font-display text-[19px] text-ink">
                Konfigurasi kanal
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                Nilai dibaca dari environment, tidak ditulis di dalam kode.
              </p>

              <dl className="mt-4 divide-y divide-line text-[13.5px]">
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-muted">Username bot</dt>
                  <dd className="font-mono text-[12.5px] text-ink">
                    {env.telegramBotUsername}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-muted">Tautan bot</dt>
                  <dd className="truncate font-mono text-[12.5px] text-ink">
                    {telegramUrl || "belum diatur"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-muted">Sumber data</dt>
                  <dd className="font-mono text-[12.5px] text-ink">
                    {loading ? "Memeriksa…" : dataSource}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-muted">Antrean pesan</dt>
                  <dd className="tabular font-mono text-[12.5px] text-ink">
                    {loading ? (
                      <Skeleton className="h-4 w-8" />
                    ) : Number.isFinite(data?.queueDepth) ? (
                      formatNumber(data.queueDepth)
                    ) : (
                      "Belum dipantau"
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </>
      )}
    </>
  );
}
