import { resolve, mock } from "./apiClient";
import {
  overviewStats,
  quickOverview,
  questionsPerDay,
  questionsByCategory,
  usersBySemester,
  topTopics,
  popularQuestions,
  hourlyUsage,
  botStatus,
} from "@/data/analytics";

/** GET /analytics/overview */
export function getOverview() {
  return resolve({
    path: "/analytics/overview",
    mockFn: () => mock({ stats: overviewStats, quick: quickOverview }),
  });
}

/** GET /analytics */
export function getAnalytics(params = {}) {
  return resolve({
    path: "/analytics",
    params,
    mockFn: () =>
      mock({
        questionsPerDay:
          params.range === "7d" ? questionsPerDay.slice(-7) : questionsPerDay,
        questionsByCategory,
        usersBySemester,
        topTopics,
        hourlyUsage,
      }),
  });
}

/** GET /analytics/popular-questions */
export function getPopularQuestions(limit = 7) {
  return resolve({
    path: "/analytics/popular-questions",
    params: { limit },
    mockFn: () => mock(popularQuestions.slice(0, limit)),
  });
}

/** GET /analytics/monthly-categories: grafik kategori tiap bulan */
export function getMonthlyCategories(months = 6) {
  return resolve({
    path: "/analytics/monthly-categories",
    params: { months },
    mockFn: () => mock({ rows: [], series: [] }),
  });
}

/** GET /bot/status */
export function getBotStatus() {
  return resolve({ path: "/bot/status", mockFn: () => mock(botStatus) });
}
