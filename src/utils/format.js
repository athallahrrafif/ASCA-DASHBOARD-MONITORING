export const formatNumber = (value) =>
  new Intl.NumberFormat('id-ID').format(Number(value ?? 0))

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

export function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diff / 60000)
  if (minutes < 1) return 'baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.round(hours / 24)
  return `${days} hari lalu`
}

export const percent = (part, total) => (total ? Math.round((part / total) * 1000) / 10 : 0)
