import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Upload,
  Eye,
  Edit2,
  Trash2,
  QrCode,
  Filter,
  RefreshCw,
  PowerOff,
  Power,
  FileSpreadsheet,
} from "lucide-react";
import { empleadoService } from "../services/empleadoService";
import { Employee } from "../types";
import { AccessBadge } from "../components/common/Badge";
import { QRModal } from "../components/common/QRModal";
import { Pagination } from "../components/common/Pagination";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import EmpleadoFormDrawer from "./EmpleadoFormDrawer";
import EmpleadoCsvDrawer from "./EmpleadoCsvDrawer";
import { toast } from "sonner";

export default function Empleados() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Drawers and Modals
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [csvDrawerOpen, setCsvDrawerOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrEmployee, setQrEmployee] = useState<Employee | null>(null);

  // Soft Delete Confirmation Dialog
  const [confirmDialogState, setConfirmDialogState] = useState<{
    isOpen: boolean;
    employee: Employee | null;
  }>({
    isOpen: false,
    employee: null,
  });

  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const loadEmployees = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await empleadoService.listarTodos();
      setEmployees(data);
      if (showToast) {
        toast.success("Directorio de personal actualizado", {
          description: "Registros y credenciales sincronizadas.",
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
    loadEmployees();
  }, []);

  const departments = Array.from(new Set(employees.map((e) => e.departamento)));

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.nombre.toLowerCase().includes(search.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(search.toLowerCase()) ||
      emp.id.toLowerCase().includes(search.toLowerCase()) ||
      (emp.cedula && emp.cedula.includes(search));

    const matchesDept =
      selectedDept === "ALL" || emp.departamento === selectedDept;

    const isActivo = emp.permisoAcceso ?? emp.acceso ?? true;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVO" && isActivo) ||
      (statusFilter === "INACTIVO" && !isActivo);

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setFormDrawerOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormDrawerOpen(true);
  };

  const handleOpenQr = (emp: Employee) => {
    setQrEmployee(emp);
    setQrModalOpen(true);
  };

  const handleToggleActiveConfirm = async () => {
    const emp = confirmDialogState.employee;
    if (!emp) return;

    const currentStatus = emp.permisoAcceso ?? emp.acceso ?? true;
    const newStatus = !currentStatus;
    try {
      const updated = await empleadoService.cambiarEstado(emp.id, newStatus);
      setEmployees((prev) =>
        prev.map((e) => (e.id === emp.id ? { ...e, ...updated, permisoAcceso: newStatus, acceso: newStatus } : e))
      );
      setConfirmDialogState({ isOpen: false, employee: null });
      toast.success(
        newStatus ? "Permiso reactivado" : "Registro deshabilitado (Soft Delete)",
        {
          description: `El estado de ${emp.nombre} ${emp.apellido} se actualizó manteniendo su trazabilidad BPF.`,
        }
      );
    } catch {
      toast.error("No se pudo actualizar el estado del empleado.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-5 rounded-lg border border-border shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-foreground">Directorio de Personal & Empleados</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {employees.length} colaboradores registrados · {employees.filter((e) => (e.permisoAcceso ?? e.acceso ?? true)).length} con credencial activa en planta.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCsvDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-secondary border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-md shadow-2xs transition-colors"
          >
            <Upload size={14} />
            <span>Carga Masiva (CSV)</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} />
            <span>Nuevo Empleado</span>
          </button>
          <button
            onClick={() => loadEmployees(true)}
            disabled={refreshing}
            className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            title="Actualizar lista"
            aria-label="Actualizar empleados"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
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
                placeholder="Buscar por ID, cédula, nombre o apellido..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Todos los departamentos</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVO">Solo Activos</option>
              <option value="INACTIVO">Solo Inactivos</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 font-mono text-[11px] uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">CÓDIGO QR / ID</th>
                <th className="px-6 py-3 font-semibold">NOMBRE COMPLETO</th>
                <th className="px-6 py-3 font-semibold">DEPARTAMENTO</th>
                <th className="px-6 py-3 font-semibold">CARGO OFICIAL</th>
                <th className="px-6 py-3 font-semibold">ESTADO ACCESO</th>
                <th className="px-6 py-3 font-semibold text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedEmployees.map((emp) => {
                const isActivo = emp.permisoAcceso ?? emp.acceso ?? true;
                return (
                  <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 font-mono font-medium text-primary">
                      <Link to={`/empleados/${emp.id}`} className="hover:underline">
                        {emp.id}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-semibold text-foreground">
                        {emp.nombre} {emp.apellido}
                      </span>
                      {emp.cedula && (
                        <span className="block text-[11px] font-mono text-muted-foreground">
                          Céd: {emp.cedula}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{emp.departamento}</td>
                    <td className="px-6 py-3 text-foreground">{emp.cargo}</td>
                    <td className="px-6 py-3">
                      <AccessBadge status={isActivo ? "activo" : "inactivo"} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/empleados/${emp.id}`}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Ver Expediente"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          title="Editar Ficha"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenQr(emp)}
                          className="p-1.5 rounded-md hover:bg-muted text-primary hover:text-primary transition-colors cursor-pointer"
                          title="Exportar QR"
                        >
                          <QrCode size={15} />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDialogState({
                              isOpen: true,
                              employee: emp,
                            })
                          }
                          className={`p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer ${
                            isActivo
                              ? "text-destructive hover:bg-destructive/10"
                              : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          }`}
                          title={isActivo ? "Deshabilitar Registro" : "Reactivar Registro"}
                        >
                          {isActivo ? <PowerOff size={15} /> : <Power size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No se encontraron empleados que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Standard Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredEmployees.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemName="empleados"
        />
      </div>

      {/* Empleado Form Drawer */}
      <EmpleadoFormDrawer
        isOpen={formDrawerOpen}
        onClose={() => setFormDrawerOpen(false)}
        employee={editingEmployee}
        onSuccess={loadEmployees}
      />

      {/* CSV Mass Import Drawer */}
      <EmpleadoCsvDrawer
        isOpen={csvDrawerOpen}
        onClose={() => setCsvDrawerOpen(false)}
        onSuccess={loadEmployees}
      />

      {/* QR Export Modal */}
      <QRModal
        isOpen={qrModalOpen}
        employee={qrEmployee}
        onClose={() => {
          setQrModalOpen(false);
          setQrEmployee(null);
        }}
      />

      {/* Soft Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={confirmDialogState.isOpen}
        title={
          (confirmDialogState.employee?.permisoAcceso ?? confirmDialogState.employee?.acceso ?? true)
            ? "¿Deshabilitar permiso de acceso al empleado?"
            : "¿Reactivar permiso de acceso al empleado?"
        }
        description={
          (confirmDialogState.employee?.permisoAcceso ?? confirmDialogState.employee?.acceso ?? true)
            ? `Al deshabilitar a ${confirmDialogState.employee?.nombre} ${confirmDialogState.employee?.apellido} (${confirmDialogState.employee?.id}), se revocará su acceso en torniquetes. Sus datos históricos y trazabilidad permanecerán intactos bajo norma BPF (nunca se borra de la base de datos).`
            : `Al reactivar a ${confirmDialogState.employee?.nombre} ${confirmDialogState.employee?.apellido} (${confirmDialogState.employee?.id}), se habilitará nuevamente su ingreso a instalaciones autorizadas.`
        }
        confirmLabel={
          (confirmDialogState.employee?.permisoAcceso ?? confirmDialogState.employee?.acceso ?? true)
            ? "Deshabilitar Registro"
            : "Reactivar Registro"
        }
        isDestructive={confirmDialogState.employee?.permisoAcceso ?? confirmDialogState.employee?.acceso ?? true}
        onConfirm={handleToggleActiveConfirm}
        onCancel={() => setConfirmDialogState({ isOpen: false, employee: null })}
      />
    </div>
  );
}
