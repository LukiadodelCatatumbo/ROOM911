import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { authService } from "../services/authService";
import { toast } from "sonner";

export default function Login() {
  const [usuario, setUsuario] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !password) {
      setError("Complete todos los campos requeridos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.login(usuario, password);
      toast.success("Autenticación exitosa", {
        description: "Bienvenido al panel de control de ROOM_911",
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError("Credenciales incorrectas o servidor no disponible. Use demo: admin / admin123");
      toast.error("Error al iniciar sesión", {
        description: "Verifique sus credenciales de acceso.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F7F8FA] dark:bg-background text-foreground font-sans">
      {/* Left Brand & Regulatory Panel */}
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
              <p className="text-[10px] text-[#64748B] uppercase tracking-widest font-semibold">Pharma Access Control</p>
            </div>
          </div>

          <h1 className="text-2xl lg:text-[28px] font-semibold text-white leading-tight mb-4 font-sans">
            Sistema de Control<br />de Acceso Farmacéutico
          </h1>

          <p className="text-[#94A3B8] text-sm leading-relaxed font-sans">
            Gestión centralizada de credenciales biométricas, registro de personal, trazabilidad y auditoría de accesos en instalaciones reguladas bajo normativas internacionales BPF.
          </p>

          {/* Compliance grid */}
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

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[390px]">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
              <Lock size={15} className="text-white" />
            </div>
            <span className="font-bold text-base font-mono tracking-wider text-foreground">ROOM_911</span>
          </div>

          <div className="bg-white dark:bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-8 pt-8 pb-3 border-b border-border/50">
              <h2 className="text-xl font-bold text-foreground font-sans">Iniciar sesión</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Acceso restringido — únicamente personal administrativo autorizado.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mx-8 mt-5 flex items-start gap-2.5 p-3.5 bg-[#FDEAEA] dark:bg-rose-950/30 border border-[#F5B8B8] dark:border-rose-900 rounded-md text-xs text-[#C62828] dark:text-rose-300"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="px-8 pb-8 pt-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-usuario" className="text-xs font-semibold text-foreground">
                  ID de usuario o correo corporativo
                </label>
                <input
                  id="login-usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="ej. admin o j.reyes@pharma911.com"
                  required
                  className="h-10 px-3 text-sm border border-border rounded-md bg-white dark:bg-secondary/40 focus:outline-2 focus:outline-offset-0 focus:outline-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold text-foreground">
                  Contraseña de acceso
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 px-3 text-sm border border-border rounded-md bg-white dark:bg-secondary/40 focus:outline-2 focus:outline-offset-0 focus:outline-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary text-white text-sm font-semibold rounded-md hover:bg-[#0A4F8A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 cursor-pointer shadow-xs mt-2"
              >
                {loading ? "Verificando credenciales..." : "Ingresar al Sistema"}
              </button>
            </form>
          </div>

          <div className="mt-4 p-3 bg-muted/60 border border-border rounded-md text-xs text-muted-foreground text-center">
            <p className="font-medium text-foreground mb-0.5">Credenciales demo preconfiguradas:</p>
            <span className="font-mono bg-white dark:bg-secondary px-1.5 py-0.5 rounded-xs text-foreground border border-border text-[11px]">
              admin
            </span>
            {" "} / {" "}
            <span className="font-mono bg-white dark:bg-secondary px-1.5 py-0.5 rounded-xs text-foreground border border-border text-[11px]">
              admin123
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
