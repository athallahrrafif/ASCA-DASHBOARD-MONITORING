import { resolve, mock } from './apiClient'
import { feedbackSummary, feedbackReasons, feedbackTrend, feedbackEntries } from '@/data/feedback'

/** GET /feedback */
export function getFeedback(params = {}) {
  const { rating = 'all' } = params

  return resolve({
    path: '/feedback',
    params,
    mockFn: () => {
      const entries = rating === 'all' ? feedbackEntries : feedbackEntries.filter((e) => e.rating === rating)
      return mock({ summary: feedbackSummary, reasons: feedbackReasons, trend: feedbackTrend, entries })
    },
  })
}
