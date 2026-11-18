import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, CircleHelp } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ChartCard from "@/components/cards/ChartCard";
import CategoryCard from "@/components/cards/CategoryCard";
import ErrorState from "@/components/ui/ErrorState";
import {
  ChartSkeleton,
  CardGridSkeleton,
} from "@/components/ui/LoadingSkeleton";
import ChartTooltip, {
  axisProps,
  gridProps,
} from "@/components/charts/ChartTooltip";
import { useAsync, usePolling } from "@/hooks/useAsync";
import {
  getAnalytics,
  getOverview,
  getPopularQuestions,
} from "@/services/analyticsService";
import { formatNumber } from "@/utils/format";
import logoUmb from "@/assets/institutions/logo-umb.png";
import logoUnj from "@/assets/institutions/logo-unj.png";
import logoTrisakti from "@/assets/institutions/logo-trisakti.png";

const AUTO_REFRESH_MS = 15_000; // Auto-refresh data setiap 15 detik.

// Sama dengan Dashboard: warna untuk enam kelas Intent Classification.
// Intent historis di luar enam kelas tetap ditampilkan dengan warna netral.
const INTENT_COLORS = {
  definition: "#6D4AFF",
  procedure: "#3B82F6",
  requirements: "#14B8A6",
  schedule: "#F59E0B",
  consequence: "#EC4899",
  general: "#64748B",
};

const INTENT_LABELS = {
  definition: "Pengertian",
  procedure: "Prosedur",
  requirements: "Persyaratan",
  schedule: "Jadwal",
  consequence: "Konsekuensi",
  general: "Umum",
  "belum-dikategorikan": "Belum terklasifikasi",
};

function intentColor(intentId) {
  return INTENT_COLORS[String(intentId ?? "").toLowerCase()] ?? "#94A3B8";
}

function intentLabel(intentId) {
  const id = String(intentId ?? "").trim();
  return INTENT_LABELS[id.toLowerCase()] ?? (id || "Belum terklasifikasi");
}

const RANGES = [
  { value: "7d", label: "7 hari" },
  { value: "30d", label: "30 hari" },
];

// Gunakan urutan warna yang sama seperti donut chart halaman Dashboard.
const INSTITUTION_COLORS = [
  "#6D4AFF",
  "#3B82F6",
  "#14B8A6",
  "#F59E0B",
  "#64748B",
  "#EC4899",
];

// Logo hanya untuk tampilan. Nama, jumlah dan persentase tetap berasal dari API.
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

export default function Analytics() {
  const [range, setRange] = useState("30d");
  const { data, loading, error, refresh, refreshedAt } = useAsync(
    () => getAnalytics({ range }),
    [range],
  );
  const popular = useAsync(() => getPopularQuestions(7), []);
  // Overview mencakup semua waktu, sama dengan donut chart di Dashboard.
  const overview = useAsync(() => getOverview(), []);

  // Interval otomatis dibersihkan saat pindah halaman.
  usePolling(refresh, AUTO_REFRESH_MS);
  usePolling(overview.refresh, AUTO_REFRESH_MS);
  usePolling(popular.refresh, AUTO_REFRESH_MS);

  const totalQuestions =
    data?.questionsByCategory?.reduce((sum, c) => sum + c.questions, 0) ?? 0;
  const institutionDistribution = Array.isArray(
    overview.data?.institutionDistribution,
  )
    ? overview.data.institutionDistribution
    : [];
  const institutionTotal = institutionDistribution.reduce(
    (sum, item) => sum + Number(item.questions || 0),
    0,
  );

  const refreshAll = () => {
    refresh();
    overview.refresh();
    popular.refresh();
  };

  return (
    <>
      <PageHeader
        title="Analitik"
        subtitle="Analisis aktivitas chatbot berdasarkan jumlah pertanyaan, intent, dan asal institusi."
        onRefresh={refreshAll}
        refreshedAt={refreshedAt}
        loading={loading || overview.loading}
        actions={
          <div
            className="inline-flex rounded-xl border border-line bg-surface p-1"
            role="group"
            aria-label="Rentang waktu"
          >
            {RANGES.map((option) => (
              <button
                key={option.value}
                onClick={() => setRange(option.value)}
                aria-pressed={range === option.value}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors
                  ${range === option.value ? "bg-purple-500 text-white" : "text-muted hover:text-ink"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      {error ? (
        <ErrorState error={error} onRetry={refresh} />
      ) : loading && !data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <>
          <ChartCard
            title="Jumlah pertanyaan per hari"
            subtitle={
              range === "7d"
                ? "Tujuh hari terakhir"
                : "Tiga puluh hari terakhir"
            }
            footnote="Grafik menunjukkan jumlah pertanyaan masuk setiap hari, bukan jumlah pengguna unik."
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.questionsPerDay}
                  margin={{ top: 4, right: 8, left: -18, bottom: 0 }}
                >
                  <CartesianGrid {...gridProps} />
                  <XAxis
                    dataKey="label"
                    {...axisProps}
                    interval={range === "7d" ? 0 : 3}
                  />
                  <YAxis {...axisProps} width={44} />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ stroke: "var(--line)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="questions"
                    name="Pertanyaan"
                    stroke="#6D4AFF"
                    strokeWidth={2.4}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Pertanyaan berdasarkan kategori intent"
              subtitle="Distribusi hasil Intent Classification pada periode yang dipilih"
            >
              <div className="h-[290px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.questionsByCategory}
                    margin={{ top: 4, right: 6, left: -18, bottom: 0 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis
                      dataKey="label"
                      {...axisProps}
                      interval={0}
                      angle={-22}
                      textAnchor="end"
                      height={68}
                    />
                    <YAxis {...axisProps} width={44} />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "var(--line)", fillOpacity: 0.35 }}
                    />
                    <Bar
                      dataKey="questions"
                      name="Pertanyaan"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={42}
                    >
                      {data.questionsByCategory.map((entry) => (
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

            {overview.loading && !overview.data ? (
              <ChartSkeleton />
            ) : overview.error ? (
              <ErrorState error={overview.error} onRetry={overview.refresh} />
            ) : (
              <ChartCard
                title="Sebaran pertanyaan per institusi"
                subtitle="Seluruh pertanyaan tercatat (tidak mengikuti filter 7/30 hari)"
              >
                {institutionTotal > 0 ? (
                  <div className="flex min-h-[290px] flex-col items-center justify-center gap-4 sm:flex-row">
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
                        <span className="mt-1 text-[10px] text-muted">
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
                          className="flex items-center justify-between gap-2 text-[12px]"
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
                  <p className="py-14 text-center text-[13px] text-muted">
                    Data asal institusi belum tersedia.
                  </p>
                )}
              </ChartCard>
            )}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
            <ChartCard
              title="Topik pertanyaan terbanyak"
              subtitle="Dikelompokkan dari teks pertanyaan mahasiswa"
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.topTopics}
                    layout="vertical"
                    margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid {...gridProps} vertical horizontal={false} />
                    <XAxis type="number" {...axisProps} />
                    <YAxis
                      type="category"
                      dataKey="topic"
                      {...axisProps}
                      width={160}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "var(--line)", fillOpacity: 0.35 }}
                    />
                    <Bar
                      dataKey="count"
                      name="Pertanyaan"
                      fill="#6D4AFF"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <section className="card p-5">
              <h2 className="font-display text-[19px] text-ink">
                Pertanyaan paling sering
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                Urutan berdasarkan jumlah kemunculan di Telegram.
              </p>

              <ol className="mt-4 divide-y divide-line">
                {(popular.data || []).map((item, index) => (
                  <li key={item.id} className="flex items-start gap-3 py-3">
                    <span className="tabular mt-0.5 w-5 shrink-0 font-mono text-[13px] text-muted">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] leading-snug text-ink">
                        {item.question}
                      </p>
                      <p className="mt-1 text-[12px] text-muted">
                        {intentLabel(item.categoryId)}
                      </p>
                    </div>
                    <span className="tabular shrink-0 font-mono text-[13px] font-medium text-ink">
                      {formatNumber(item.count)}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="mt-8">
            <h2 className="font-display text-[22px] text-ink">
              Analisis kategori intent
            </h2>
            <p className="mt-1.5 text-[14px] text-muted">
              Porsi setiap intent terhadap {formatNumber(totalQuestions)}{" "}
              pertanyaan pada periode yang dipilih.
            </p>

            {loading ? (
              <CardGridSkeleton />
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.questionsByCategory.map((entry) => (
                  <CategoryCard
                    key={entry.categoryId}
                    categoryId={entry.categoryId}
                    label={entry.label}
                    color={intentColor(entry.categoryId)}
                    questions={entry.questions}
                    total={totalQuestions}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="mt-8">
            <ChartCard
              title="Sebaran waktu penggunaan"
              subtitle="Jumlah pertanyaan menurut jam"
              footnote="Berguna untuk menentukan jam sibuk layanan dan jadwal pemeliharaan bot."
            >
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.hourlyUsage}
                    margin={{ top: 4, right: 6, left: -18, bottom: 0 }}
                  >
                    <CartesianGrid {...gridProps} />
                    <XAxis
                      dataKey="hour"
                      {...axisProps}
                      tickFormatter={(v) => `${v}.00`}
                    />
                    <YAxis {...axisProps} width={44} />
                    <Tooltip
                      content={
                        <ChartTooltip labelFormat={(v) => `Pukul ${v}.00`} />
                      }
                      cursor={{ fill: "var(--line)", fillOpacity: 0.35 }}
                    />
                    <Bar
                      dataKey="questions"
                      name="Pertanyaan"
                      fill="#4B32A8"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </>
      )}
    </>
  );
}
