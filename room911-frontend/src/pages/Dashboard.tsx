import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ScanLine,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dashboardService } from "../services/dashboardService";
import { accesoService } from "../services/accesoService";
import { DashboardStats, AccessEvent, AccessEntry } from "../types";
import { toast } from "sonner";
import { AccesoBadge } from "../components/common/Badge";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alertas, setAlertas] = useState<AccessEntry[]>([]);
  // false cuando la carga del historial falla: evita el falso "todo en orden".
  const [historialDisponible, setHistorialDisponible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    else setLoading(true);
    try {
      // Solo los denegados recientes, filtrados en el servidor (antes descargaba todo el historial)
      const desde24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const [data, historialRes] = await Promise.all([
        dashboardService.obtenerResumen(),
        accesoService
          .listarHistorial({ exito: false, desde: desde24h, tamano: 50 })
          .then((p) => p.contenido)
          .catch(() => null),
      ]);
      setStats(data);
      setErrorCarga(false);
      const historial = Array.isArray(historialRes) ? historialRes : [];
      setHistorialDisponible(Array.isArray(historialRes));
      const aMilisegundos = (ts: string) =>
        new Date(ts.includes("T") ? ts : ts.replace(" ", "T")).getTime();
      setAlertas(
        [...historial]
          .filter((ev) => Boolean(ev.timestamp))
          .sort(
            (a, b) =>
              aMilisegundos(b.timestamp ?? "") - aMilisegundos(a.timestamp ?? "")
          )
      );
      if (showToast) {
        toast.success("Panel de control actualizado", {
          description: "Métricas e indicadores sincronizados.",
        });
      }
    } catch {
      setErrorCarga(true);
      toast.error("No se pudieron cargar los datos del panel", {
        description: "Verifica la conexión con el servidor e inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (errorCarga && !stats) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <ShieldAlert size={28} className="text-rose-500" />
        <p className="text-sm text-foreground font-semibold">
          No se pudieron cargar los datos del panel operativo
        </p>
        <button
          onClick={() => loadData()}
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <RefreshCw size={16} className="animate-spin text-primary" />
          <span>Cargando datos del panel operativo...</span>
        </div>
      </div>
    );
  }

  const activePercent = stats.kpis.totalEmpleados > 0 
    ? Math.round((stats.kpis.empleadosActivos / stats.kpis.totalEmpleados) * 100) 
    : 100;
  const totalAccesos = stats.kpis.accesosHoy + stats.kpis.intentosFallidosHoy;
  const successRate = totalAccesos > 0
    ? ((stats.kpis.accesosHoy / totalAccesos) * 100).toFixed(1)
    : null;
  const tasaBloqueo = totalAccesos > 0
    ? Math.round((stats.kpis.intentosFallidosHoy / totalAccesos) * 100)
    : 0;
  // % del personal activo que está ahora mismo en planta (antes hardcodeado en 63.8%)
  const capacidadOperativa = stats.kpis.empleadosActivos > 0
    ? Math.min(
        100,
        Math.round((stats.kpis.aforoActual / stats.kpis.empleadosActivos) * 1000) / 10
      )
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-5 rounded-lg border border-border shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-foreground">Panel Operativo de Planta</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitoreo en tiempo real de aforo, credenciales activas y control de acceso.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/simulador"
            className="flex items-center gap-2 px-3.5 py-2 bg-primary text-white rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
          >
            <ScanLine size={15} />
            <span>Abrir Simulador</span>
          </Link>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            title="Actualizar datos"
            aria-label="Actualizar datos del panel"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-primary" : ""} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Personal Registrado */}
        <div className="bg-white dark:bg-card p-5 rounded-xl border border-border hover:border-primary/40 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Personal Registrado
              </p>
              <h3 className="text-3xl font-extrabold font-mono text-foreground tracking-tight mt-1">
                {stats.kpis.totalEmpleados}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
              <span className="text-muted-foreground">Estado de nómina</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ArrowUpRight size={12} />
                {stats.kpis.empleadosActivos} activos ({activePercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, activePercent)}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground border-t border-border/60 pt-2">
            Personal acreditado en instalaciones
          </p>
        </div>

        {/* Card 2: Accesos Concedidos Hoy */}
        <div className="bg-white dark:bg-card p-5 rounded-xl border border-border hover:border-primary/40 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Accesos Concedidos Hoy
              </p>
              <h3 className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">
                {stats.kpis.accesosHoy}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
              <span className="text-muted-foreground">Efectividad torniquetes</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {successRate !== null ? `${successRate}% éxito` : "Sin datos hoy"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${successRate !== null ? Math.min(100, Number(successRate)) : 0}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground border-t border-border/60 pt-2">
            Ingresos validados en esclusas
          </p>
        </div>

        {/* Card 3: Intentos Denegados */}
        <div className="bg-white dark:bg-card p-5 rounded-xl border border-border hover:border-destructive/40 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Intentos Denegados
              </p>
              <h3 className="text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400 tracking-tight mt-1">
                {stats.kpis.intentosFallidosHoy}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
              <span className="text-muted-foreground">Tasa de bloqueo hoy</span>
              <span
                className={`font-semibold ${
                  tasaBloqueo === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {totalAccesos > 0
                  ? `${tasaBloqueo}% de ${totalAccesos} intentos`
                  : "Sin intentos registrados"}
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  tasaBloqueo === 0 ? "bg-emerald-500" : "bg-rose-500"
                }`}
                style={{ width: `${totalAccesos > 0 ? Math.max(4, tasaBloqueo) : 0}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground border-t border-border/60 pt-2">
            Bloqueados por falta de autorización
          </p>
        </div>

        {/* Card 4: Aforo en Planta */}
        <div className="bg-white dark:bg-card p-5 rounded-xl border border-border hover:border-purple-500/40 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Aforo en Planta
              </p>
              <h3 className="text-3xl font-extrabold font-mono text-foreground tracking-tight mt-1">
                {stats.kpis.aforoActual}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center shrink-0">
              <Activity size={18} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
              <span className="text-muted-foreground">Capacidad operativa</span>
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                {capacidadOperativa}% capacidad
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${capacidadOperativa}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground border-t border-border/60 pt-2">
            Presencia simultánea en áreas de trabajo
          </p>
        </div>
      </div>

      {/* Alertas de Seguridad (últimas 24 horas) */}
      <div className="bg-white dark:bg-card rounded-lg border border-border shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldAlert
                size={16}
                className={
                  alertas.length > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }
              />
              Alertas de Seguridad · Últimas 24 horas
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Intentos de ingreso denegados detectados por las terminales de la planta.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono shrink-0 ${
              alertas.length > 0
                ? "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60"
                : historialDisponible
                ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
                : "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60"
            }`}
          >
            {alertas.length > 0
              ? `${alertas.length} ${alertas.length === 1 ? "alerta" : "alertas"}`
              : historialDisponible
              ? "0 alertas"
              : "Sin datos"}
          </span>
        </div>

        {alertas.length === 0 ? (
          historialDisponible ? (
            <div className="p-6 flex items-center gap-3 text-sm text-muted-foreground">
              <CheckCircle2 size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Todo en orden: no se registraron accesos denegados en las últimas 24 horas.
              </span>
            </div>
          ) : (
            <div className="p-6 flex items-center gap-3 text-sm text-muted-foreground">
              <ShieldAlert size={17} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                No se pudo cargar el historial de accesos, por lo que las alertas de las
                últimas 24 horas <strong className="text-foreground">no pueden confirmarse</strong>.
                Reintenta la actualización del panel.
              </span>
            </div>
          )
        ) : (
          <ul className="divide-y divide-border max-h-72 overflow-y-auto">
            {alertas.slice(0, 20).map((alerta, idx) => (
              <li
                key={alerta.dbId ?? `alerta-${idx}`}
                className="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs hover:bg-rose-500/5 transition-colors"
              >
                <span className="font-mono text-muted-foreground sm:w-36 shrink-0">
                  {alerta.fecha} {alerta.hora}
                </span>
                <span className="font-semibold text-foreground sm:min-w-[180px] truncate">
                  {alerta.empleadoNombre || alerta.empleadoId || "Empleado no identificado"}
                </span>
                <span className="text-muted-foreground flex-1 min-w-0 truncate">
                  {alerta.motivo}
                </span>
                <span className="text-[11px] font-bold font-mono text-rose-600 dark:text-rose-400 shrink-0">
                  DENEGADO
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Flow Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-card p-5 rounded-lg border border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Flujo Semanal de Accesos</h2>
              <p className="text-xs text-muted-foreground">Comparativa de ingresos concedidos vs. denegados</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-primary" />
                <span className="text-muted-foreground">Concedidos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-destructive" />
                <span className="text-muted-foreground">Denegados</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.accesosPorDia} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConcedidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B5FA5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0B5FA5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDenegados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C62828" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C62828" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="dia" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1B2E",
                    borderRadius: "6px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="concedidos"
                  stroke="#0B5FA5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorConcedidos)"
                  name="Concedidos"
                />
                <Area
                  type="monotone"
                  dataKey="denegados"
                  stroke="#C62828"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDenegados)"
                  name="Denegados"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Distribution Donut Chart (1 col) */}
        <div className="bg-white dark:bg-card p-5 rounded-lg border border-border shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Distribución por Área</h2>
            <p className="text-xs text-muted-foreground">Personal activo por departamento</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departamentosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.departamentosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1B2E",
                    borderRadius: "6px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Legend */}
          <div className="space-y-1.5 text-xs pt-2 border-t border-border">
            {stats.departamentosData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-muted-foreground truncate max-w-[140px]">{dept.name}</span>
                </div>
                <span className="font-mono text-foreground font-semibold">
                  {dept.value} ({dept.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feed Table */}
      <div className="bg-white dark:bg-card rounded-lg border border-border shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Registro de Accesos en Vivo</h2>
            <p className="text-xs text-muted-foreground">Últimos eventos transmitidos por las terminales</p>
          </div>
          <Link
            to="/historial"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Ver historial completo</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 text-muted-foreground font-mono text-[11px] uppercase border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">Hora</th>
                <th className="px-6 py-3 font-semibold">Personal Identificado</th>
                <th className="px-6 py-3 font-semibold">Puerta / Esclusa</th>
                <th className="px-6 py-3 font-semibold">Resultado</th>
                <th className="px-6 py-3 font-semibold">Detalle Técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.ultimosAccesos.map((ev: AccessEvent) => (
                <tr key={ev.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 font-mono text-muted-foreground">{ev.hora}</td>
                  <td className="px-6 py-3">
                    <span className="font-semibold text-foreground">{ev.empleadoNombre}</span>
                    <span className="block text-[11px] font-mono text-muted-foreground">{ev.empleadoId}</span>
                  </td>
                  <td className="px-6 py-3 font-medium text-foreground">{ev.puerta}</td>
                  <td className="px-6 py-3">
                    <AccesoBadge resultado={ev.resultado} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{ev.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
