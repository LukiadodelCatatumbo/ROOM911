import { useState, useEffect } from "react";
import { X, User, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { empleadoService } from "../services/empleadoService";
import { departamentoService } from "../services/departamentoService";
import { Employee, Department } from "../types";
import { toast } from "sonner";

interface EmpleadoFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSuccess?: () => void;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  email?: string;
  departamento?: string;
  cargo?: string;
}

export default function EmpleadoFormDrawer({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: EmpleadoFormDrawerProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState("");
  const [permisoAcceso, setPermisoAcceso] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await departamentoService.listarTodos();
        setDepartments(data);
        if (data.length > 0 && !departamento) {
          setDepartamento(data[0].nombre);
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data?.mensaje || "No se pudieron cargar los departamentos"
        );
      }
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    if (employee) {
      setNombre(employee.nombre || "");
      setApellido(employee.apellido || "");
      setCedula(employee.cedula || "");
      setEmail(employee.email || "");
      setDepartamento(employee.departamento || "");
      setCargo(employee.cargo || "");
      setPermisoAcceso(employee.permisoAcceso ?? true);
    } else {
      setNombre("");
      setApellido("");
      setCedula("");
      setEmail("");
      setDepartamento(departments[0]?.nombre || "");
      setCargo("");
      setPermisoAcceso(true);
    }
    setErrors({});
  }, [employee, isOpen, departments]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    const numberRegex = /^\d+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Nombre
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    } else if (nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres.";
    } else if (nombre.trim().length > 50) {
      newErrors.nombre = "El nombre no puede exceder 50 caracteres.";
    } else if (!nameRegex.test(nombre.trim())) {
      newErrors.nombre = "El nombre solo debe contener letras y espacios.";
    }

    // Apellido
    if (!apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio.";
    } else if (apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres.";
    } else if (apellido.trim().length > 50) {
      newErrors.apellido = "El apellido no puede exceder 50 caracteres.";
    } else if (!nameRegex.test(apellido.trim())) {
      newErrors.apellido = "El apellido solo debe contener letras y espacios.";
    }

    // Cédula / Documento
    if (!cedula.trim()) {
      newErrors.cedula = "El número de cédula/documento es obligatorio.";
    } else if (!numberRegex.test(cedula.trim())) {
      newErrors.cedula = "La cédula solo debe contener números (sin puntos ni guiones).";
    } else if (cedula.trim().length !== 10) {
      newErrors.cedula = "La cédula colombiana debe tener exactamente 10 dígitos.";
    }

    // Email
    if (email.trim()) {
      if (email.trim().length > 80) {
        newErrors.email = "El correo no puede exceder 80 caracteres.";
      } else if (!emailRegex.test(email.trim())) {
        newErrors.email = "Ingrese un correo corporativo válido (ej. usuario@pharma911.com).";
      }
    }

    // Departamento
    if (!departamento.trim()) {
      newErrors.departamento = "Debe seleccionar un departamento válido.";
    }

    // Cargo
    if (!cargo.trim()) {
      newErrors.cargo = "El cargo u ocupación es obligatorio.";
    } else if (cargo.trim().length < 2) {
      newErrors.cargo = "El cargo debe tener al menos 2 caracteres.";
    } else if (cargo.trim().length > 50) {
      newErrors.cargo = "El cargo no puede exceder 50 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Formulario con errores", {
        description: "Corrija los campos indicados antes de continuar.",
      });
      return;
    }

    setLoading(true);
    try {
      const deptoSeleccionado = departments.find((d) => d.nombre === departamento);
      const datos = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        cedula: cedula.trim(),
        email: email.trim(),
        departamento,
        departamentoId: deptoSeleccionado ? Number(deptoSeleccionado.id) : undefined,
        cargo: cargo.trim(),
        permisoAcceso,
      };
      if (employee) {
        await empleadoService.actualizar(employee.dbId ?? employee.id, datos);
        toast.success("Ficha actualizada correctamente", {
          description: `Se guardaron los cambios para ${nombre} ${apellido}.`,
        });
      } else {
        await empleadoService.crear(datos);
        toast.success("Empleado registrado exitosamente", {
          description: `Se emitió el código de acceso y credencial para ${nombre} ${apellido}.`,
        });
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.mensaje || "Error al procesar la solicitud"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-150 ease-out animate-in fade-in motion-reduce:animate-none"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Right Panel */}
      <div className="relative w-full max-w-md bg-card text-card-foreground shadow-2xl h-full flex flex-col border-l border-border z-10 transform-gpu will-change-transform animate-in slide-in-from-right duration-150 ease-out motion-reduce:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <h2 id="drawer-title" className="text-sm font-bold text-foreground">
                {employee ? "Editar Ficha de Personal" : "Registrar Nuevo Empleado"}
              </h2>
              <p className="text-[11px] text-muted-foreground">Control de Acreditación BPF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            aria-label="Cerrar formulario"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Nombres */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Nombres <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              maxLength={50}
              placeholder="Ej. María Elena"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errors.nombre) setErrors({ ...errors, nombre: undefined });
              }}
              className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                errors.nombre
                  ? "border-destructive ring-1 ring-destructive"
                  : "border-border focus:ring-primary"
              }`}
            />
            {errors.nombre && (
              <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.nombre}</span>
              </p>
            )}
          </div>

          {/* Apellidos */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Apellidos <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              maxLength={50}
              placeholder="Ej. García Rodríguez"
              value={apellido}
              onChange={(e) => {
                setApellido(e.target.value);
                if (errors.apellido) setErrors({ ...errors, apellido: undefined });
              }}
              className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                errors.apellido
                  ? "border-destructive ring-1 ring-destructive"
                  : "border-border focus:ring-primary"
              }`}
            />
            {errors.apellido && (
              <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.apellido}</span>
              </p>
            )}
          </div>

          {/* Cédula */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Cédula / Documento de Identidad <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="10 dígitos, ej. 1020304050"
              value={cedula}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                setCedula(val);
                if (errors.cedula) setErrors({ ...errors, cedula: undefined });
              }}
              className={`w-full px-3 py-2 bg-background border rounded-md text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 ${
                errors.cedula
                  ? "border-destructive ring-1 ring-destructive"
                  : "border-border focus:ring-primary"
              }`}
            />
            {errors.cedula && (
              <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.cedula}</span>
              </p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Correo Corporativo
            </label>
            <input
              type="email"
              maxLength={80}
              placeholder="Ej. maria.garcia@pharma911.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                errors.email
                  ? "border-destructive ring-1 ring-destructive"
                  : "border-border focus:ring-primary"
              }`}
            />
            {errors.email && (
              <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Departamento */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Departamento Asignado <span className="text-destructive">*</span>
            </label>
            <select
              value={departamento}
              onChange={(e) => {
                setDepartamento(e.target.value);
                if (errors.departamento) setErrors({ ...errors, departamento: undefined });
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.nombre}>
                  {dept.nombre} (Riesgo: {dept.nivelRestriccion})
                </option>
              ))}
            </select>
          </div>

          {/* Cargo */}
          <div>
            <label className="block font-semibold text-foreground mb-1">
              Cargo / Ocupación <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              maxLength={50}
              placeholder="Ej. Jefa de Línea Estéril"
              value={cargo}
              onChange={(e) => {
                setCargo(e.target.value);
                if (errors.cargo) setErrors({ ...errors, cargo: undefined });
              }}
              className={`w-full px-3 py-2 bg-background border rounded-md text-xs text-foreground focus:outline-hidden focus:ring-1 ${
                errors.cargo
                  ? "border-destructive ring-1 ring-destructive"
                  : "border-border focus:ring-primary"
              }`}
            />
            {errors.cargo && (
              <p className="text-destructive text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>{errors.cargo}</span>
              </p>
            )}
          </div>

          {/* Permiso de Acceso Toggle */}
          <div className="pt-2">
            <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 cursor-pointer">
              <div>
                <span className="font-semibold text-foreground block">Permiso de Acceso Activo</span>
                <span className="text-[11px] text-muted-foreground">
                  Habilita la validación en torniquetes y lectores QR.
                </span>
              </div>
              <input
                type="checkbox"
                checked={permisoAcceso}
                onChange={(e) => setPermisoAcceso(e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-border hover:bg-muted text-foreground text-xs font-medium rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Guardando..." : employee ? "Guardar Cambios" : "Crear Registro"}
          </button>
        </div>
      </div>
    </div>
  );
}
