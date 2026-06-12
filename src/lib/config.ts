function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const REPORTS_URL =
  import.meta.env.VITE_REPORTS_URL ?? "/reportar-estafa";

/** Solo en desarrollo usa localhost si falta .env; en producción requiere VITE_API_URL. */
export const API_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "http://localhost:5219" : "")
);
