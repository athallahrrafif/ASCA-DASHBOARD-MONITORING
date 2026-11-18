import { resolve, mock } from './apiClient'
import { academicGroups } from '@/data/academicInfo'
import { env } from '@/config/env'

/**
 * VITE_RESEARCH_FOCUS membatasi katalog pada satu arah penelitian
 * (administration | krs | rag). Nilai 'all' menampilkan seluruh kelompok.
 */
const byFocus = (groups) =>
  env.researchFocus && env.researchFocus !== 'all'
    ? groups.filter((group) => group.topic === env.researchFocus)
    : groups

/** GET /academic-info */
export function getAcademicInfo(params = {}) {
  const { search = '' } = params

  return resolve({
    path: '/academic-info',
    params,
    mockFn: () => {
      const scoped = byFocus(academicGroups)
      if (!search) return mock(scoped)
      const term = search.toLowerCase()
      const filtered = scoped
        .map((group) => ({ ...group, items: group.items.filter((i) => `${i.title} ${i.summary}`.toLowerCase().includes(term)) }))
        .filter((group) => group.items.length > 0)
      return mock(filtered)
    },
  })
}
