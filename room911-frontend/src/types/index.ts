export type AccessResult = "CONCEDIDO" | "DENEGADO" | "ERROR" | "ERROR_SENSOR";

export type AdminRole = "SUPER_ADMIN" | "ADMIN_ACCESOS" | "ADMIN_SISTEMAS";

export type RestrictionLevel = "BAJA" | "MEDIA" | "ALTA" | "CRITICA" | "CRITICA_ESTERIL";

export interface Employee {
  id: string;
  dbId?: number;
  nombre: string;
  apellido: string;
  cedula?: string;
  documentoIdentidad?: string;
  departamento: string;
  departamentoId?: number;
  cargo: string;
  email?: string;
  acceso?: boolean;
  permisoAcceso?: boolean;
  activo?: boolean;
  fechaIngreso?: string;
  fechaRegistro?: string;
  codigoQr?: string;
  telefono?: string;
}

export interface AccessEntry {
  id: string;
  dbId?: number;
  fecha?: string;
  hora?: string;
  timestamp?: string;
  puerta: string;
  resultado: AccessResult;
  motivo?: string;
  empleadoId?: string;
  empleadoNombre?: string;
  departamento?: string;
}

export interface Department {
  id: number | string;
  codigo?: string;
  nombre: string;
  descripcion?: string;
  responsable?: string;
  nivelRestriccion: RestrictionLevel;
  totalEmpleados?: number;
  empleadosCount?: number;
  capacidadMaxima?: number;
  color?: string;
  activo?: boolean;
}

export interface AdminUser {
  id: string;
  dbId?: number;
  username?: string;
  nombre: string;
  email: string;
  rol: AdminRole;
  ultimoAcceso?: string;
  activo?: boolean;
}

export interface AccessEvent {
  id: string;
  hora: string;
  fecha?: string;
  empleadoId: string;
  empleadoNombre: string;
  puerta: string;
  resultado: AccessResult;
  motivo: string;
}

export interface DashboardStats {
  kpis: {
    totalEmpleados: number;
    empleadosActivos: number;
    accesosHoy: number;
    intentosFallidosHoy: number;
    fallasSensor: number;
    aforoActual: number;
  };
  accesosPorDia: { dia: string; concedidos: number; denegados: number }[];
  departamentosData: { name: string; value: number; percentage: number; color: string }[];
  ultimosAccesos: AccessEvent[];
}
