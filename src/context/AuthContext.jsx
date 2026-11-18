import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { request } from "@/services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    async function restoreSession() {
      try {
        const result = await request("/auth/me");
        if (alive) setUser(result.data);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setChecking(false);
      }
    }
    restoreSession();
    const expire = () => setUser(null);
    window.addEventListener("asca:unauthorized", expire);
    return () => {
      alive = false;
      window.removeEventListener("asca:unauthorized", expire);
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setUser(result.data);
    return result.data;
  }, []);

  const logout = useCallback(async () => {
    // Gagal jaringan? Tampilkan kesalahan, bukan berpura-pura sesi server terhapus.
    await request("/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, checking, login, logout }),
    [user, checking, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth harus digunakan di dalam AuthProvider.");
  return context;
}
