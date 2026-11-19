import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, Send } from "lucide-react";
// import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";
import { flatNav } from "./navigation";
import { useAuth } from "@/context/AuthContext";
import { getTelegramUrl } from "@/config/env";

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const current = flatNav.find((item) => item.to === pathname);
  const telegramUrl = getTelegramUrl();
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "AD";

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(error.message || "Gagal logout.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Buka menu"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line text-muted
          transition-colors hover:border-purple-300 hover:text-purple-600 lg:hidden"
      >
        <Menu size={17} strokeWidth={2} aria-hidden />
      </button>

      <p className="min-w-0 flex-1 truncate font-display text-[17px] text-ink">
        {current?.label ?? "ASCA"}
      </p>

      {telegramUrl ? (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="hidden items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-[13px] font-semibold text-ink
            transition-colors hover:border-purple-300 hover:text-purple-600 sm:inline-flex"
        >
          <Send size={14} aria-hidden /> Buka Telegram
        </a>
      ) : null}

      {/* <NotificationDropdown /> */}
      <ThemeToggle />
      {logoutError && (
        <span
          role="alert"
          className="max-w-[170px] text-[11px] text-red-600 dark:text-red-300"
        >
          {logoutError}
        </span>
      )}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        title="Logout admin"
        aria-label="Logout admin"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
      >
        <LogOut size={17} aria-hidden />
      </button>

      <Link
        to="/profile"
        aria-label="Profil"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500
          font-mono text-[12px] font-medium text-white ring-2 ring-transparent transition-all hover:ring-purple-300"
      >
        {initials}
      </Link>
    </header>
  );
}
