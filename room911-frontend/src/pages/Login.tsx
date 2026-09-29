import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, AlertCircle, ShieldCheck, CheckCircle2, ScanLine, Timer } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const runtimeEnv =
  (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env ?? {};
const demoUsername = runtimeEnv.VITE_DEMO_USERNAME;
const demoPassword = runtimeEnv.VITE_DEMO_PASSWORD;
const hasDemoCredentials = Boolean(demoUsername && demoPassword);

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avisoInactividad, setAvisoInactividad] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("sesionExpiradaInactividad") === "1") {
        setAvisoInactividad(true);
        window.sessionStorage.removeItem("sesionExpiradaInactividad");
      }
    } catch {
      // sessionStorage no disponible: se omite el aviso
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !password) {
      setError("Complete todos los campos requeridos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(usuario, password);
      toast.success("Autenticación exitosa", {
        description: "Bienvenido al panel de control de ROOM_911",
      });
      navigate("/dashboard");
    } catch (err: any) {
      const detalle = err?.response?.data?.mensaje;
      setError(
        typeof detalle === "string" && detalle
          ? detalle
          : "Credenciales incorrectas o servidor no disponible."
      );
      toast.error("Error al iniciar sesión", {
        description: "Verifique sus credenciales de acceso.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8FA] dark:bg-background text-foreground font-sans">
      <div
        className="hidden lg:flex w-[440px] shrink-0 flex-col justify-between p-12 select-none border-r border-[#1E3050]"
        style={{ background: "#0D1B2E" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm shadow-md">
              <Lock size={19} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <span className="text-white font-bold text-lg font-mono tracking-wider">ROOM_911</span>
              <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Control de Acceso Farmacéutico</p>
            </div>
          </div>

          <h1 className="text-2xl lg:text-[28px] font-semibold text-white leading-tight mb-4 font-sans">
            Sistema de Control<br />de Acceso Farmacéutico
          </h1>

          <p className="text-[#94A3B8] text-sm leading-relaxed font-sans">
            Gestión centralizada de credenciales biométricas, registro de personal, trazabilidad y auditoría de accesos en instalaciones reguladas bajo normativas internacionales.
          </p>

          <div className="mt-10 pt-8 border-t border-[#1E3050] grid grid-cols-2 gap-4">
            {[
              ["ISO 27001", "Certificado"],
              ["GMP Pharma", "Validado"],
              ["WCAG 2.1", "AA Conforme"],
              ["SOC 2 Type II", "Auditado"],
            ].map(([k, v]) => (
              <div key={k} className="bg-[#13233A] p-3 rounded-md border border-[#1E3050]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>{k}</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5 font-mono">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E3050]/60">
          <p className="text-[#475569] text-xs font-mono">
            ROOM_911 Suite v4.2.1 · Pharma Regulatory Edition
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[520px]">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
              <Lock size={15} className="text-white" />
            </div>
            <span className="font-bold text-base font-mono tracking-wider text-foreground">ROOM_911</span>
          </div>

          <div className="bg-white dark:bg-card border border-border rounded-xl shadow-md overflow-hidden">
            <div className="px-10 pt-10 pb-5 border-b border-border/50">
              <h2 className="text-2xl font-bold text-foreground font-sans">Iniciar sesión</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Acceso restringido — únicamente personal administrativo autorizado.
              </p>
            </div>

            {avisoInactividad && (
              <div
                role="alert"
                className="mx-10 mt-6 flex items-start gap-2.5 p-4 bg-[#FEF6E7] dark:bg-amber-950/30 border border-[#F5DFA8] dark:border-amber-900 rounded-md text-sm text-[#92600A] dark:text-amber-300"
              >
                <Timer size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Tu sesión se cerró automáticamente por inactividad. Vuelve a
                  iniciar sesión para continuar.
                </span>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mx-10 mt-6 flex items-start gap-2.5 p-4 bg-[#FDEAEA] dark:bg-rose-950/30 border border-[#F5B8B8] dark:border-rose-900 rounded-md text-sm text-[#C62828] dark:text-rose-300"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="px-10 pb-10 pt-8 space-y-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-usuario" className="text-sm font-semibold text-foreground">
                  ID de usuario o correo corporativo
                </label>
                <input
                  id="login-usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="ej. admin o j.reyes@pharma911.com"
                  required
                  className="h-12 px-4 text-base border border-border rounded-md bg-white dark:bg-secondary/40 focus:outline-2 focus:outline-offset-0 focus:outline-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className="text-sm font-semibold text-foreground">
                  Contraseña de acceso
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 px-4 text-base border border-border rounded-md bg-white dark:bg-secondary/40 focus:outline-2 focus:outline-offset-0 focus:outline-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-13 bg-primary text-white text-base font-semibold rounded-md hover:bg-[#0A4F8A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 cursor-pointer shadow-xs mt-3"
              >
                {loading ? "Verificando credenciales..." : "Ingresar al Sistema"}
              </button>
            </form>
          </div>

          {hasDemoCredentials && (
            <div className="mt-5 p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 size={17} aria-hidden="true" />
                <span>Credenciales de demostración</span>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 mt-4 text-sm">
                <span className="text-muted-foreground">Usuario</span>
                <code className="font-semibold text-foreground">{demoUsername}</code>
                <span className="text-muted-foreground">Contraseña</span>
                <code className="font-semibold text-foreground">{demoPassword}</code>
              </div>
            </div>
          )}

          <Link
            to="/simulador"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-card border border-border rounded-md text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs cursor-pointer"
          >
            <ScanLine size={15} className="text-primary" />
            <span>Acceder al Simulador de Puertas</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
