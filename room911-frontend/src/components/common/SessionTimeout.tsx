import { useEffect, useRef } from "react";
import { toast } from "sonner";
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
  getPositiveMinutes(runtimeEnv.VITE_SESSION_TIMEOUT_MINUTES, 15) * 60 * 1000;
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
  const warningToastRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    const clearTimers = () => {
      if (warningTimerRef.current !== null) {
        window.clearTimeout(warningTimerRef.current);
      }
      if (expirationTimerRef.current !== null) {
        window.clearTimeout(expirationTimerRef.current);
      }
    };

    const dismissWarning = () => {
      if (warningToastRef.current !== undefined) {
        toast.dismiss(warningToastRef.current);
        warningToastRef.current = undefined;
      }
    };

    const expireSession = () => {
      if (!authService.isAuthenticated()) return;

      authService.logout();
      window.location.replace("/login");
    };

    const showWarning = () => {
      if (!authService.isAuthenticated()) return;

      warningToastRef.current = toast.warning("Sesión próxima a expirar", {
        description: "La sesión se cerrará en un minuto si no detectamos actividad.",
        duration: sessionWarningMs,
      });
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
      dismissWarning();
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
      dismissWarning();
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
}
