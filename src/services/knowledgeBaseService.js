import { resolve, mock } from './apiClient'
import { knowledgeBaseEntries, knowledgeBaseSummary, pipelineStages } from '@/data/knowledgeBase'

/** GET /knowledge-base */
export function getKnowledgeBase(params = {}) {
  const { search = '', status = 'all' } = params

  return resolve({
    path: '/knowledge-base',
    params,
    mockFn: () => {
      const filtered = knowledgeBaseEntries.filter((entry) => {
        if (search && !entry.name.toLowerCase().includes(search.toLowerCase())) return false
        if (status !== 'all' && entry.status !== status) return false
        return true
      })
      return mock({ entries: filtered, summary: knowledgeBaseSummary, pipeline: pipelineStages })
    },
  })
}
