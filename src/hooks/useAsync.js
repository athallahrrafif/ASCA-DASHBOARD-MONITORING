import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Menjalankan service dan mengekspos empat state UI: loading, error, empty, success.
 * Siap dikembangkan untuk polling / WebSocket dengan memanggil refresh() dari luar.
 */
export function useAsync(serviceFn, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null)
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const [refreshedAt, setRefreshedAt] = useState(null)
  const mounted = useRef(true)
  const fnRef = useRef(serviceFn)
  fnRef.current = serviceFn

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fnRef.current()
      if (!mounted.current) return
      setData(result?.data ?? null)
      setMeta(result?.meta ?? null)
      setRefreshedAt(new Date())
    } catch (err) {
      if (!mounted.current) return
      setError(err)
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (immediate) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, meta, loading, error, refresh: run, refreshedAt }
}

/**
 * Polling opsional. Belum diaktifkan di halaman mana pun; disiapkan untuk
 * pengembangan real-time (polling → SSE → WebSocket) tanpa mengubah komponen.
 */
export function usePolling(refresh, intervalMs = 0) {
  useEffect(() => {
    if (!intervalMs) return undefined
    const id = setInterval(refresh, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])
}
