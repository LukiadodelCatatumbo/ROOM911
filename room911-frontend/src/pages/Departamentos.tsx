import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  X,
  RefreshCw,
  PowerOff,
  Power,
  Search,
} from "lucide-react";
import { departamentoService } from "../services/departamentoService";
import { authService } from "../services/authService";
import { Department } from "../types";
import { RestrictionBadge } from "../components/common/Badge";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { Pagination } from "../components/common/Pagination";
import { toast } from "sonner";

interface DeptErrors {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  responsable?: string;
  capacidadMaxima?: string;
}

export default function Departamentos() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Drawer Form State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [responsable, setResponsable] = useState("");
  const [nivelRestriccion, setNivelRestriccion] = useState<
    "BAJA" | "MEDIA" | "ALTA" | "CRITICA"
  >("BAJA");
  const [capacidadMaxima, setCapacidadMaxima] = useState(50);
  const [errors, setErrors] = useState<DeptErrors>({});
  const [saving, setSaving] = useState(false);

  // Soft Delete Confirm State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    dept: Department | null;
  }>({
    isOpen: false,
    dept: null,
  });

  const [refreshing, setRefreshing] = useState(false);
  // El backend restringe escrituras a SUPER_ADMIN y ADMIN_ACCESOS (@PreAuthorize)
  const puedeEscribir = authService.puedeGestionarPersonal();

  const loadDepartments = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    try {
      const data = await departamentoService.listarTodos();
      setDepartments(data);
      if (showToast) {
        toast.success("Áreas y departamentos actualizados", {
          description: "Catálogo de zonas operativas sincronizado.",
        });
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje ||
          "No se pudieron cargar los departamentos"
      );
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = departments.filter((dept) => {
    const q = search.toLowerCase();
    return (
      (dept.nombre || "").toLowerCase().includes(q) ||
      (dept.codigo || "").toLowerCase().includes(q) ||
      (dept.descripcion || "").toLowerCase().includes(q) ||
      (dept.responsable || "").toLowerCase().includes(q) ||
      (dept.nivelRestriccion || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setCodigo("");
    setNombre("");
    setDescripcion("");
    setResponsable("");
    setNivelRestriccion("BAJA");
    setCapacidadMaxima(50);
    setErrors({});
    setDrawerOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setCodigo(dept.codigo || String(dept.id));
    setNombre(dept.nombre);
    setDescripcion(dept.descripcion || "");
    setResponsable(dept.responsable || "");
    setNivelRestriccion(
      (dept.nivelRestriccion === "CRITICA_ESTERIL"
        ? "CRITICA"
        : dept.nivelRestriccion || "BAJA") as "BAJA" | "MEDIA" | "ALTA" | "CRITICA"
    );
    setCapacidadMaxima(dept.capacidadMaxima || 50);
    setErrors({});
    setDrawerOpen(true);
  };

  const validateForm = (): boolean => {
    const errs: DeptErrors = {};
    const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\d-]+$/;

    if (!codigo.trim()) {
      errs.codigo = "El código de área es obligatorio.";
    } else if (codigo.trim().length < 2 || codigo.trim().length > 10) {
      errs.codigo = "El código debe tener entre 2 y 10 caracteres alfanuméricos.";
    }

    if (!nombre.trim()) {
      errs.nombre = "El nombre del área o departamento es obligatorio.";
    } else if (nombre.trim().length < 2 || nombre.trim().length > 60) {
      errs.nombre = "El nombre debe tener entre 2 y 60 caracteres.";
    }

    if (descripcion.trim().length > 255) {
      errs.descripcion = "La descripción no puede exceder 255 caracteres.";
    }

    if (!responsable.trim()) {
      errs.responsable = "El responsable o supervisor del área es obligatorio.";
    } else if (responsable.trim().length < 2 || responsable.trim().length > 60) {
      errs.responsable = "El nombre del responsable debe tener entre 2 y 60 caracteres.";
    }

    if (capacidadMaxima < 1 || capacidadMaxima > 500) {
      errs.capacidadMaxima = "La capacidad debe ser un número entre 1 y 500 personas.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const datos = {
        codigo: codigo.trim().toUpperCase(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        responsable: responsable.trim(),
        nivelRestriccion,
        capacidadMaxima: Number(capacidadMaxima),
      };
      if (editingDept) {
        await departamentoService.actualizar(editingDept.id, datos);
        toast.success("Área actualizada correctamente", {
          description: `Se modificaron los parámetros para ${nombre}.`,
        });
      } else {
        await departamentoService.crear(datos);
        toast.success("Nueva área registrada", {
          description: `El departamento ${nombre} está activo en el sistema.`,
        });
      }
      setDrawerOpen(false);
      loadDepartments();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje || "Error al guardar el departamento"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    const d = confirmDialog.dept;
    if (!d) return;

    const newStatus = d.activo === false ? true : false;
    try {
      await departamentoService.cambiarEstado(d.id, newStatus);
      setConfirmDialog({ isOpen: false, dept: null });
      toast.success(
        newStatus ? "Área reactivada" : "Área deshabilitada (Soft Delete)",
        {
          description: `El estado del área ${d.nombre} se actualizó sin eliminar registros históricos.`,
        }
      );
      loadDepartments();
    } catch {
      toast.error("No se pudo actualizar el estado del área.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-5 rounded-lg border border-border shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-foreground">Áreas y Departamentos Farmacéuticos</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {departments.length} zonas operativas configuradas bajo clasificación de riesgo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {puedeEscribir && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-primary/90 transition-colors"
            >
              <Plus size={15} />
              <span>Nueva Área</span>
            </button>
          )}
          <button
            onClick={() => loadDepartments(true)}
            disabled={refreshing}
            className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            title="Actualizar lista"
            aria-label="Actualizar departamentos"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-card p-4 rounded-lg border border-border shadow-2xs">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar por nombre, código, descripción, responsable o nivel de restricción..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && filteredDepartments.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-card border border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center gap-2 text-center">
            <Building2 size={28} className="text-muted-foreground/50" />
            <p className="text-sm font-semibold text-foreground">
              {search ? "No se encontraron áreas que coincidan con la búsqueda" : "No hay áreas registradas"}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm">
              {search
                ? "Intente con otros términos de búsqueda."
                : "Aún no se han configurado zonas operativas. Registre la primera área para comenzar a asignar personal y controlar accesos."}
            </p>
          </div>
        )}
        {paginatedDepartments.map((dept) => (
          <div
            key={dept.id}
            className={`bg-white dark:bg-card border rounded-lg p-5 shadow-2xs flex flex-col justify-between transition-all ${
              dept.activo === false ? "opacity-60 border-dashed border-border" : "border-border hover:border-primary/40"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-primary">{dept.codigo || dept.id}</span>
                  <h2 className="text-base font-bold text-foreground mt-0.5">{dept.nombre}</h2>
                </div>
                <RestrictionBadge level={dept.nivelRestriccion} />
              </div>

              <div className="space-y-2 text-xs border-t border-border pt-3">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Responsable BPF:</span>
                  <span className="font-medium text-foreground">{dept.responsable || "No asignado"}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Personal Asignado:</span>
                  <span className="font-mono font-medium text-foreground">
                    {dept.cantidadEmpleados || dept.totalEmpleados || 0} colaboradores
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Capacidad / Aforo Máximo:</span>
                  <span className="font-mono font-medium text-foreground">{dept.capacidadMaxima || 50} personas</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Estado Operativo:</span>
                  <span className={`font-semibold font-mono ${dept.activo !== false ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                    {dept.activo !== false ? "Habilitado" : "Deshabilitado"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            {puedeEscribir && (
              <div className="border-t border-border pt-4 mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-background hover:bg-muted border border-border rounded-md text-xs font-medium text-foreground transition-colors"
                >
                  <Edit2 size={13} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => setConfirmDialog({ isOpen: true, dept })}
                  className={`p-1.5 border rounded-md transition-colors ${
                    dept.activo !== false
                      ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                      : "border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  }`}
                  title={dept.activo !== false ? "Deshabilitar Área" : "Reactivar Área"}
                >
                  {dept.activo !== false ? <PowerOff size={14} /> : <Power size={14} />}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredDepartments.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newSize) => {
          setItemsPerPage(newSize);
          setCurrentPage(1);
        }}
        itemName="áreas"
      />

      {/* Form Drawer (Create / Edit Department) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-card text-card-foreground shadow-2xl h-full flex flex-col border-l border-border z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    {editingDept ? "Editar Área Farmacéutica" : "Registrar Nueva Área"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground">Configuración de Zonas</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Código */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Código de Área / Nomenclatura <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Ej. PROD, QC, I+D, ALM"
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value.toUpperCase());
                    if (errors.codigo) setErrors({ ...errors, codigo: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs font-mono uppercase text-foreground focus:outline-hidden focus:ring-1 ${
                    errors.codigo ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.codigo && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.codigo}</span>
                  </p>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Nombre del Área <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  placeholder="Ej. Sala de Producción Estéril A"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                    if (errors.nombre) setErrors({ ...errors, nombre: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                    errors.nombre ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.nombre && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.nombre}</span>
                  </p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Descripción del Área
                </label>
                <textarea
                  rows={2}
                  maxLength={255}
                  placeholder="Ej. Líneas de síntesis y envasado farmacéutico bajo grado D"
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    if (errors.descripcion) setErrors({ ...errors, descripcion: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground resize-none focus:outline-hidden focus:ring-1 ${
                    errors.descripcion ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.descripcion && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.descripcion}</span>
                  </p>
                )}
              </div>

              {/* Responsable */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Responsable Técnico <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  placeholder="Ej. Dra. Carmen López"
                  value={responsable}
                  onChange={(e) => {
                    setResponsable(e.target.value);
                    if (errors.responsable) setErrors({ ...errors, responsable: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                    errors.responsable ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.responsable && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.responsable}</span>
                  </p>
                )}
              </div>

              {/* Nivel de Restricción */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Nivel de Criticidad / Restricción Biológica <span className="text-destructive">*</span>
                </label>
                <select
                  value={nivelRestriccion}
                  onChange={(e) => setNivelRestriccion(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  <option value="BAJA">Baja — Acceso General (Oficinas, Comedores)</option>
                  <option value="MEDIA">Media — Control Moderado (Almacén, Empaque)</option>
                  <option value="ALTA">Alta — Restricción Rigurosa (Laboratorios QC/I+D)</option>
                  <option value="CRITICA">Crítica — Sala Limpia / Grado A-B Estéril</option>
                </select>
              </div>

              {/* Capacidad Máxima */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Aforo / Capacidad Máxima Simultánea <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  placeholder="1 - 500 personas"
                  value={capacidadMaxima || ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 3);
                    const num = raw ? parseInt(raw, 10) : 0;
                    setCapacidadMaxima(num);
                    if (errors.capacidadMaxima) setErrors({ ...errors, capacidadMaxima: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 ${
                    errors.capacidadMaxima ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.capacidadMaxima && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.capacidadMaxima}</span>
                  </p>
                )}
              </div>
            </form>

            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveDept}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? "Guardando..." : editingDept ? "Guardar Cambios" : "Crear Área"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Delete Confirm Modal */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.dept?.activo !== false
            ? "¿Deshabilitar área farmacéutica?"
            : "¿Reactivar área farmacéutica?"
        }
        description={
          confirmDialog.dept?.activo !== false
            ? `Al deshabilitar el área ${confirmDialog.dept?.nombre} (${confirmDialog.dept?.codigo || confirmDialog.dept?.id}), los lectores de torniquetes bloquearán nuevos ingresos a esta zona. Los registros históricos de auditoría se conservan intactos (nunca se borra de la base de datos).`
            : `Al reactivar el área ${confirmDialog.dept?.nombre}, volverá a admitir personal con autorización asignada.`
        }
        confirmLabel={
          confirmDialog.dept?.activo !== false ? "Deshabilitar Área" : "Reactivar Área"
        }
        isDestructive={confirmDialog.dept?.activo !== false}
        onConfirm={handleToggleActive}
        onCancel={() => setConfirmDialog({ isOpen: false, dept: null })}
      />
    </div>
  );
}
