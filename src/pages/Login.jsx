import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, LogIn, UserRound } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await login(username.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.status === 401
          ? "Username atau password salah."
          : err.status === 429
            ? "Terlalu banyak percobaan login. Coba lagi nanti."
            : err.message || "Login gagal. Periksa koneksi ke server.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-canvas px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[650px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[100px]"
      />
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <main className="card relative w-full max-w-[430px] p-7 sm:p-9">
        <div className="flex items-center justify-center gap-3">
          <LogoMark size={42} />
          <div>
            <p className="font-display text-[22px] leading-tight text-ink">
              ASCA
            </p>
            <p className="text-[11px] text-muted">Academic Assistant</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <h1 className="font-display text-[29px] text-ink">
            Login Administrator
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Masuk untuk memantau layanan informasi akademik melalui Telegram.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="admin-username"
              className="mb-1.5 block text-[13px] font-semibold text-ink"
            >
              Username
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 focus-within:border-purple-500">
              <UserRound
                size={17}
                className="shrink-0 text-muted"
                aria-hidden
              />
              <input
                id="admin-username"
                autoComplete="username"
                autoFocus
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent py-3 text-sm text-ink outline-none"
                placeholder="Masukkan username"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-[13px] font-semibold text-ink"
            >
              Password
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 focus-within:border-purple-500">
              <LockKeyhole
                size={17}
                className="shrink-0 text-muted"
                aria-hidden
              />
              <input
                id="admin-password"
                required
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-w-0 w-full bg-transparent py-3 text-sm text-ink outline-none"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
                className="p-1 text-muted hover:text-ink"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2.5 text-[13px] text-red-600 dark:text-red-300"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            <LogIn size={17} aria-hidden />{" "}
            {submitting ? "Memeriksa akun…" : "Masuk ke Dashboard"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-[12.5px] text-muted">
            Akses khusus administrator ASCA
          </p>
        </div>
      </main>
    </div>
  );
}
