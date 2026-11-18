import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpRight,
  // Bot, // Disembunyikan bersama kartu Bot Telegram
  Building2,
  CircleHelp,
  MessageSquareText,
  // Send, // Disembunyikan bersama kartu Bot Telegram
  TrendingUp,
  Users,
  UsersRound,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/cards/StatCard";
import ChartCard from "@/components/cards/ChartCard";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import {
  StatCardSkeleton,
  ChartSkeleton,
  Skeleton,
} from "@/components/ui/LoadingSkeleton";
import ChartTooltip, {
  axisProps,
  gridProps,
} from "@/components/charts/ChartTooltip";
import { useAsync, usePolling } from "@/hooks/useAsync";
import {
  getOverview,
  getAnalytics,
  // getBotStatus, // Tidak dipanggil selama kartu disembunyikan
} from "@/services/analyticsService";
import { getRecentInteractions } from "@/services/interactionService";
import { formatNumber, relativeTime } from "@/utils/format";
// import { env } from "@/config/env"; // Dipakai kartu Bot Telegram
import logoUmb from "@/assets/institutions/logo-umb.png";
import logoUnj from "@/assets/institutions/logo-unj.png";
import logoTrisakti from "@/assets/institutions/logo-trisakti.png";

const AUTO_REFRESH_MS = 15_000; // Auto-refresh data setiap 15 detik.

// Warna berdasarkan hasil Intent Classification, bukan kategori dokumen.
// Nilai historis di luar enam intent tidak ditebak: gunakan warna netral.
const INTENT_COLORS = {
  definition: "#6D4AFF",
  procedure: "#3B82F6",
  requirements: "#14B8A6",
  schedule: "#F59E0B",
  consequence: "#EC4899",
  general: "#64748B",
};

function intentColor(intentId) {
  return INTENT_COLORS[String(intentId ?? "").toLowerCase()] ?? "#94A3B8";
}

// Konsisten dengan palet grafik ASCA. Data dan jumlah tetap berasal dari database.
const INSTITUTION_COLORS = [
  "#6D4AFF",
  "#3B82F6",
  "#14B8A6",
  "#F59E0B",
  "#64748B",
  "#EC4899",
];

// Hanya memetakan nama institusi ke logo; jumlah dan persentase tetap dari API.
function InstitutionLogo({ institution, color }) {
  const name = String(institution ?? "")
    .trim()
    .toLowerCase();
  const isUnknown =
    !name ||
    ["tidak diketahui", "belum dikategorikan", "unknown", "null"].includes(
      name,
    );

  let logo = null;
  if (name === "umb" || name.includes("mercu buana")) {
    logo = logoUmb;
  } else if (name === "unj" || name.includes("negeri jakarta")) {
    logo = logoUnj;
  } else if (name.includes("trisakti")) {
    logo = logoTrisakti;
  }

  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 bg-white p-0.5 shadow-sm"
      style={{ borderColor: color }}
      aria-hidden="true"
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-7 w-7 object-contain"
        />
      ) : isUnknown ? (
        <CircleHelp size={18} className="text-slate-500" />
      ) : (
        <Building2 size={18} className="text-slate-500" />
      )}
    </span>
  );
}

export default function Dashboard() {
  const overview = useAsync(() => getOverview(), []);
  const analytics = useAsync(() => getAnalytics({ range: "30d" }), []);
  const recent = useAsync(() => getRecentInteractions(6), []);

  // Polling hanya aktif saat halaman Dashboard terpasang (mounted).
  usePolling(overview.refresh, AUTO_REFRESH_MS);
  usePolling(analytics.refresh, AUTO_REFRESH_MS);
  usePolling(recent.refresh, AUTO_REFRESH_MS);

  // const bot = useAsync(() => getBotStatus(), []); // Aktifkan lagi saat kartu ditampilkan

  const loading = overview.loading || analytics.loading;

  const refreshAll = () => {
    overview.refresh();
    analytics.refresh();
    recent.refresh();

    // bot.refresh(); // Aktifkan lagi saat kartu ditampilkan
  };

  const stats = overview.data?.stats;
  const institutionDistribution = Array.isArray(
    overview.data?.institutionDistribution,
  )
    ? overview.data.institutionDistribution
    : [];

  const institutionTotal = institutionDistribution.reduce(
    (sum, item) => sum + Number(item.questions || 0),
    0,
  );

  return (
    <>
      <PageHeader
        title="ASCA Overview"
        subtitle="Pantau penggunaan layanan informasi akademik melalui Telegram."
        onRefresh={refreshAll}
        refreshedAt={overview.refreshedAt}
        loading={loading}
      />

      {overview.error ? (
        <ErrorState error={overview.error} onRetry={overview.refresh} />
      ) : (
        <section
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Ringkasan angka"
        >
          {overview.loading && !stats ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            <>
              <StatCard
                label="Total pertanyaan"
                value={stats.totalQuestions ?? 0}
                icon={MessageSquareText}
                hint="Tercatat di database"
                accent="blue"
              />

              <StatCard
                label="Pertanyaan bulan ini"
                value={stats.questionsThisMonth ?? 0}
                icon={TrendingUp}
                hint="Bulan berjalan"
              />

              <StatCard
                label="Sudah berkategori"
                value={stats.categorizedQuestions ?? 0}
                icon={Users}
                hint="Intent berhasil tercatat"
              />

              <StatCard
                label="Belum berkategori"
                value={stats.uncategorizedQuestions ?? 0}
                icon={UsersRound}
                hint="Intent belum tercatat"
                accent="blue"
              />
            </>
          )}
        </section>
      )}

      {/* Grafik harian dan sebaran institusi */}
      <section className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        {analytics.loading && !analytics.data ? (
          <ChartSkeleton />
        ) : analytics.error ? (
          <ErrorState error={analytics.error} onRetry={analytics.refresh} />
        ) : (
          <ChartCard
            title="Pertanyaan per hari"
            subtitle="30 hari terakhir, seluruh kategori"
            action={
              <Link
                to="/analytics"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-300"
              >
                Analitik lengkap <ArrowUpRight size={14} aria-hidden />
              </Link>
            }
          >
            <div className="h-[268px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.data.questionsPerDay}
                  margin={{ top: 4, right: 6, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#6D4AFF"
                        stopOpacity={0.32}
                      />
                      <stop
                        offset="100%"
                        stopColor="#6D4AFF"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid {...gridProps} />

                  <XAxis dataKey="label" {...axisProps} interval={4} />

                  <YAxis {...axisProps} width={44} />

                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: "var(--line)" }}
                  />

                  <Area
                    type="monotone"
                    dataKey="questions"
                    name="Pertanyaan"
                    stroke="#6D4AFF"
                    strokeWidth={2.2}
                    fill="url(#dash-area)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        <div className="grid h-full gap-4">
          {overview.loading && !overview.data ? (
            <Skeleton className="h-full min-h-[330px] rounded-card" />
          ) : overview.error ? (
            <ErrorState error={overview.error} onRetry={overview.refresh} />
          ) : (
            <>
              <section
                className="card flex h-full flex-col p-5"
                aria-label="Sebaran pertanyaan per institusi"
              >
                <h2 className="font-display text-[19px] text-ink">
                  Sebaran pertanyaan per institusi
                </h2>

                <p className="mt-1 text-[12.5px] text-muted">
                  Berdasarkan seluruh pertanyaan yang tercatat
                </p>

                {institutionTotal > 0 ? (
                  <div className="mt-3 flex flex-1 flex-col items-center justify-center gap-3 sm:flex-row">
                    <div
                      className="relative h-[172px] w-[172px] shrink-0"
                      role="img"
                      aria-label="Diagram donat sebaran pertanyaan berdasarkan institusi"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={institutionDistribution}
                            dataKey="questions"
                            nameKey="institution"
                            cx="50%"
                            cy="50%"
                            innerRadius={51}
                            outerRadius={78}
                            paddingAngle={2}
                            stroke="none"
                          >
                            {institutionDistribution.map((item, index) => (
                              <Cell
                                key={item.institution}
                                fill={
                                  INSTITUTION_COLORS[
                                    index % INSTITUTION_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Pie>

                          <Tooltip
                            formatter={(value) => [
                              `${formatNumber(value)} pertanyaan`,
                              "Jumlah",
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display text-[23px] leading-none text-ink">
                          {formatNumber(institutionTotal)}
                        </span>
                        <span className="mt-1 text-[11px] text-muted">
                          Pertanyaan
                        </span>
                      </div>
                    </div>

                    <ul
                      className="w-full min-w-0 flex-1 space-y-2"
                      aria-label="Rincian per institusi"
                    >
                      {institutionDistribution.map((item, index) => (
                        <li
                          key={item.institution}
                          className="flex items-center justify-between gap-2 text-[12.5px]"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <InstitutionLogo
                              institution={item.institution}
                              color={
                                INSTITUTION_COLORS[
                                  index % INSTITUTION_COLORS.length
                                ]
                              }
                            />

                            <span className="break-words text-ink">
                              {item.institution}
                            </span>
                          </div>

                          <span className="shrink-0 whitespace-nowrap text-right font-semibold text-ink">
                            {formatNumber(item.questions)} (
                            {(
                              (Number(item.questions) / institutionTotal) *
                              100
                            ).toFixed(1)}
                            %)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-6 text-[13px] text-muted">
                    Data asal institusi belum tersedia.
                  </p>
                )}
              </section>

              {/*
                ======================================================
                KARTU BOT TELEGRAM DISEMBUNYIKAN SEMENTARA
                ======================================================

                Kode tetap disimpan agar bisa digunakan kembali.
                Untuk mengaktifkan, hapus komentar pembungkus ini
                serta aktifkan import, hook bot, dan bot.refresh()
                yang dikomentari di bagian atas.

              <section className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                      <Bot size={19} strokeWidth={1.9} aria-hidden />
                    </span>

                    <div>
                      <p className="font-display text-[17px] leading-tight text-ink">
                        Bot Telegram
                      </p>

                      <p className="mt-0.5 font-mono text-[12px] text-muted">
                        {env.telegramBotUsername}
                      </p>
                    </div>
                  </div>
                </div>

                {bot.data ? (
                  <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4 text-[13px]">
                    <div>
                      <dt className="text-muted">Interaksi hari ini</dt>
                      <dd className="tabular mt-0.5 font-semibold text-ink">
                        {bot.data.interactionsToday ?? 0}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-muted">Aktivitas terakhir</dt>
                      <dd className="mt-0.5 font-semibold text-ink">
                        {bot.data.lastActivityMinutesAgo == null
                          ? "Belum tercatat"
                          : `${bot.data.lastActivityMinutesAgo} menit lalu`}
                      </dd>
                    </div>
                  </dl>
                ) : null}

                <Link
                  to="/bot-monitoring"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-300"
                >
                  <Send size={14} aria-hidden /> Lihat status layanan
                </Link>
              </section>
              */}
            </>
          )}
        </div>
      </section>

      {/* Kategori + interaksi terbaru */}
      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        {analytics.loading && !analytics.data ? (
          <ChartSkeleton />
        ) : analytics.data ? (
          <ChartCard
            title="Pertanyaan per kategori intent"
            subtitle="Distribusi berdasarkan hasil Intent Classification"
          >
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.data.questionsByCategory}
                  margin={{ top: 4, right: 6, left: -18, bottom: 0 }}
                >
                  <CartesianGrid {...gridProps} />

                  <XAxis
                    dataKey="label"
                    {...axisProps}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={54}
                  />

                  <YAxis {...axisProps} width={44} />

                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{
                      fill: "var(--line)",
                      fillOpacity: 0.35,
                    }}
                  />

                  <Bar
                    dataKey="questions"
                    name="Pertanyaan"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  >
                    {analytics.data.questionsByCategory.map((entry) => (
                      <Cell
                        key={entry.categoryId}
                        fill={intentColor(entry.categoryId)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        ) : null}

        <section className="card flex flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[19px] text-ink">
                Interaksi terbaru
              </h2>

              <p className="mt-1 text-[13px] text-muted">
                Pertanyaan terbaru beserta institusi dan intent-nya.
              </p>
            </div>

            <Link
              to="/interactions"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-300"
            >
              Semua data <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>

          <div className="mt-4 flex-1">
            {recent.loading && !recent.data ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : recent.error ? (
              <ErrorState error={recent.error} onRetry={recent.refresh} />
            ) : !recent.data?.length ? (
              <EmptyState
                title="Belum ada interaksi"
                description="Data akan muncul setelah mahasiswa bertanya melalui Telegram."
              />
            ) : (
              <ul className="divide-y divide-line">
                {recent.data.map((row) => (
                  <li key={row.id} className="flex items-start gap-3 py-3">
                    <span
                      className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor: intentColor(row.categoryId),
                      }}
                      aria-hidden
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] text-ink">
                        {row.question}
                      </p>

                      <p className="mt-0.5 text-[12px] text-muted">
                        {row.institution || "Tidak diketahui"} ·{" "}
                        {row.category || row.intent || "Belum terklasifikasi"}
                      </p>
                    </div>

                    <span className="shrink-0 text-[11.5px] text-muted">
                      {relativeTime(row.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
