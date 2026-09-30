import { useState, useEffect, useRef } from "react";
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
import { fechaLocalISO } from "../utils/fechas";

export default function HistorialAccesos() {
  // Contenido de la página actual: el servidor pagina y filtra, no la memoria.
  const [logs, setLogs] = useState<AccessEntry[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [resultadoFilter, setResultadoFilter] = useState("ALL");
  // Vacío = sin límite de rango (muestra todo el historial)
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [errorCarga, setErrorCarga] = useState(false);

  // Pagination state (server-driven)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const todayStr = fechaLocalISO();

  const [refreshing, setRefreshing] = useState(false);

  // Guard anti-race: descarta respuestas de peticiones viejas si una más
  // reciente ya se disparó (cambio de filtro o de página).
  const peticionIdRef = useRef(0);

  // ALL → sin filtro; CONCEDIDO → exito=true; DENEGADO → exito=false.
  const exitoFiltro =
    resultadoFilter === "ALL"
      ? undefined
      : resultadoFilter === "CONCEDIDO"
      ? true
      : false;

  const construirParams = (pagina: number, tamano: number) => ({
    pagina: pagina - 1,
    tamano,
    exito: exitoFiltro,
    desde: dateFrom || undefined,
    hasta: dateTo || undefined,
    texto: searchInput.trim() || undefined,
  });

  const loadLogs = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    const miPeticion = ++peticionIdRef.current;
    try {
      const pagina = await accesoService.listarHistorial(
        construirParams(currentPage, itemsPerPage)
      );
      if (miPeticion !== peticionIdRef.current) {
        return; // llegó tarde: una petición más reciente ya tomó el turno
      }
      // Si los datos se redujeron y la página quedó fuera de rango, corrige
      // y deja que el efecto recargue en la última página válida.
      if (
        pagina.contenido.length === 0 &&
        pagina.totalPaginas > 0 &&
        currentPage > pagina.totalPaginas
      ) {
        setCurrentPage(pagina.totalPaginas);
        return;
      }
      setLogs(pagina.contenido);
      setTotalItems(pagina.totalElementos);
      setTotalPages(Math.max(1, pagina.totalPaginas));
      setErrorCarga(false);
      if (showToast) {
        toast.success("Historial de auditoría actualizado", {
          description: "Registros de eventos BPF sincronizados.",
        });
      }
    } catch (err: any) {
      setErrorCarga(true);
      toast.error(
        err?.response?.data?.mensaje ||
          "No se pudo cargar el historial de auditoría",
        {
          description: err?.response?.data?.mensaje
            ? "Corrige los filtros e inténtalo de nuevo."
            : "Verifica la conexión con el servidor e inténtalo de nuevo.",
        }
      );
    } finally {
      if (showToast) setRefreshing(false);
    }
  };

  // Debounce para no disparar una petición por tecla ni por cambio de filtro.
  useEffect(() => {
    const t = setTimeout(() => {
      loadLogs();
    }, 350);
    return () => clearTimeout(t);
  }, [currentPage, itemsPerPage, searchInput, resultadoFilter, dateFrom, dateTo]);

  const paginatedLogs = logs;

  const obtenerRegistrosParaExportar = async (): Promise<AccessEntry[]> => {
    try {
      const pagina = await accesoService.listarHistorial(construirParams(1, 1000));
      return pagina.contenido;
    } catch {
      toast.error("No se pudieron obtener los registros para exportar");
      return [];
    }
  };

  const handleExportCSV = async () => {
    const registros = await obtenerRegistrosParaExportar();
    if (registros.length === 0) {
      toast.error("No hay registros para exportar");
      return;
    }
    const headers = ["ID Evento", "Fecha", "Hora", "ID Empleado", "Nombre Personal", "Departamento", "Puerta / Esclusa", "Resultado", "Motivo / Detalle Tecnico"];
    const rows = registros.map((log) => [
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
      description: `${registros.length} registros exportados con trazabilidad.`,
    });
  };

  const handleExportPDF = async () => {
    const registros = await obtenerRegistrosParaExportar();
    if (registros.length === 0) {
      toast.error("No hay registros para exportar");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Permita ventanas emergentes para generar el informe imprimible.");
      return;
    }

    const todayStr = new Date().toLocaleString("es-MX");
    const rowsHtml = registros
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
            <p>Fecha de emisión: ${todayStr} | Total registros: ${registros.length}</p>
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
            {totalItems} eventos históricos registrados bajo norma de inmutabilidad y trazabilidad.
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

      {/* Error Banner */}
      {errorCarga && (
        <div className="flex items-center justify-between gap-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-lg text-xs">
          <span>
            No se pudieron cargar los registros de auditoría. Los datos mostrados pueden estar desactualizados.
          </span>
          <button
            onClick={() => loadLogs()}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

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
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
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
            </select>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Desde:</span>
            <input
              type="date"
              value={dateFrom}
              max={todayStr}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1 bg-background border border-border rounded-md text-xs text-foreground"
            />
            <span>Hasta:</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              max={todayStr}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
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
          totalItems={totalItems}
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
