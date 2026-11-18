import { resolve, mock } from './apiClient'
import { interactions } from '@/data/interactions'

const inRange = (iso, from, to) => {
  const t = new Date(iso).getTime()
  if (from && t < new Date(`${from}T00:00:00`).getTime()) return false
  if (to && t > new Date(`${to}T23:59:59`).getTime()) return false
  return true
}

/**
 * GET /interactions
 * @param {{search?:string, categoryId?:string, semester?:string|number, from?:string, to?:string, page?:number, pageSize?:number}} params
 * @returns {Promise<{data: object[], meta: {total:number, page:number, pageSize:number, totalPages:number, source:string}}>}
 */
export function getInteractions(params = {}) {
  const { search = '', categoryId = 'all', semester = 'all', from = '', to = '', page = 1, pageSize = 10 } = params

  return resolve({
    path: '/interactions',
    params,
    mockFn: () => {
      const filtered = interactions.filter((row) => {
        if (search && !`${row.question} ${row.user}`.toLowerCase().includes(search.toLowerCase())) return false
        if (categoryId !== 'all' && row.categoryId !== categoryId) return false
        if (semester !== 'all' && String(row.semester) !== String(semester)) return false
        if (!inRange(row.timestamp, from, to)) return false
        return true
      })

      const start = (page - 1) * pageSize
      return mock(filtered.slice(start, start + pageSize), {
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      })
    },
  })
}

/** GET /interactions/recent */
export function getRecentInteractions(limit = 6) {
  return resolve({
    path: '/interactions/recent',
    params: { limit },
    mockFn: () => mock(interactions.slice(0, limit)),
  })
}
