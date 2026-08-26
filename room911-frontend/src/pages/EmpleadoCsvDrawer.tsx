import { useState, useRef } from "react";
import { Drawer } from "../components/common/Drawer";
import { Upload, FileText, CheckCircle2, AlertCircle, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../components/common/Badge";

export interface EmpleadoCsvDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onImportComplete?: () => void;
}

interface CsvRowPreview {
  fila: number;
  id: string;
  nombre: string;
  apellido: string;
  departamento: string;
  cargo: string;
  email: string;
  acceso: string;
  errores: string[];
}

const SAMPLE_CSV_ROWS: CsvRowPreview[] = [
  { fila: 1, id: "EMP-0601", nombre: "Valentina", apellido: "Reyes Ortega", departamento: "Producción", cargo: "Técnica", email: "v.reyes2@pharma911.com", acceso: "true", errores: [] },
  { fila: 2, id: "EMP-0602", nombre: "José", apellido: "Morales Vega", departamento: "", cargo: "Supervisor", email: "j.morales@pharma911.com", acceso: "true", errores: ["Departamento requerido"] },
  { fila: 3, id: "EMP-0603", nombre: "Ana", apellido: "Castillo Ramos", departamento: "Control de Calidad", cargo: "Analista", email: "ana.castillo2@pharma911.com", acceso: "false", errores: [] },
  { fila: 4, id: "EMP-0604", nombre: "Pedro", apellido: "", departamento: "Almacén y Logística", cargo: "Operario", email: "p.santos@pharma911.com", acceso: "true", errores: ["Apellido requerido"] },
  { fila: 5, id: "EMP-0605", nombre: "María", apellido: "Vega Torres", departamento: "Investigación y Desarrollo", cargo: "Investigadora", email: "m.vega2@pharma911.com", acceso: "true", errores: [] },
];

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
  const [rows, setRows] = useState<CsvRowPreview[]>(SAMPLE_CSV_ROWS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validRows = rows.filter((r) => r.errores.length === 0);
  const errorRows = rows.filter((r) => r.errores.length > 0);

  const handleFileSelect = () => {
    setRows(SAMPLE_CSV_ROWS);
    setStep("preview");
  };

  const handleConfirm = () => {
    toast.success(`${validRows.length} Empleados Importados con Éxito`, {
      description: errorRows.length > 0 ? `${errorRows.length} filas con error fueron omitidas.` : "Todos los registros cargados en base de datos.",
    });
    setStep("upload");
    onImportComplete?.();
    onSuccess?.();
    onClose();
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
            Suba un archivo con formato <code>.csv</code> delimitado por comas. El sistema verificará que cada empleado cuente con departamento válido, nombre y correo único.
          </p>

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
              handleFileSelect();
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
              id, nombre, apellido, departamento, cargo, email, acceso
            </code>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleFileSelect}
              type="button"
              className="text-xs text-primary font-semibold hover:underline cursor-pointer"
            >
              Cargar archivo CSV de muestra (Demo) →
            </button>
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
                    <th className="px-3 py-2.5">ID</th>
                    <th className="px-3 py-2.5">Nombre Completo</th>
                    <th className="px-3 py-2.5">Departamento</th>
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
                      <td className="px-3 py-2 font-mono font-semibold text-foreground">{row.id}</td>
                      <td className="px-3 py-2 text-foreground">
                        {row.nombre} {row.apellido || <span className="text-destructive italic">(Vacío)</span>}
                      </td>
                      <td className="px-3 py-2">
                        {row.departamento || <span className="text-destructive italic">(Falta área)</span>}
                      </td>
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
              disabled={validRows.length === 0}
              className="px-5 py-2 text-xs font-semibold bg-primary text-white rounded-md hover:bg-[#0A4F8A] transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60 cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Upload size={14} />
              <span>Importar {validRows.length} Empleados</span>
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

export default EmpleadoCsvDrawer;
