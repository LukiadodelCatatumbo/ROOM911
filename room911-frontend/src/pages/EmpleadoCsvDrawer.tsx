import { useState, useEffect, useRef } from "react";
import { Drawer } from "../components/common/Drawer";
import { Upload, FileText, CheckCircle2, AlertCircle, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import { empleadoService } from "../services/empleadoService";
import { departamentoService } from "../services/departamentoService";
import { Department } from "../types";

export interface EmpleadoCsvDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onImportComplete?: () => void;
}

interface CsvRowPreview {
  fila: number;
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  cargo: string;
  errores: string[];
}

const CABECERA_ESPERADA = "nombre, apellido, documento, correo, cargo";

/** Divide una línea CSV respetando comillas simples dobles. */
const parsearLineaCsv = (linea: string): string[] => {
  const campos: string[] = [];
  let actual = "";
  let entreComillas = false;
  for (const char of linea) {
    if (char === '"') {
      entreComillas = !entreComillas;
    } else if (char === "," && !entreComillas) {
      campos.push(actual);
      actual = "";
    } else {
      actual += char;
    }
  }
  campos.push(actual);
  return campos.map((c) => c.trim());
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmpleadoCsvDrawer({
  open,
  isOpen,
  onClose,
  onImportComplete,
  onSuccess,
}: EmpleadoCsvDrawerProps) {
  const isDrawerOpen = isOpen !== undefined ? isOpen : (open ?? false);
  const [step, setStep] = useState<"upload" | "preview">("upload");
  const [dragOver, setDragOver] = useState(false);
  const [rows, setRows] = useState<CsvRowPreview[]>([]);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departamentoId, setDepartamentoId] = useState<string>("");
  const [importando, setImportando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDrawerOpen || departments.length > 0) return;
    departamentoService
      .listarTodos()
      .then((data) => {
        const activos = data.filter((d) => d.activo !== false);
        setDepartments(activos);
        if (activos.length > 0) setDepartamentoId(String(activos[0].id));
      })
      .catch(() => {
        toast.error("No se pudieron cargar los departamentos");
      });
  }, [isDrawerOpen, departments.length]);

  const validRows = rows.filter((r) => r.errores.length === 0);
  const errorRows = rows.filter((r) => r.errores.length > 0);

  const procesarArchivo = (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("El archivo debe tener extensión .csv");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const texto = String(reader.result || "");
      const lineas = texto.split(/\r?\n/).filter((l) => l.trim());
      if (lineas.length < 2) {
        toast.error("El archivo no contiene registros para importar");
        return;
      }
      const preview: CsvRowPreview[] = lineas.slice(1).map((linea, idx) => {
        const [nombre, apellido, documento, correo, cargo] = parsearLineaCsv(linea);
        const errores: string[] = [];
        if (!nombre) errores.push("Nombre requerido");
        if (!apellido) errores.push("Apellido requerido");
        if (!documento) errores.push("Documento requerido");
        if (!correo || !emailRegex.test(correo)) errores.push("Correo inválido");
        if (!cargo) errores.push("Cargo requerido");
        return {
          fila: idx + 2,
          nombre,
          apellido,
          documento,
          correo,
          cargo,
          errores,
        };
      });
      setArchivo(file);
      setRows(preview);
      setStep("preview");
    };
    reader.onerror = () => toast.error("No se pudo leer el archivo");
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) procesarArchivo(file);
    e.target.value = "";
  };

  const handleConfirm = async () => {
    if (!archivo) return;
    if (!departamentoId) {
      toast.error("Seleccione el departamento destino de la importación");
      return;
    }
    setImportando(true);
    try {
      const mensaje = await empleadoService.importarCSV(
        Number(departamentoId),
        archivo
      );
      toast.success("Importación finalizada", {
        description: mensaje || `${validRows.length} empleados enviados al servidor.`,
      });
      setStep("upload");
      setArchivo(null);
      setRows([]);
      onImportComplete?.();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje || "Error al importar el archivo CSV"
      );
    } finally {
      setImportando(false);
    }
  };

  const handleClose = () => {
    setStep("upload");
    onClose();
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={handleClose}
      title="Carga Masiva de Empleados (CSV)"
      subtitle="Importe múltiples credenciales validando la integridad de datos antes de guardar"
      width={580}
    >
      {step === "upload" ? (
        <div className="p-6 space-y-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Suba un archivo <code>.csv</code> delimitado por comas con la cabecera{" "}
            <code>{CABECERA_ESPERADA}</code>. Los empleados se crearán en el departamento seleccionado.
          </p>

          {/* Selector de departamento destino */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Departamento destino <span className="text-destructive">*</span>
            </label>
            <select
              value={departamentoId}
              onChange={(e) => setDepartamentoId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              {departments.length === 0 && <option value="">Sin departamentos disponibles</option>}
              {departments.map((d) => (
                <option key={d.id} value={String(d.id)}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) procesarArchivo(file);
            }}
            className={[
              "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-3 transition-colors text-center cursor-pointer",
              dragOver
                ? "border-primary bg-[#EEF4FB] dark:bg-primary/10"
                : "border-border bg-[#FAFBFC] dark:bg-secondary/20 hover:border-primary/60",
            ].join(" ")}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Haga clic o arrastre su archivo CSV aquí
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos compatibles: .csv UTF-8 (hasta 10MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="sr-only"
              onChange={handleFileSelect}
            />
          </div>

          {/* Expected CSV Header Reference */}
          <div className="p-4 bg-muted/70 rounded-md border border-border">
            <p className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
              <FileText size={14} className="text-primary" />
              <span>Estructura de encabezados requerida:</span>
            </p>
            <code className="text-[11px] font-mono text-muted-foreground block bg-white dark:bg-card p-2 rounded-xs border border-border/70 overflow-x-auto">
              {CABECERA_ESPERADA}
            </code>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Summary status bar */}
          <div className="px-6 py-3 border-b border-border bg-[#F7F8FA] dark:bg-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <CheckCircle2 size={15} />
                <span>{validRows.length} válidas</span>
              </span>
              {errorRows.length > 0 && (
                <span className="flex items-center gap-1.5 font-semibold text-destructive">
                  <AlertCircle size={15} />
                  <span>{errorRows.length} con advertencia</span>
                </span>
              )}
            </div>
            <button
              onClick={() => setStep("upload")}
              type="button"
              className="text-xs text-primary font-semibold hover:underline cursor-pointer"
            >
              ← Cambiar archivo
            </button>
          </div>

          {/* Preview Table */}
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Vista Previa de Registros ({rows.length} filas analizadas)
            </p>
            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full text-xs text-left border-collapse" aria-label="Previsualización de datos">
                <thead className="bg-[#F0F2F6] dark:bg-secondary/40 text-muted-foreground font-semibold">
                  <tr>
                    <th className="px-3 py-2.5">#</th>
                    <th className="px-3 py-2.5">Nombre Completo</th>
                    <th className="px-3 py-2.5">Documento</th>
                    <th className="px-3 py-2.5">Correo</th>
                    <th className="px-3 py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr
                      key={row.fila}
                      className={row.errores.length > 0 ? "bg-rose-50/50 dark:bg-rose-950/20" : "bg-white dark:bg-card"}
                    >
                      <td className="px-3 py-2 font-mono text-muted-foreground">{row.fila}</td>
                      <td className="px-3 py-2 text-foreground">
                        {row.nombre} {row.apellido || <span className="text-destructive italic">(Vacío)</span>}
                      </td>
                      <td className="px-3 py-2 font-mono text-foreground">{row.documento || "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.correo || "—"}</td>
                      <td className="px-3 py-2">
                        {row.errores.length > 0 ? (
                          <span className="text-destructive font-medium flex items-center gap-1">
                            <AlertTriangle size={11} /> {row.errores[0]}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <Check size={11} /> OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confirm footer */}
          <div className="px-6 py-4 border-t border-border bg-[#F7F8FA] dark:bg-card flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={handleClose}
              type="button"
              className="px-4 py-2 text-xs font-semibold border border-border rounded-md bg-white dark:bg-secondary hover:bg-secondary text-foreground transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              type="button"
              disabled={validRows.length === 0 || importando}
              className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-md hover:bg-[#0A4F8A] transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60 cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Upload size={14} />
              <span>{importando ? "Importando..." : `Importar ${validRows.length} Empleados`}</span>
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default EmpleadoCsvDrawer;
