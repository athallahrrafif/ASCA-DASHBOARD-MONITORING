import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Gagal logout. Silakan coba lagi.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Profil Administrator"
        subtitle="Informasi akun pengelola dashboard monitoring ASCA."
      />
      <section className="card overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-700 via-purple-500 to-blue-500" />
        <div className="flex flex-col gap-5 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <span className="-mt-10 grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-surface bg-gradient-to-br from-purple-500 to-blue-500 font-display text-[25px] text-white">
              AR
            </span>
            <div className="pb-1">
              <h2 className="font-display text-[24px] leading-tight text-ink">
                {user?.displayName ?? "Administrator ASCA"}
              </h2>
              <p className="mt-1 text-[13.5px] text-muted">
                Akun pengelola · Dashboard Monitoring
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[12px] font-semibold text-emerald-600 dark:text-emerald-300">
            <ShieldCheck size={14} /> Sesi administrator aktif
          </span>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h3 className="font-display text-[20px] text-ink">Informasi akun</h3>
          <dl className="mt-5 grid gap-4 text-[13.5px]">
            <div className="flex items-start gap-3 border-b border-line pb-4">
              <UserRound size={18} className="mt-0.5 text-purple-500" />
              <div>
                <dt className="text-muted">Username</dt>
                <dd className="mt-1 font-mono font-semibold text-ink">
                  {user?.username ?? "—"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3 border-b border-line pb-4">
              <ShieldCheck size={18} className="mt-0.5 text-purple-500" />
              <div>
                <dt className="text-muted">Peran</dt>
                <dd className="mt-1 font-semibold text-ink">
                  {user?.role ?? "Administrator"}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <KeyRound size={18} className="mt-0.5 text-purple-500" />
              <div>
                <dt className="text-muted">Hak akses</dt>
                <dd className="mt-1 font-semibold text-ink">
                  Pemantauan statistik, analitik, dan interaksi chatbot
                </dd>
              </div>
            </div>
          </dl>
        </section>

        <section className="card p-5">
          <h3 className="font-display text-[20px] text-ink">Keamanan akun</h3>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
            Akun ini digunakan untuk mengakses dashboard administrasi ASCA.
            Gunakan tombol keluar saat selesai memantau layanan.
          </p>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
            Data profil administrator tidak diambil dari database riwayat
            pertanyaan mahasiswa.
          </p>
          {error && (
            <p
              role="alert"
              className="mt-4 text-[13px] text-red-600 dark:text-red-300"
            >
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-60 dark:text-red-300"
          >
            <LogOut size={17} /> {loggingOut ? "Mengakhiri sesi…" : "Logout"}
          </button>
        </section>
      </div>
    </>
  );
}
