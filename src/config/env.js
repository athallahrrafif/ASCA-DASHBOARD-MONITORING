/**
 * Satu-satunya tempat membaca import.meta.env.
 * Komponen tidak boleh membaca env langsung agar mudah diuji dan diganti.
 */
const raw = import.meta.env ?? {};

const toBool = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
};

export const env = {
  // Relatif ("/api") = satu origin dengan halaman, wajib agar cookie sesi terkirim.
  apiBaseUrl: raw.VITE_API_BASE_URL || "/api",
  useMockData: toBool(raw.VITE_USE_MOCK_DATA, true),
  useLiveMonitoring: toBool(raw.VITE_USE_LIVE_MONITORING, false),
  telegramBotUrl: raw.VITE_TELEGRAM_BOT_URL || "",
  telegramBotUsername: raw.VITE_TELEGRAM_BOT_USERNAME || "@FASCA_Bot",
  mockLatency: Number(raw.VITE_MOCK_LATENCY ?? 450),
  researchFocus: raw.VITE_RESEARCH_FOCUS || "all",
};

/** Dipakai untuk menampilkan badge DEMO DATA di seluruh aplikasi. */
export const isDemoMode = (pathname = "") =>
  env.useMockData &&
  !(
    env.useLiveMonitoring &&
    ["/dashboard", "/analytics", "/interactions", "/bot-monitoring"].includes(
      pathname,
    )
  );

/**
 * Telegram URL sengaja tidak di-hardcode. Bila env kosong, tombol dinonaktifkan
 * dan UI menjelaskan alasannya, bukan menautkan ke URL karangan.
 */
export const getTelegramUrl = () => env.telegramBotUrl || null;
