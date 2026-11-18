import { AlertTriangle, RotateCw } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  error,
  onRetry,
  title = "Data tidak dapat dimuat",
}) {
  const detail =
    error?.message || "Terjadi kesalahan saat menghubungi layanan ASCA.";

  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-500/10 text-red-500">
        <AlertTriangle size={22} strokeWidth={1.9} aria-hidden />
      </span>
      <p className="mt-4 font-display text-lg text-ink">{title}</p>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
        {detail}
      </p>
      <p className="mt-1 text-xs text-muted">
        Periksa VITE_API_BASE_URL atau jalankan ulang backend, lalu coba lagi.
      </p>
      {onRetry ? (
        <Button
          variant="secondary"
          size="sm"
          icon={RotateCw}
          className="mt-5"
          onClick={onRetry}
        >
          Coba lagi
        </Button>
      ) : null}
    </div>
  );
}
