import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import ChartCard from '@/components/cards/ChartCard'
import StatCard from '@/components/cards/StatCard'
import StatusBadge from '@/components/ui/StatusBadge'
import FilterBar from '@/components/ui/FilterBar'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { ChartSkeleton, StatCardSkeleton } from '@/components/ui/LoadingSkeleton'
import ChartTooltip, { axisProps, gridProps } from '@/components/charts/ChartTooltip'
import { useAsync } from '@/hooks/useAsync'
import { getFeedback } from '@/services/feedbackService'
import { categoryLabel } from '@/data/categories'
import { formatDate, formatNumber } from '@/utils/format'

export default function Feedback() {
  const [rating, setRating] = useState('all')
  const { data, loading, error, refresh, refreshedAt } = useAsync(() => getFeedback({ rating }), [rating])

  return (
    <>
      <PageHeader
        title="Umpan Balik"
        subtitle="Penilaian mahasiswa terhadap jawaban yang dikirim chatbot di Telegram."
        onRefresh={refresh} refreshedAt={refreshedAt} loading={loading}
      />

      {error ? <ErrorState error={error} onRetry={refresh} /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading || !data ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />) : (
              <>
                <StatCard label="Penilaian positif" value={`${data.summary.positivePercent}%`} icon={ThumbsUp}
                  hint={`${formatNumber(data.summary.positiveCount)} penilaian`} />
                <StatCard label="Penilaian negatif" value={`${data.summary.negativePercent}%`} icon={ThumbsDown}
                  hint={`${formatNumber(data.summary.negativeCount)} penilaian`} accent="blue" />
                <StatCard label="Total penilaian" value={data.summary.totalRatings}
                  hint="dari seluruh percakapan" />
                <StatCard label="Alasan terbanyak" value={data.reasons[0]?.label ?? '—'}
                  hint={`${data.reasons[0]?.count ?? 0} laporan`} accent="blue" />
              </>
            )}
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {loading || !data ? <><ChartSkeleton /><ChartSkeleton /></> : (
              <>
                <ChartCard title="Tren kepuasan" subtitle="Enam minggu terakhir, dalam persen">
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.trend} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="week" {...axisProps} />
                        <YAxis {...axisProps} width={44} domain={[0, 100]} />
                        <Tooltip content={<ChartTooltip unit="%" />} cursor={{ stroke: 'var(--line)' }} />
                        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted)' }} />
                        <Line type="monotone" dataKey="positive" name="Positif" stroke="#6D4AFF" strokeWidth={2.4} dot={false} />
                        <Line type="monotone" dataKey="negative" name="Negatif" stroke="#3B82F6" strokeWidth={1.8} strokeDasharray="4 4" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Alasan penilaian negatif" subtitle="Dasar perbaikan knowledge base"
                  footnote="Alasan “informasi belum tersedia” menandakan dokumen sumber perlu ditambah.">
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.reasons} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                        <CartesianGrid {...gridProps} vertical horizontal={false} />
                        <XAxis type="number" {...axisProps} />
                        <YAxis type="category" dataKey="label" {...axisProps} width={168} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--line)', fillOpacity: 0.35 }} />
                        <Bar dataKey="count" name="Laporan" fill="#4B32A8" radius={[0, 6, 6, 0]} maxBarSize={26} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </>
            )}
          </div>

          <section className="mt-8">
            <h2 className="font-display text-[22px] text-ink">Catatan mahasiswa</h2>
            <p className="mb-4 mt-1.5 text-[14px] text-muted">Komentar yang disertakan saat memberi penilaian.</p>

            <FilterBar
              dense
              filters={[{
                id: 'rating', label: 'Penilaian', value: rating, onChange: setRating,
                options: [
                  { value: 'all', label: 'Semua penilaian' },
                  { value: 'positive', label: 'Positif' },
                  { value: 'negative', label: 'Negatif' },
                ],
              }]}
              onReset={() => setRating('all')}
            />

            <div className="mt-4">
              {loading || !data ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => <ChartSkeleton key={i} height={80} />)}
                </div>
              ) : !data.entries.length ? (
                <EmptyState title="Belum ada catatan" description="Tidak ada umpan balik pada filter ini." />
              ) : (
                <ul className="grid gap-4 md:grid-cols-2">
                  {data.entries.map((entry) => (
                    <li key={entry.id} className="card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[12.5px] text-ink">{entry.user}</p>
                          <p className="mt-0.5 text-[12px] text-muted">
                            {formatDate(entry.date)} · {categoryLabel(entry.categoryId)}
                          </p>
                        </div>
                        <StatusBadge status={entry.rating} />
                      </div>
                      <p className="mt-3 text-[13.5px] leading-relaxed text-ink">{entry.note}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </>
  )
}
