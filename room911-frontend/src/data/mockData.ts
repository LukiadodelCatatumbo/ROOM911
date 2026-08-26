import { Employee, AccessEntry, Department, AdminUser, DashboardSummary } from "../types";

export const MOCK_DEPARTAMENTOS: Department[] = [
  { id: 1, codigo: "PROD", nombre: "Producción", descripcion: "Líneas de síntesis y envasado farmacéutico", responsable: "Ing. Carlos Mendoza", nivelRestriccion: "ALTA", totalEmpleados: 42, empleadosCount: 42, capacidadMaxima: 60, color: "#0B5FA5", activo: true },
  { id: 2, codigo: "QC", nombre: "Control de Calidad", descripcion: "Laboratorios de microbiología y validación QC", responsable: "Dra. Sofía Alarcón", nivelRestriccion: "CRITICA_ESTERIL", totalEmpleados: 18, empleadosCount: 18, capacidadMaxima: 25, color: "#1F8A47", activo: true },
  { id: 3, codigo: "I+D", nombre: "Investigación y Desarrollo", descripcion: "Desarrollo de nuevas fórmulas y bioequivalencia", responsable: "Dr. Roberto Silva", nivelRestriccion: "CRITICA_ESTERIL", totalEmpleados: 14, empleadosCount: 14, capacidadMaxima: 20, color: "#8B5CF6", activo: true },
  { id: 4, codigo: "ALM", nombre: "Almacén y Logística", descripcion: "Almacenamiento de materia prima y producto terminado", responsable: "Lic. Manuel Torres", nivelRestriccion: "MEDIA", totalEmpleados: 25, empleadosCount: 25, capacidadMaxima: 35, color: "#F59E0B", activo: true },
  { id: 5, codigo: "ADM", nombre: "Administración", descripcion: "Oficinas centrales y dirección corporativa", responsable: "Lic. Andrea Morales", nivelRestriccion: "BAJA", totalEmpleados: 12, empleadosCount: 12, capacidadMaxima: 30, color: "#64748B", activo: true },
  { id: 6, codigo: "RRHH", nombre: "Recursos Humanos", descripcion: "Gestión de talento, capacitación y seguridad laboral", responsable: "Lic. Laura Ramírez", nivelRestriccion: "BAJA", totalEmpleados: 8, empleadosCount: 8, capacidadMaxima: 15, color: "#EC4899", activo: true },
];

export const MOCK_EMPLEADOS: Employee[] = [
  { id: "EMP-0042", dbId: 1, nombre: "María", apellido: "García Rodríguez", departamento: "Producción", departamentoId: 1, cargo: "Jefa de Línea", email: "m.garcia@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2019-03-15", codigoQr: "EMP-0042", documentoIdentidad: "10984523" },
  { id: "EMP-0081", dbId: 2, nombre: "Carlos", apellido: "Hernández López", departamento: "Control de Calidad", departamentoId: 2, cargo: "Analista QC", email: "c.hernandez@pharma911.com", acceso: false, permisoAcceso: false, activo: false, fechaIngreso: "2020-07-22", codigoQr: "EMP-0081", documentoIdentidad: "88234190" },
  { id: "EMP-0103", dbId: 3, nombre: "Ana", apellido: "Martínez Torres", departamento: "Investigación y Desarrollo", departamentoId: 3, cargo: "Investigadora Senior", email: "a.martinez@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2018-01-08", codigoQr: "EMP-0103", documentoIdentidad: "77412093" },
  { id: "EMP-0156", dbId: 4, nombre: "Luis", apellido: "Sánchez Morales", departamento: "Almacén y Logística", departamentoId: 4, cargo: "Operario de Almacén", email: "l.sanchez@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2021-11-03", codigoQr: "EMP-0156", documentoIdentidad: "55123984" },
  { id: "EMP-0199", dbId: 5, nombre: "Sofía", apellido: "Jiménez Castro", departamento: "Producción", departamentoId: 1, cargo: "Técnica de Producción", email: "s.jimenez@pharma911.com", acceso: false, permisoAcceso: false, activo: false, fechaIngreso: "2022-04-18", codigoQr: "EMP-0199", documentoIdentidad: "60341829" },
  { id: "EMP-0214", dbId: 6, nombre: "Roberto", apellido: "Vega Romero", departamento: "Administración", departamentoId: 5, cargo: "Director Administrativo", email: "r.vega@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2017-06-01", codigoQr: "EMP-0214", documentoIdentidad: "92183401" },
  { id: "EMP-0267", dbId: 7, nombre: "Carmen", apellido: "López Ruiz", departamento: "Control de Calidad", departamentoId: 2, cargo: "Supervisora QC", email: "c.lopez@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2019-09-14", codigoQr: "EMP-0267", documentoIdentidad: "33894210" },
  { id: "EMP-0312", dbId: 8, nombre: "Miguel", apellido: "Torres Pérez", departamento: "Investigación y Desarrollo", departamentoId: 3, cargo: "Bioquímico", email: "m.torres@pharma911.com", acceso: false, permisoAcceso: false, activo: false, fechaIngreso: "2020-02-10", codigoQr: "EMP-0312", documentoIdentidad: "44912039" },
  { id: "EMP-0341", dbId: 9, nombre: "Laura", apellido: "Ramírez Díaz", departamento: "Recursos Humanos", departamentoId: 6, cargo: "Coordinadora RR.HH.", email: "l.ramirez@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2021-05-17", codigoQr: "EMP-0341", documentoIdentidad: "66723910" },
  { id: "EMP-0388", dbId: 10, nombre: "Pedro", apellido: "Gómez Vargas", departamento: "Producción", departamentoId: 1, cargo: "Técnico de Mantenimiento", email: "p.gomez@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2022-08-09", codigoQr: "EMP-0388", documentoIdentidad: "29481023" },
  { id: "EMP-0412", dbId: 11, nombre: "Elena", apellido: "Fuentes Castillo", departamento: "Almacén y Logística", departamentoId: 4, cargo: "Supervisora de Almacén", email: "e.fuentes@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2020-12-01", codigoQr: "EMP-0412", documentoIdentidad: "77291034" },
  { id: "EMP-0445", dbId: 12, nombre: "Diego", apellido: "Mendoza Silva", departamento: "Control de Calidad", departamentoId: 2, cargo: "Analista QC Junior", email: "d.mendoza@pharma911.com", acceso: false, permisoAcceso: false, activo: false, fechaIngreso: "2023-02-14", codigoQr: "EMP-0445", documentoIdentidad: "88392019" },
  { id: "EMP-0489", dbId: 13, nombre: "Valentina", apellido: "Reyes Ortega", departamento: "Producción", departamentoId: 1, cargo: "Operaria de Línea", email: "v.reyes@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2023-06-20", codigoQr: "EMP-0489", documentoIdentidad: "99182304" },
  { id: "EMP-0521", dbId: 14, nombre: "Fernando", apellido: "Castro Vidal", departamento: "Investigación y Desarrollo", departamentoId: 3, cargo: "Químico Farmacéutico", email: "f.castro@pharma911.com", acceso: true, permisoAcceso: true, activo: true, fechaIngreso: "2019-11-05", codigoQr: "EMP-0521", documentoIdentidad: "12349081" },
];

export const MOCK_HISTORIAL: AccessEntry[] = [
  { id: "ACC-20240115-0891", timestamp: "2024-01-15 08:32:14", puerta: "Sala de Producción A", resultado: "CONCEDIDO", empleadoId: "EMP-0042", empleadoNombre: "María García Rodríguez", departamento: "Producción" },
  { id: "ACC-20240115-0924", timestamp: "2024-01-15 10:15:07", puerta: "Laboratorio B-2 (I+D)", resultado: "DENEGADO", motivo: "Sin autorización para área estéril", empleadoId: "EMP-0081", empleadoNombre: "Carlos Hernández López", departamento: "Control de Calidad" },
  { id: "ACC-20240115-1047", timestamp: "2024-01-15 12:45:33", puerta: "Almacén Principal", resultado: "CONCEDIDO", empleadoId: "EMP-0156", empleadoNombre: "Luis Sánchez Morales", departamento: "Almacén y Logística" },
  { id: "ACC-20240115-1203", timestamp: "2024-01-15 14:21:08", puerta: "Sala de Producción A", resultado: "CONCEDIDO", empleadoId: "EMP-0042", empleadoNombre: "María García Rodríguez", departamento: "Producción" },
  { id: "ACC-20240115-1389", timestamp: "2024-01-15 16:05:44", puerta: "Área de Vestuarios y Esclusa", resultado: "CONCEDIDO", empleadoId: "EMP-0489", empleadoNombre: "Valentina Reyes Ortega", departamento: "Producción" },
  { id: "ACC-20240114-0712", timestamp: "2024-01-14 09:15:22", puerta: "Sala de Producción A", resultado: "CONCEDIDO", empleadoId: "EMP-0388", empleadoNombre: "Pedro Gómez Vargas", departamento: "Producción" },
  { id: "ACC-20240114-0834", timestamp: "2024-01-14 11:30:15", puerta: "Comedor / Cafetería", resultado: "CONCEDIDO", empleadoId: "EMP-0214", empleadoNombre: "Roberto Vega Romero", departamento: "Administración" },
  { id: "ACC-20240114-1156", timestamp: "2024-01-14 13:45:09", puerta: "Sala de Producción B", resultado: "ERROR", motivo: "Lector biométrico sin respuesta — reintento", empleadoId: "EMP-0199", empleadoNombre: "Sofía Jiménez Castro", departamento: "Producción" },
  { id: "ACC-20240113-0645", timestamp: "2024-01-13 08:01:37", puerta: "Laboratorio QC Químico", resultado: "CONCEDIDO", empleadoId: "EMP-0267", empleadoNombre: "Carmen López Ruiz", departamento: "Control de Calidad" },
  { id: "ACC-20240113-1278", timestamp: "2024-01-13 15:22:50", puerta: "Laboratorio B-2 (I+D)", resultado: "DENEGADO", motivo: "Acceso temporal expirado", empleadoId: "EMP-0312", empleadoNombre: "Miguel Torres Pérez", departamento: "Investigación y Desarrollo" },
  { id: "ACC-20240113-1402", timestamp: "2024-01-13 17:08:03", puerta: "Sala de Producción A", resultado: "CONCEDIDO", empleadoId: "EMP-0042", empleadoNombre: "María García Rodríguez", departamento: "Producción" },
];

export const MOCK_ADMINS: AdminUser[] = [
  { id: "ADM-001", username: "admin", nombre: "Dr. Jorge Reyes Montoya", email: "j.reyes@pharma911.com", rol: "SUPER_ADMIN", ultimoAcceso: "2024-01-15 09:14:22", activo: true },
  { id: "ADM-002", username: "p.fuentes", nombre: "Lic. Patricia Fuentes Cruz", email: "p.fuentes@pharma911.com", rol: "ADMIN_ACCESOS", ultimoAcceso: "2024-01-15 08:55:10", activo: true },
  { id: "ADM-003", username: "f.castro", nombre: "Ing. Fernando Castro Vidal", email: "f.castro@pharma911.com", rol: "ADMIN_SISTEMAS", ultimoAcceso: "2024-01-14 17:33:08", activo: true },
  { id: "ADM-004", username: "c.moreno", nombre: "Dra. Claudia Moreno Ríos", email: "c.moreno@pharma911.com", rol: "ADMIN_ACCESOS", ultimoAcceso: "2024-01-12 14:20:55", activo: true },
];

export const MOCK_DASHBOARD: DashboardSummary = {
  totalEmpleados: 119,
  empleadosConAcceso: 98,
  accesosHoy: 342,
  accesosConcedidosHoy: 318,
  accesosDenegadosHoy: 19,
  accesosErrorHoy: 5,
  aforoActualPlanta: 76,
  accesosPorSemana: [
    { dia: "Lun", concedidos: 320, denegados: 12, total: 332 },
    { dia: "Mar", concedidos: 345, denegados: 15, total: 360 },
    { dia: "Mié", concedidos: 380, denegados: 21, total: 401 },
    { dia: "Jue", concedidos: 365, denegados: 18, total: 383 },
    { dia: "Vie", concedidos: 410, denegados: 25, total: 435 },
    { dia: "Sáb", concedidos: 140, denegados: 4,  total: 144 },
    { dia: "Dom", concedidos: 85,  denegados: 2,  total: 87 },
  ],
  distribucionDepartamentos: [
    { nombre: "Producción", cantidad: 42, porcentaje: 35 },
    { nombre: "Almacén y Logística", cantidad: 25, porcentaje: 21 },
    { nombre: "Control de Calidad", cantidad: 18, porcentaje: 15 },
    { nombre: "I+D", cantidad: 14, porcentaje: 12 },
    { nombre: "Administración", cantidad: 12, porcentaje: 10 },
    { nombre: "RR.HH.", cantidad: 8, porcentaje: 7 },
  ],
  ultimosAccesos: MOCK_HISTORIAL.slice(0, 6),
};
