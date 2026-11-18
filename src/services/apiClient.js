import { env } from "@/config/env";

/** Error dengan bentuk seragam agar UI dapat menampilkan error state yang konsisten. */
export class ApiError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.cause = cause;
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Membungkus dummy data agar bentuk respons mock identik dengan REST API.
 * Kontrak respons: { data, meta }
 */
export async function mock(data, meta = {}) {
  await delay(env.mockLatency);
  return { data, meta: { source: "mock", ...meta } };
}

/** Pemanggilan REST API nyata. Dipakai saat VITE_USE_MOCK_DATA=false. */
export async function request(path, { params, signal, ...init } = {}) {
  const url = new URL(`${env.apiBaseUrl.replace(/\/$/, "")}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        value !== "all"
      ) {
        url.searchParams.set(key, value);
      }
    });
  }

  let response;
  try {
    response = await fetch(url, {
      ...init,
      signal,
      credentials: "same-origin", // Vite proxy: cookie HttpOnly di origin localhost:5173
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Tidak dapat terhubung ke server ASCA.", {
      cause: error,
    });
  }

  if (!response.ok) {
    // Jika sesi habis di tengah monitoring, halaman terproteksi kembali ke Login.
    if (response.status === 401 && !path.startsWith("/auth/")) {
      window.dispatchEvent(new Event("asca:unauthorized"));
    }
    let detail = "";
    try {
      detail = (await response.json())?.detail || "";
    } catch {
      /* respons kosong */
    }
    throw new ApiError(detail || `Permintaan gagal (${response.status}).`, {
      status: response.status,
    });
  }

  const body = await response.json();
  // Backend diharapkan mengembalikan { data, meta }. Bila hanya array/objek, dibungkus.
  if (body && typeof body === "object" && "data" in body) {
    return { data: body.data, meta: { source: "api", ...(body.meta || {}) } };
  }
  return { data: body, meta: { source: "api" } };
}

/**
 * Pemilih jalur: mock atau API.
 * Seluruh service memakai helper ini sehingga pergantian ke backend
 * tidak menyentuh satu pun komponen UI.
 */
export async function resolve({ path, params, mockFn }) {
  // Monitoring sudah live, halaman katalog lain tetap bisa menggunakan data contoh.
  if (
    env.useLiveMonitoring &&
    ["/analytics", "/interactions", "/bot/status"].some(
      (prefix) => path === prefix || path.startsWith(prefix + "/"),
    )
  ) {
    return request(path, { params });
  }
  if (env.useMockData) return mockFn();
  return request(path, { params });
}
