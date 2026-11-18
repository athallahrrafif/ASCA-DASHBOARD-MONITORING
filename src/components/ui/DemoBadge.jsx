import { FlaskConical } from "lucide-react";
import { isDemoMode } from "@/config/env";
import { useLocation } from "react-router-dom";

/**
 * Ditampilkan di mana pun angka berasal dari dummy data, agar tidak ada
 * yang salah membaca prototipe ini sebagai hasil pengukuran nyata.
 */
export default function DemoBadge({ className = "", compact = false }) {
  const { pathname } = useLocation();
  if (!isDemoMode(pathname)) return null;

  return (
    <span
      title="Seluruh angka pada halaman ini adalah data contoh, bukan data nyata Universitas Mercu Buana."
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/12
        px-2.5 py-1 text-[11.5px] font-semibold tracking-wide text-amber-700 dark:text-amber-300 ${className}`}
    >
      <FlaskConical size={12} strokeWidth={2.4} aria-hidden />
      {compact ? "Demo" : "Data contoh"}
    </span>
  );
}
