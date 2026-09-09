import { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { accesoService } from "../services/accesoService";
import { AccessEntry } from "../types";
import { AccesoBadge } from "../components/common/Badge";
import { Pagination } from "../components/common/Pagination";
import { toast } from "sonner";

export default function HistorialAccesos() {
  const [logs, setLogs] = useState<AccessEntry[]>([]);
  const [, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [resultadoFilter, setResultadoFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const todayStr = new Date().toISOString().split("T")[0];

  const [refreshing, setRefreshing] = useState(false);

  const loadLogs = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await accesoService.obtenerHistorialGlobal();
      setLogs(data);
      if (showToast) {
        toast.success("Historial de auditoría actualizado", {
          description: "Registros de eventos BPF sincronizados.",
        });
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.empleadoNombre || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.empleadoId || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.puerta || "").toLowerCase().includes(search.toLowerCase()) ||
      (log.id || "").toLowerCase().includes(search.toLowerCase());

    const matchesResult =
      resultadoFilter === "ALL" || log.resultado === resultadoFilter;

    return matchesSearch && matchesResult;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No hay registros para exportar");
      return;
    }
    const headers = ["ID Evento", "Fecha", "Hora", "ID Empleado", "Nombre Personal", "Departamento", "Puerta / Esclusa", "Resultado", "Motivo / Detalle Tecnico"];
    const rows = filteredLogs.map((log) => [
      `"${log.id}"`,
      `"${log.fecha || ""}"`,
      `"${log.hora || ""}"`,
      `"${log.empleadoId || ""}"`,
      `"${(log.empleadoNombre || "").replace(/"/g, '""')}"`,
      `"${(log.departamento || "Produccion").replace(/"/g, '""')}"`,
      `"${(log.puerta || "").replace(/"/g, '""')}"`,
      `"${log.resultado}"`,
      `"${(log.motivo || "Validacion conforme").replace(/"/g, '""')}"`,
    ]);

    const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `ROOM911_Auditoria_Accesos_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Archivo Excel de Auditoría descargado", {
      description: `${filteredLogs.length} registros exportados con trazabilidad.`,
    });
  };

  const handleExportPDF = () => {
    if (filteredLogs.length === 0) {
      toast.error("No hay registros para exportar");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Permita ventanas emergentes para generar el informe imprimible.");
      return;
    }

    const todayStr = new Date().toLocaleString("es-MX");
    const rowsHtml = filteredLogs
      .map(
        (log) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 11px;">${log.id}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${log.fecha || ""} ${log.hora || ""}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: bold;">${log.empleadoNombre || ""} <span style="font-family: monospace; font-weight: normal; color: #64748b;">(${log.empleadoId || ""})</span></td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px;">${log.puerta}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: bold; color: ${
          log.resultado === "CONCEDIDO" ? "#047857" : log.resultado === "DENEGADO" ? "#b91c1c" : "#b45309"
        };">${log.resultado}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-size: 11px; color: #475569;">${log.motivo || "Validación conforme"}</td>
      </tr>`
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ROOM_911 — Informe Oficial de Auditoría de Accesos</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #0f172a; }
            h1 { font-size: 18px; margin: 0; color: #0b5fa5; }
            p { margin: 4px 0; font-size: 12px; color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
            th { background: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; text-align: left; font-size: 11px; text-transform: uppercase; }
            .header-box { border-bottom: 2px solid #0b5fa5; padding-bottom: 12px; margin-bottom: 16px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header-box">
            <h1>ROOM_911 · Sistema de Control de Acceso Farmacéutico</h1>
            <p><strong>Informe de Auditoría & Trazabilidad</strong></p>
            <p>Fecha de emisión: ${todayStr} | Total registros: ${filteredLogs.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID Evento</th>
                <th>Fecha y Hora</th>
                <th>Personal Identificado</th>
                <th>Puerta / Esclusa</th>
                <th>Resultado</th>
                <th>Motivo / Detalle</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            window.onload = () => { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();

    toast.success("Informe Oficial PDF listo", {
      description: "Documento de trazabilidad listo para impresión.",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-5 rounded-lg border border-border shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-foreground">Registro Global de Auditoría & Intentos</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {logs.length} eventos históricos registrados bajo norma de inmutabilidad y trazabilidad.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-secondary border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Exportar Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <FileText size={14} />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={() => loadLogs(true)}
            disabled={refreshing}
            className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            title="Actualizar registros"
            aria-label="Actualizar registros de auditoría"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-card border border-border rounded-lg shadow-2xs overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="text"
                placeholder="Buscar por ID evento, personal o puerta..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={resultadoFilter}
              onChange={(e) => {
                setResultadoFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Todos los resultados</option>
              <option value="CONCEDIDO">Solo Concedidos</option>
              <option value="DENEGADO">Solo Denegados</option>
              <option value="ERROR_SENSOR">Fallas de Sensor</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Desde:</span>
            <input
              type="date"
              value={dateFrom}
              max={todayStr}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-2 py-1 bg-background border border-border rounded-md text-xs text-foreground"
            />
            <span>Hasta:</span>
            <input
              type="date"
              value={dateTo}
              max={todayStr}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-2 py-1 bg-background border border-border rounded-md text-xs text-foreground"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 font-mono text-[11px] uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">ID Evento</th>
                <th className="px-6 py-3 font-semibold">Fecha y Hora</th>
                <th className="px-6 py-3 font-semibold">Personal Identificado</th>
                <th className="px-6 py-3 font-semibold">Puerta / Esclusa</th>
                <th className="px-6 py-3 font-semibold">Resultado</th>
                <th className="px-6 py-3 font-semibold">Motivo / Detalle Técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 font-mono font-medium text-primary">{log.id}</td>
                  <td className="px-6 py-3 font-mono text-muted-foreground">
                    {log.fecha} {log.hora}
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-semibold text-foreground">{log.empleadoNombre}</span>
                    <span className="block text-[11px] font-mono text-muted-foreground">{log.empleadoId}</span>
                  </td>
                  <td className="px-6 py-3 font-medium text-foreground">{log.puerta}</td>
                  <td className="px-6 py-3">
                    <AccesoBadge resultado={log.resultado} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{log.motivo}</td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No se encontraron registros de auditoría que coincidan con los criterios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Standard Reusable Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
          itemName="eventos"
        />
      </div>
    </div>
  );
}
