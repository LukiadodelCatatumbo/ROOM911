import { beforeEach, describe, expect, it, vi } from "vitest";

// Los services consumen la instancia axios central; en estos tests de humo
// se mockea para verificar el mapeo del contrato frontend <-> backend.
vi.mock("../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

import api from "../services/api";
import { accesoService } from "../services/accesoService";
import { dashboardService } from "../services/dashboardService";
import { empleadoService } from "../services/empleadoService";

const mockedApi = api as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("accesoService.listarHistorial (paginación de servidor)", () => {
  it("mapea PaginaResponseDTO y los campos del intento a AccessEntry", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        contenido: [
          {
            id: 7,
            fechaAcceso: "2026-09-29T09:15:30",
            exito: false,
            mensaje: "Fuera de horario",
            documento: "1020304050",
            empleadoId: 1,
            nombreEmpleado: "Carlos Mendoza",
            departamento: "Producción",
          },
        ],
        pagina: 0,
        tamano: 10,
        totalElementos: 123,
        totalPaginas: 13,
      },
    });

    const pagina = await accesoService.listarHistorial({ pagina: 0, tamano: 10 });

    expect(api.get).toHaveBeenCalledWith("/intento-acceso", {
      params: { pagina: 0, tamano: 10 },
    });
    expect(pagina.totalElementos).toBe(123);
    expect(pagina.totalPaginas).toBe(13);
    expect(pagina.contenido).toHaveLength(1);

    const entry = pagina.contenido[0];
    expect(entry.dbId).toBe(7);
    expect(entry.id).toBe("ACC-0007");
    expect(entry.fecha).toBe("2026-09-29");
    expect(entry.hora).toBe("09:15:30");
    expect(entry.resultado).toBe("DENEGADO");
    expect(entry.motivo).toBe("Fuera de horario");
    expect(entry.empleadoId).toBe("1020304050");
    expect(entry.departamento).toBe("Producción");
  });

  it("propaga los filtros (exito, fechas y texto) como query params", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: { contenido: [], pagina: 0, tamano: 50, totalElementos: 0, totalPaginas: 0 },
    });

    await accesoService.listarHistorial({
      pagina: 2,
      tamano: 50,
      exito: false,
      desde: "2026-09-28",
      hasta: "2026-09-29",
      texto: "mendoza",
    });

    expect(api.get).toHaveBeenCalledWith("/intento-acceso", {
      params: {
        pagina: 2,
        tamano: 50,
        exito: false,
        desde: "2026-09-28",
        hasta: "2026-09-29",
        texto: "mendoza",
      },
    });
  });
});

describe("accesoService.validarAcceso", () => {
  it("envía documento y puerta, y mapea la respuesta del backend", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: {
        permitido: true,
        resultado: "CONCEDIDO",
        mensaje: "Acceso permitido: Esclusa 1",
        nombreEmpleado: "Carlos Mendoza",
        documento: "1020304050",
        departamento: "Producción",
        puntoCodigo: "DOOR-PROD-01",
        puerta: "DOOR-PROD-01",
      },
    });

    const respuesta = await accesoService.validarAcceso("1020304050", "DOOR-PROD-01");

    expect(api.post).toHaveBeenCalledWith("/acceso", {
      documento: "1020304050",
      puerta: "DOOR-PROD-01",
    });
    expect(respuesta.permitido).toBe(true);
    expect(respuesta.resultado).toBe("CONCEDIDO");
    expect(respuesta.empleadoNombre).toBe("Carlos Mendoza");
    expect(respuesta.puntoCodigo).toBe("DOOR-PROD-01");
  });
});

describe("accesoService.listarPuntos (catálogo único)", () => {
  it("consume GET /acceso/puntos y devuelve el catálogo del backend", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [
        {
          codigo: "DOOR-PROD-01",
          nombre: "Esclusa 1: Sala de Producción A",
          ubicacion: "Nave Industrial - Planta Baja",
          nivelRestriccion: "ALTA",
          tipo: "ESCLUSA",
          zonaComun: false,
          departamento: "Producción",
          horaInicio: "06:00",
          horaFin: "14:30",
          nombreHorario: "Producción - turno mañana",
        },
      ],
    });

    const puntos = await accesoService.listarPuntos();

    expect(api.get).toHaveBeenCalledWith("/acceso/puntos");
    expect(puntos).toHaveLength(1);
    expect(puntos[0].codigo).toBe("DOOR-PROD-01");
    expect(puntos[0].departamento).toBe("Producción");
    expect(puntos[0].horaInicio).toBe("06:00");
  });
});

describe("empleadoService.listarTodos (contrato y fallback público)", () => {
  it("mapea EmpleadoResponseDTO: documento→id, correo→email, nombreDepartamento", async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          nombre: "Carlos",
          apellido: "Mendoza",
          documento: "1020304050",
          correo: "c.mendoza@pharma911.com",
          cargo: "Operador",
          departamentoId: 3,
          nombreDepartamento: "Producción",
          activo: true,
          accesoPermitido: true,
        },
      ],
    });

    const empleados = await empleadoService.listarTodos();

    expect(api.get).toHaveBeenCalledWith("/empleados");
    const e = empleados[0];
    expect(e.id).toBe("1020304050");
    expect(e.email).toBe("c.mendoza@pharma911.com");
    expect(e.departamento).toBe("Producción");
    expect(e.permisoAcceso).toBe(true);
  });

  it("ante 401 usa la vista pública /acceso/colaboradores sin documento ni correo", async () => {
    mockedApi.get.mockImplementationOnce(() =>
      Promise.reject({ response: { status: 401 } })
    );
    mockedApi.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          nombre: "Carlos",
          apellido: "Mendoza",
          departamento: "Producción",
          cargo: "Operador",
          accesoPermitido: true,
        },
      ],
    });

    const empleados = await empleadoService.listarTodos();

    expect(api.get).toHaveBeenNthCalledWith(1, "/empleados");
    expect(api.get).toHaveBeenNthCalledWith(2, "/acceso/colaboradores");
    expect(empleados[0].id).toBe("EMP-0001");
    expect(empleados[0].codigoQr).toBe("1");
    expect(empleados[0].email).toBeUndefined();
  });
});

describe("dashboardService.obtenerResumen", () => {
  it("mapea DashboardResumenDTO: enPlanta→aforoActual y el split de fecha/hora", async () => {
    mockedApi.get.mockImplementation((url: string) => {
      if (url === "/dashboard/resumen") {
        return Promise.resolve({
          data: {
            empleados: 8,
            empleadosConPermiso: 7,
            departamentos: 6,
            accesosHoy: 12,
            denegadosHoy: 3,
            enPlanta: 5,
          },
        });
      }
      if (url === "/dashboard/accesos-semana") {
        return Promise.resolve({
          data: [{ dia: "Mon", concedidos: 10, denegados: 2 }],
        });
      }
      if (url === "/dashboard/departamentos") {
        return Promise.resolve({
          data: [{ departamento: "Producción", cantidad: 4 }],
        });
      }
      return Promise.resolve({
        data: [
          {
            id: 9,
            fechaAcceso: "2026-09-29 08:05:11",
            exito: true,
            mensaje: "Acceso permitido",
            documento: "1020304050",
            empleadoId: 1,
            nombreEmpleado: "Carlos Mendoza",
            departamento: "Producción",
          },
        ],
      });
    });

    const stats = await dashboardService.obtenerResumen();

    expect(stats.kpis.totalEmpleados).toBe(8);
    expect(stats.kpis.empleadosActivos).toBe(7);
    expect(stats.kpis.aforoActual).toBe(5);
    expect(stats.kpis.intentosFallidosHoy).toBe(3);
    expect(stats.accesosPorDia[0]).toEqual({
      dia: "Mon",
      concedidos: 10,
      denegados: 2,
    });
    expect(stats.ultimosAccesos[0].fecha).toBe("2026-09-29");
    expect(stats.ultimosAccesos[0].hora).toBe("08:05:11");
    expect(stats.ultimosAccesos[0].resultado).toBe("CONCEDIDO");
  });
});
