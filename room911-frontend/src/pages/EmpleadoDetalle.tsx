import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  User,
  QrCode,
  Download,
} from "lucide-react";
import { empleadoService } from "../services/empleadoService";
import { accesoService } from "../services/accesoService";
import { useAuth } from "../context/AuthContext";
import { Employee, AccessEntry } from "../types";
import { VariantBar } from "../components/common/VariantBar";
import { AccesoBadge, AccessBadge } from "../components/common/Badge";
import { QRModal } from "../components/common/QRModal";
import { Pagination } from "../components/common/Pagination";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { toast } from "sonner";

export default function EmpleadoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [history, setHistory] = useState<AccessEntry[]>([]);
  const [variant, setVariant] = useState<"tabs" | "timeline">("tabs");
  const [activeTab, setActiveTab] = useState<"info" | "historial">("info");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // El backend restringe escrituras a SUPER_ADMIN y ADMIN_ACCESOS (@PreAuthorize)
  const { puedeGestionarPersonal: puedeEscribir } = useAuth();

  // Pagination for employee history
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const emp = await empleadoService.resolverReferencia(id);
        setEmployee(emp);
        const logs = await accesoService.listarPorEmpleado(emp.dbId ?? emp.id);
        setHistory(logs);
      } catch {
        toast.error("Error al cargar expediente de personal");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleTogglePermiso = async () => {
    if (!employee) return;
    const newStatus = !employee.permisoAcceso;
    try {
      const updated = await empleadoService.cambiarEstado(employee.dbId ?? employee.id, newStatus);
      setEmployee(updated);
      setConfirmToggleOpen(false);
      toast.success(
        newStatus ? "Permiso de acceso reactivado" : "Permiso de acceso revocado (Deshabilitado)",
        {
          description: `El estado de ${employee.nombre} ${employee.apellido} fue actualizado bajo norma BPF.`,
        }
      );
    } catch {
      toast.error("No se pudo actualizar el estado de acceso.");
    }
  };

  const handleDescargarPdf = async () => {
    if (!employee) return;
    try {
      await accesoService.descargarPdf(employee.dbId ?? employee.id);
      toast.success(`Informe PDF generado para ${employee.nombre} ${employee.apellido}`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje || "No se pudo generar el informe PDF"
      );
    }
  };

  if (loading || !employee) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-muted-foreground text-xs">
        <span>Cargando expediente de personal...</span>
      </div>
    );
  }

  const variantOptions = [
    { value: "tabs", label: "Vista por Pestañas", description: "Estructura por secciones para pantalla estándar." },
    { value: "timeline", label: "Línea de Tiempo", description: "Vista cronológica de accesos." },
  ];

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedHistory = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const ProfileDetailsCard = () => (
    <div className="bg-white dark:bg-card border border-border rounded-lg p-6 shadow-2xs space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-border flex items-center justify-center text-slate-400">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">
            {employee.nombre} {employee.apellido}
          </h2>
          <span className="font-mono text-xs text-primary font-semibold">{employee.id}</span>
          <div className="mt-1 flex items-center gap-2">
            <AccessBadge status={employee.permisoAcceso ? "activo" : "inactivo"} />
            <span className="text-[11px] text-muted-foreground">· Registrado el {employee.fechaRegistro}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-[11px] text-muted-foreground uppercase font-mono">Departamento</span>
          <p className="font-medium text-foreground mt-0.5">{employee.departamento}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground uppercase font-mono">Cargo Oficial</span>
          <p className="font-medium text-foreground mt-0.5">{employee.cargo}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground uppercase font-mono">Cédula / Documento</span>
          <p className="font-mono font-medium text-foreground mt-0.5">{employee.cedula || "No registrado"}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground uppercase font-mono">Correo Electrónico</span>
          <p className="font-medium text-foreground mt-0.5 truncate">{employee.email || "No registrado"}</p>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-foreground">Control de Acceso</span>
          <p className="text-[11px] text-muted-foreground">
            {employee.permisoAcceso
              ? "Acceso autorizado en torniquetes y esclusas asignadas."
              : "Acceso revocado temporalmente por administración."}
          </p>
        </div>
        {puedeEscribir && (
          <button
            onClick={() => setConfirmToggleOpen(true)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              employee.permisoAcceso
                ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                : "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            }`}
          >
            {employee.permisoAcceso ? "Deshabilitar Acceso" : "Reactivar Acceso"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F7F8FA] dark:bg-background">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="px-6 py-4 bg-white dark:bg-card border-b border-border flex items-center justify-between gap-4 flex-wrap shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/empleados")}
            className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Volver al Directorio"
            aria-label="Volver al directorio de empleados"
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground">
                {employee.nombre} {employee.apellido}
              </h1>
              <AccessBadge status={employee.permisoAcceso ? "activo" : "inactivo"} />
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              {employee.id} · {employee.departamento}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-secondary border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-md shadow-2xs transition-colors"
          >
            <QrCode size={14} className="text-primary" />
            <span>Exportar QR</span>
          </button>
          <button
            onClick={handleDescargarPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-secondary border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-md shadow-2xs transition-colors"
          >
            <Download size={14} />
            <span>Informe PDF</span>
          </button>
        </div>
      </div>

      {/* Variant Selector */}
      <VariantBar
        options={variantOptions}
        value={variant}
        onChange={(v) => setVariant(v as "tabs" | "timeline")}
      />

      {/* Main View Area */}
      {variant === "tabs" ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tabs bar */}
          <div className="px-6 bg-white dark:bg-card border-b border-border shrink-0">
            <div className="flex gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === "info"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Ficha del Personal
              </button>
              <button
                onClick={() => setActiveTab("historial")}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === "historial"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Historial de Accesos & Trazabilidad ({history.length})
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "info" ? (
              <div className="max-w-2xl">
                <ProfileDetailsCard />
              </div>
            ) : (
              <div className="bg-white dark:bg-card border border-border rounded-lg shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Registro de Entradas y Salidas</span>
                  <span className="text-[11px] font-mono text-muted-foreground">Trazabilidad BPF</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 font-mono text-[11px] uppercase text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-5 py-2.5 font-semibold">ID Evento</th>
                        <th className="px-5 py-2.5 font-semibold">Fecha y Hora</th>
                        <th className="px-5 py-2.5 font-semibold">Puerta / Esclusa</th>
                        <th className="px-5 py-2.5 font-semibold">Resultado</th>
                        <th className="px-5 py-2.5 font-semibold">Detalle Técnico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedHistory.map((h) => (
                        <tr key={h.id} className="hover:bg-muted/20">
                          <td className="px-5 py-2.5 font-mono text-primary font-medium">{h.id}</td>
                          <td className="px-5 py-2.5 font-mono text-muted-foreground">
                            {h.fecha} {h.hora}
                          </td>
                          <td className="px-5 py-2.5 font-medium text-foreground">{h.puerta}</td>
                          <td className="px-5 py-2.5">
                            <AccesoBadge resultado={h.resultado} />
                          </td>
                          <td className="px-5 py-2.5 text-muted-foreground">{h.motivo}</td>
                        </tr>
                      ))}
                      {paginatedHistory.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                            No hay registros de accesos registrados para este empleado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={history.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  itemName="eventos"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0 overflow-hidden">
          <div className="w-80 shrink-0 border-r border-border overflow-y-auto p-6 bg-white dark:bg-card">
            <ProfileDetailsCard />
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-[#F7F8FA] dark:bg-background">
            <h2 className="text-sm font-bold text-foreground mb-4">Línea de Tiempo de Accesos</h2>
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 ${
                        item.resultado === "CONCEDIDO"
                          ? "bg-emerald-500"
                          : item.resultado === "DENEGADO"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <div className="w-0.5 h-12 bg-border mt-1" />
                  </div>
                  <div className="bg-white dark:bg-card border border-border p-3.5 rounded-lg flex-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{item.puerta}</span>
                      <AccesoBadge resultado={item.resultado} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{item.motivo}</p>
                    <span className="font-mono text-[10px] text-slate-400 block mt-2">
                      {item.fecha} a las {item.hora} · {item.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR Modal (Strictly Controlled by qrModalOpen) */}
      <QRModal
        isOpen={qrModalOpen}
        employee={employee}
        onClose={() => setQrModalOpen(false)}
      />

      {/* Soft Delete / Deshabilitar Dialog */}
      <ConfirmDialog
        isOpen={confirmToggleOpen}
        title={employee.permisoAcceso ? "¿Deshabilitar permiso de acceso?" : "¿Reactivar permiso de acceso?"}
        description={
          employee.permisoAcceso
            ? `Al deshabilitar a ${employee.nombre} ${employee.apellido}, se bloqueará su ingreso en torniquetes y terminales. Todo su historial de auditoría e identificación permanecerá intacto bajo norma BPF (nunca se borra de la base de datos).`
            : `Al reactivar a ${employee.nombre} ${employee.apellido}, volverá a tener autorización de acceso en sus áreas designadas.`
        }
        confirmLabel={employee.permisoAcceso ? "Deshabilitar Acceso" : "Reactivar Acceso"}
        isDestructive={employee.permisoAcceso}
        onConfirm={handleTogglePermiso}
        onCancel={() => setConfirmToggleOpen(false)}
      />
    </div>
  );
}
