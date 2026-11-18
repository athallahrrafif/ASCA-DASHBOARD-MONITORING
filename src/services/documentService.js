import { resolve, mock } from './apiClient'
import { documents } from '@/data/documents'

/** GET /documents */
export function getDocuments(params = {}) {
  const { search = '', status = 'all', categoryId = 'all' } = params

  return resolve({
    path: '/documents',
    params,
    mockFn: () => {
      const filtered = documents.filter((doc) => {
        if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false
        if (status !== 'all' && doc.status !== status) return false
        if (categoryId !== 'all' && doc.categoryId !== categoryId) return false
        return true
      })
      return mock(filtered, { total: filtered.length })
    },
  })
}
