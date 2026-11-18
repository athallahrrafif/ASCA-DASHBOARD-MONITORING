import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { LogoMark } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5">
      <div className="max-w-md text-center">
        <LogoMark size={48} className="mx-auto" />
        <p className="mt-6 font-mono text-[13px] text-muted">404</p>
        <h1 className="mt-2 font-display text-display-md text-ink">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Tautan yang Anda buka tidak ada di ASCA. Coba kembali ke beranda atau
          buka dashboard.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/" variant="primary">
            Kembali ke beranda
          </Button>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink
              transition-colors hover:border-purple-300 hover:text-purple-600"
          >
            Buka dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
