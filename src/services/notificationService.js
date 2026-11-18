import { resolve, mock } from "./apiClient";
import { notifications } from "@/data/notifications";
import { env } from "@/config/env";

/** GET /notifications */
export function getNotifications() {
  if (env.useLiveMonitoring) return mock([], { source: "unavailable" });
  return resolve({ path: "/notifications", mockFn: () => mock(notifications) });
}
