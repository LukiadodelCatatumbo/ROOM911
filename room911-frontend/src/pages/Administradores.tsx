import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Plus,
  Search,
  Edit2,
  PowerOff,
  AlertCircle,
  X,
  RefreshCw,
  UserMinus,
  Check,
} from "lucide-react";
import { adminService } from "../services/adminService";
import { authService } from "../services/authService";
import { AdminUser } from "../types";
import { RoleBadge } from "../components/common/Badge";
import { Pagination } from "../components/common/Pagination";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { toast } from "sonner";

interface AdminErrors {
  usuario?: string;
  nombre?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Administradores() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const currentUser = authService.getCurrentUser();
  // Coincide con los @PreAuthorize del backend: crear/editar requiere
  // SUPER_ADMIN o ADMIN_SISTEMAS; eliminar es exclusivo de SUPER_ADMIN.
  const puedeGestionar = authService.puedeGestionarAdministradores();
  const esSuperAdmin = authService.esSuperAdmin();

  // Modal / Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [usuario, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState<"SUPER_ADMIN" | "ADMIN_ACCESOS" | "ADMIN_SISTEMAS">("ADMIN_ACCESOS");
  const [errors, setErrors] = useState<AdminErrors>({});
  const [saving, setSaving] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Confirm State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    admin: AdminUser | null;
  }>({
    isOpen: false,
    admin: null,
  });

  const [refreshing, setRefreshing] = useState(false);

  const getPasswordStrength = (pass: string) => {
    const checks = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass),
    };

    if (!pass) {
      return {
        score: 0,
        label: "Sin contraseña",
        color: "bg-muted",
        textClass: "text-muted-foreground",
        checks,
      };
    }

    let score = 0;
    if (checks.length) score++;
    if (checks.upper && checks.lower) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    if (score <= 1) {
      return {
        score: 1,
        label: "Débil / Insegura",
        color: "bg-rose-500",
        textClass: "text-rose-500",
        checks,
      };
    }
    if (score === 2 || score === 3) {
      return {
        score: 2,
        label: "Aceptable",
        color: "bg-amber-500",
        textClass: "text-amber-500",
        checks,
      };
    }
    return {
      score: 3,
      label: "Fuerte / Segura",
      color: "bg-emerald-500",
      textClass: "text-emerald-500",
      checks,
    };
  };

  const loadAdmins = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await adminService.listarTodos();
      setAdmins(data);
      if (showToast) {
        toast.success("Cuentas de administradores actualizadas", {
          description: "Lista de supervisores autorizados sincronizada.",
        });
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje ||
          "No se pudieron cargar los administradores"
      );
    } finally {
      setLoading(false);
      if (showToast) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const filteredAdmins = admins.filter((adm) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      adm.nombre.toLowerCase().includes(q) ||
      (adm.usuario && adm.usuario.toLowerCase().includes(q)) ||
      adm.email.toLowerCase().includes(q) ||
      adm.id.toLowerCase().includes(q);

    const matchesRole =
      selectedRole === "ALL" || adm.rol === selectedRole;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVO" && (adm.activo ?? true)) ||
      (statusFilter === "INACTIVO" && !(adm.activo ?? true));

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / itemsPerPage));
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setUsername("");
    setNombre("");
    setEmail("");
    setConfirmEmail("");
    setPassword("");
    setConfirmPassword("");
    setRol("ADMIN_ACCESOS");
    setErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (adm: AdminUser) => {
    setEditingAdmin(adm);
    setUsername(adm.usuario || "");
    setNombre(adm.nombre);
    setEmail(adm.email);
    setConfirmEmail(adm.email);
    setPassword("");
    setConfirmPassword("");
    setRol(adm.rol);
    setErrors({});
    setFormOpen(true);
  };

  const validateForm = (): boolean => {
    const errs: AdminErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const userRegex = /^[a-zA-Z0-9._-]+$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

    // Username
    if (!usuario.trim()) {
      errs.usuario = "El nombre de usuario es obligatorio.";
    } else if (usuario.trim().length < 3 || usuario.trim().length > 30) {
      errs.usuario = "El usuario debe tener entre 3 y 30 caracteres alfanuméricos.";
    } else if (!userRegex.test(usuario.trim())) {
      errs.usuario = "El usuario solo puede contener letras, números, puntos y guiones.";
    }

    // Nombre
    if (!nombre.trim()) {
      errs.nombre = "El nombre completo es obligatorio.";
    } else if (nombre.trim().length < 3 || nombre.trim().length > 60) {
      errs.nombre = "El nombre debe tener entre 3 y 60 caracteres.";
    } else if (!nameRegex.test(nombre.trim())) {
      errs.nombre = "El nombre solo debe contener letras y espacios.";
    }

    // Email
    if (!email.trim()) {
      errs.email = "El correo electrónico es obligatorio.";
    } else if (email.trim().length > 80) {
      errs.email = "El correo no puede exceder 80 caracteres.";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Ingrese un correo corporativo válido (ej. usuario@pharma911.com).";
    }

    // Confirm Email
    if (!confirmEmail.trim()) {
      errs.confirmEmail = "La confirmación de correo es obligatoria.";
    } else if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      errs.confirmEmail = "Los correos electrónicos no coinciden.";
    }

    // Password Validation
    const needsPasswordCheck = !editingAdmin || password.length > 0;
    if (needsPasswordCheck) {
      if (!password) {
        errs.password = "La contraseña es obligatoria.";
      } else if (password.length < 8) {
        errs.password = "La contraseña debe tener al menos 8 caracteres.";
      } else if (password.length > 40) {
        errs.password = "La contraseña no puede exceder 40 caracteres.";
      } else if (!/[A-Z]/.test(password)) {
        errs.password = "Debe incluir al menos una letra mayúscula.";
      } else if (!/[a-z]/.test(password)) {
        errs.password = "Debe incluir al menos una letra minúscula.";
      } else if (!/\d/.test(password)) {
        errs.password = "Debe incluir al menos un número (0-9).";
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        errs.password = "Debe incluir al menos un carácter especial (!@#$%...).";
      }

      // Confirm Password
      if (!confirmPassword) {
        errs.confirmPassword = "Debe confirmar la contraseña.";
      } else if (password !== confirmPassword) {
        errs.confirmPassword = "Las contraseñas no coinciden.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      if (editingAdmin) {
        await adminService.actualizar(editingAdmin.id, {
          usuario: usuario.trim(),
          nombre: nombre.trim(),
          email: email.trim(),
          rol,
        });
        toast.success("Administrador actualizado", {
          description: `Se guardaron los privilegios para ${nombre}.`,
        });
      } else {
        await adminService.crear({
          usuario: usuario.trim(),
          nombre: nombre.trim(),
          email: email.trim(),
          password,
          rol,
          activo: true,
        });
        toast.success("Nuevo administrador registrado", {
          description: `Cuenta creada exitosamente para ${nombre}.`,
        });
      }
      setFormOpen(false);
      loadAdmins();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje ||
          "Error al procesar la cuenta de administrador"
      );
    } finally {
      setSaving(false);
    }
  };

  /** Inhabilitación lógica (DELETE /administradores/{id}); el backend la restringe a SUPER_ADMIN. */
  const handleInhabilitarAdmin = async () => {
    const adm = confirmDialog.admin;
    if (!adm) return;

    const isSelf =
      adm.usuario === currentUser?.usuario ||
      adm.id === currentUser?.id;

    if (isSelf) {
      toast.error("Operación bloqueada", {
        description: "No puede inhabilitar su propia cuenta mientras tiene sesión activa.",
      });
      setConfirmDialog({ isOpen: false, admin: null });
      return;
    }

    try {
      await adminService.inhabilitar(adm.dbId ?? adm.id);
      setConfirmDialog({ isOpen: false, admin: null });
      toast.success("Administrador inhabilitado", {
        description: `La cuenta de ${adm.nombre} quedó inactiva; sus registros de auditoría se conservan.`,
      });
      loadAdmins();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje ||
          "No se pudo inhabilitar el administrador."
      );
    }
  };

  useEffect(() => {
    if (!formOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setFormOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formOpen]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-card p-5 rounded-lg border border-border shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-foreground">Administración de Cuentas y Roles</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {admins.length} supervisores autorizados · {admins.filter((a) => a.activo ?? true).length} con credenciales activas bajo ISO 27001.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {puedeGestionar && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Nuevo Administrador</span>
            </button>
          )}
          <button
            onClick={() => loadAdmins(true)}
            disabled={refreshing}
            className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            title="Actualizar lista"
            aria-label="Actualizar administradores"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-primary" : ""} />
          </button>
        </div>
      </div>

      {/* Main Table Card with Search and Filters */}
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
                placeholder="Buscar por usuario, nombre o correo..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filter by Role */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">Todos los roles</option>
              <option value="SUPER_ADMIN">Super Administrador</option>
              <option value="ADMIN_ACCESOS">Administrador de Accesos</option>
              <option value="ADMIN_SISTEMAS">Administrador de Sistemas</option>
            </select>

            {/* Filter by Status */}
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

          {(search || selectedRole !== "ALL" || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedRole("ALL");
                setStatusFilter("ALL");
                setCurrentPage(1);
              }}
              className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Table of Admins */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 font-mono text-[11px] uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold">USUARIO</th>
                <th className="px-6 py-3 font-semibold">NOMBRE COMPLETO</th>
                <th className="px-6 py-3 font-semibold">CORREO CORPORATIVO</th>
                <th className="px-6 py-3 font-semibold">ROL ASIGNADO</th>
                <th className="px-6 py-3 font-semibold">ESTADO</th>
                <th className="px-6 py-3 font-semibold text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <UserMinus size={28} className="text-muted-foreground/50" />
                      <p className="font-semibold text-foreground">No se encontraron administradores</p>
                      <p className="text-[11px]">Intenta ajustar los términos de búsqueda o los filtros seleccionados.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAdmins.map((adm) => {
                  const isSelf =
                    adm.usuario === currentUser?.usuario ||
                    adm.id === currentUser?.id ||
                    (currentUser?.rol === "SUPER_ADMIN" && adm.rol === "SUPER_ADMIN");

                  return (
                    <tr key={adm.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 font-mono font-semibold text-primary">
                        {adm.usuario}
                        {isSelf && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-sans font-semibold">
                            Tú
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 font-medium text-foreground">{adm.nombre}</td>
                      <td className="px-6 py-3 text-muted-foreground">{adm.email}</td>
                      <td className="px-6 py-3">
                        <RoleBadge role={adm.rol} />
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            adm.activo
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
                          }`}
                        >
                          {adm.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {puedeGestionar && (
                            <button
                              onClick={() => handleOpenEdit(adm)}
                              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title="Editar permisos"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          {esSuperAdmin && (
                            <button
                              disabled={isSelf}
                              onClick={() => !isSelf && setConfirmDialog({ isOpen: true, admin: adm })}
                              className={`p-1.5 rounded-md transition-colors ${
                                isSelf
                                  ? "text-muted-foreground/30 cursor-not-allowed"
                                  : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
                              }`}
                              title={
                                isSelf
                                  ? "No puede inhabilitar su propia cuenta"
                                  : "Inhabilitar cuenta (borrado lógico)"
                              }
                            >
                              <PowerOff size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAdmins.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          itemName="administradores"
        />
      </div>

      {/* Create / Edit Admin Slide-over Drawer */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setFormOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-card text-card-foreground shadow-2xl h-full flex flex-col border-l border-border z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldAlert size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    {editingAdmin ? "Modificar Administrador" : "Registrar Administrador"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground">Privilegios y Roles BPF</p>
                </div>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="p-6 space-y-4 text-xs">
              {/* Usuario */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Nombre de Usuario <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  placeholder="Ej. j.reyes"
                  value={usuario}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.usuario) setErrors({ ...errors, usuario: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 ${
                    errors.usuario ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.usuario && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.usuario}</span>
                  </p>
                )}
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Nombre Completo <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  maxLength={60}
                  placeholder="Ej. Dr. Jorge Reyes Montoya"
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

              {/* Correo Electrónico */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Correo Electrónico <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  maxLength={80}
                  placeholder="Ej. j.reyes@pharma911.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                    errors.email ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.email && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Confirmar Correo Electrónico */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Confirmar Correo Electrónico <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  maxLength={80}
                  placeholder="Reingrese el correo para confirmar"
                  value={confirmEmail}
                  onChange={(e) => {
                    setConfirmEmail(e.target.value);
                    if (errors.confirmEmail) setErrors({ ...errors, confirmEmail: undefined });
                  }}
                  className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                    errors.confirmEmail ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                  }`}
                />
                {errors.confirmEmail && (
                  <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>{errors.confirmEmail}</span>
                  </p>
                )}
              </div>

              {/* Contraseña & Confirmación (Para nuevo o si se desea cambiar) */}
              {(!editingAdmin || true) && (
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-foreground">
                        {editingAdmin ? "Nueva Contraseña (Opcional)" : "Contraseña Inicial"}{" "}
                        {!editingAdmin && <span className="text-destructive">*</span>}
                      </label>
                      {password && (
                        <span className={`text-[10px] font-mono font-bold ${getPasswordStrength(password).textClass}`}>
                          {getPasswordStrength(password).label}
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      maxLength={40}
                      placeholder={editingAdmin ? "Dejar en blanco para mantener la actual" : "Mínimo 8 caracteres"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                        errors.password ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        <span>{errors.password}</span>
                      </p>
                    )}

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-2 space-y-1.5 p-2.5 rounded-md bg-muted/40 border border-border/60">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-1.5 flex-1 rounded-full transition-colors ${getPasswordStrength(password).score >= 1 ? getPasswordStrength(password).color : "bg-muted"}`} />
                          <div className={`h-1.5 flex-1 rounded-full transition-colors ${getPasswordStrength(password).score >= 2 ? getPasswordStrength(password).color : "bg-muted"}`} />
                          <div className={`h-1.5 flex-1 rounded-full transition-colors ${getPasswordStrength(password).score >= 3 ? getPasswordStrength(password).color : "bg-muted"}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground pt-1">
                          <span className={`flex items-center gap-1 ${getPasswordStrength(password).checks.length ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                            <Check size={10} className={getPasswordStrength(password).checks.length ? "opacity-100" : "opacity-30"} />
                            Mín. 8 caracteres
                          </span>
                          <span className={`flex items-center gap-1 ${getPasswordStrength(password).checks.upper && getPasswordStrength(password).checks.lower ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                            <Check size={10} className={getPasswordStrength(password).checks.upper && getPasswordStrength(password).checks.lower ? "opacity-100" : "opacity-30"} />
                            Mayús. y minúscula
                          </span>
                          <span className={`flex items-center gap-1 ${getPasswordStrength(password).checks.number ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                            <Check size={10} className={getPasswordStrength(password).checks.number ? "opacity-100" : "opacity-30"} />
                            Al menos 1 número
                          </span>
                          <span className={`flex items-center gap-1 ${getPasswordStrength(password).checks.special ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                            <Check size={10} className={getPasswordStrength(password).checks.special ? "opacity-100" : "opacity-30"} />
                            Símbolo especial (!@#$)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  {(!editingAdmin || password.length > 0) && (
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Confirmar Contraseña <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="password"
                        maxLength={40}
                        placeholder="Reingrese la contraseña para validar"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                          errors.confirmPassword ? "border-destructive ring-1 ring-destructive" : "border-border focus:ring-primary"
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{errors.confirmPassword}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Rol Asignado */}
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Rol y Nivel de Autorización <span className="text-destructive">*</span>
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  <option value="SUPER_ADMIN">Super Administrador (Acceso Total & Gestión de Usuarios)</option>
                  <option value="ADMIN_ACCESOS">Administrador de Accesos (Control de Personal & Zonas)</option>
                  <option value="ADMIN_SISTEMAS">Administrador de Sistemas (Auditoría & Parámetros)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAdmin}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Guardando..." : editingAdmin ? "Guardar Cambios" : "Crear Administrador"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Inhabilitar Modal (borrado lógico, solo SUPER_ADMIN) */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="¿Inhabilitar cuenta de administrador?"
        description={`La cuenta de ${confirmDialog.admin?.nombre} (${confirmDialog.admin?.usuario}) quedará inactiva y no podrá iniciar sesión. No se borra ningún dato: la cuenta y sus registros de auditoría se conservan conforme a la norma ISO 27001.`}
        confirmLabel="Inhabilitar Cuenta"
        isDestructive
        onConfirm={handleInhabilitarAdmin}
        onCancel={() => setConfirmDialog({ isOpen: false, admin: null })}
      />
    </div>
  );
}
