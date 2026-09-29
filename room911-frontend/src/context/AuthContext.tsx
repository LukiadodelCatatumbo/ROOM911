import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type { AdminUser } from "../types";

/**
 * Fuente única y reactiva de la sesión: se lee de localStorage una vez y se
 * actualiza en login/logout y al escuchar el evento `storage` (otras pestañas).
 * Los componentes ya no re-leen ni re-parsean localStorage en cada render.
 */
interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  /** SUPER_ADMIN y ADMIN_ACCESOS (coincide con los @PreAuthorize del backend). */
  puedeGestionarPersonal: boolean;
  /** SUPER_ADMIN y ADMIN_SISTEMAS. */
  puedeGestionarAdministradores: boolean;
  esSuperAdmin: boolean;
  login: typeof authService.login;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() =>
    authService.getCurrentUser()
  );

  const refresh = useCallback(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const login = useCallback(
    async (usuario: string, contrasena: string) => {
      const data = await authService.login(usuario, contrasena);
      setUser(authService.getCurrentUser());
      return data;
    },
    []
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Otro logout/login en otra pestaña se refleja aquí.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null && authService.isAuthenticated(),
      puedeGestionarPersonal:
        user?.rol === "SUPER_ADMIN" || user?.rol === "ADMIN_ACCESOS",
      puedeGestionarAdministradores:
        user?.rol === "SUPER_ADMIN" || user?.rol === "ADMIN_SISTEMAS",
      esSuperAdmin: user?.rol === "SUPER_ADMIN",
      login,
      logout,
      refresh,
    }),
    [user, login, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}
