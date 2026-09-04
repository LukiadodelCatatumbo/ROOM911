import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";
import { authService } from "../../services/authService";

const runtimeEnv =
  (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env ?? {};

function getPositiveMinutes(value: string | undefined, fallback: number): number {
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes > 0 ? minutes : fallback;
}

const sessionTimeoutMs =
  getPositiveMinutes(runtimeEnv.VITE_SESSION_TIMEOUT_MINUTES, 10) * 60 * 1000;
const sessionWarningMs = Math.min(
  getPositiveMinutes(runtimeEnv.VITE_SESSION_WARNING_MINUTES, 1) * 60 * 1000,
  sessionTimeoutMs / 2
);
const activityEvents = ["mousedown", "mousemove", "keydown", "touchstart", "scroll"] as const;

/** Cierra la sesión administrativa después de un periodo configurable sin actividad. */
export function SessionTimeout() {
  const lastActivityRef = useRef(Date.now());
  const warningTimerRef = useRef<number | null>(null);
  const expirationTimerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const [segundosRestantes, setSegundosRestantes] = useState<number | null>(null);

  useEffect(() => {
    const clearTimers = () => {
      if (warningTimerRef.current !== null) {
        window.clearTimeout(warningTimerRef.current);
      }
      if (expirationTimerRef.current !== null) {
        window.clearTimeout(expirationTimerRef.current);
      }
      if (countdownRef.current !== null) {
        window.clearInterval(countdownRef.current);
      }
    };

    const detenerCuentaAtras = () => {
      if (countdownRef.current !== null) {
        window.clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setSegundosRestantes(null);
    };

    const expireSession = () => {
      if (!authService.isAuthenticated()) return;

      try {
        window.sessionStorage.setItem("sesionExpiradaInactividad", "1");
      } catch {
        // sessionStorage no disponible: el aviso en el login simplemente no aparece
      }
      authService.logout();
      window.location.replace("/login");
    };

    const showWarning = () => {
      if (!authService.isAuthenticated()) return;

      setSegundosRestantes(Math.round(sessionWarningMs / 1000));
      countdownRef.current = window.setInterval(() => {
        setSegundosRestantes((previo) => {
          if (previo === null) return null;
          if (previo <= 1) {
            if (countdownRef.current !== null) {
              window.clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            return 0;
          }
          return previo - 1;
        });
      }, 1000);
    };

    const scheduleTimers = () => {
      clearTimers();
      const inactiveTime = Date.now() - lastActivityRef.current;
      const remainingTime = sessionTimeoutMs - inactiveTime;

      if (remainingTime <= 0) {
        expireSession();
        return;
      }

      warningTimerRef.current = window.setTimeout(
        showWarning,
        Math.max(remainingTime - sessionWarningMs, 0)
      );
      expirationTimerRef.current = window.setTimeout(expireSession, remainingTime);
    };

    const handleActivity = () => {
      if (Date.now() - lastActivityRef.current < 1000) return;

      lastActivityRef.current = Date.now();
      detenerCuentaAtras();
      scheduleTimers();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token" && event.newValue === null) {
        window.location.replace("/login");
      }
    };

    lastActivityRef.current = Date.now();
    scheduleTimers();
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearTimers();
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (segundosRestantes === null) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-lg border border-amber-400/60 bg-amber-50 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100 shadow-lg max-w-[calc(100vw-2rem)]"
    >
      <Timer size={20} className="shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <div className="text-sm">
        <p className="font-bold">
          Inactividad detectada — tu sesión se cerrará en {segundosRestantes}s
        </p>
        <p className="text-xs opacity-80">
          Mueve el mouse o presiona una tecla para seguir trabajando.
        </p>
      </div>
    </div>
  );
}
