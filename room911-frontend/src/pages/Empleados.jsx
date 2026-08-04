import { useEffect, useState } from "react";
import EmpleadoForm from "../components/EmpleadoForm";
import EmpleadoDetalle from "../components/EmpleadoDetalle";
import EmpleadoCsvImport from "../components/EmpleadoCsvImport";
import EmpleadoRegistroConfirmacion from "../components/EmpleadoRegistroConfirmacion";
import EmpleadoQrExportModal from "../components/EmpleadoQrExportModal";
import api from "../services/api";
import "../styles/Empleados.css";

import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaEye,
    FaFileImport,
    FaQrcode
} from "react-icons/fa";

function Empleados() {

    const [empleados, setEmpleados] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [tipoBusqueda, setTipoBusqueda] = useState("nombre");
    const [departamentoFiltro, setDepartamentoFiltro] = useState("");

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [mostrarImportador, setMostrarImportador] = useState(false);
    const [mostrarConfirmacionRegistro, setMostrarConfirmacionRegistro] = useState(false);
    const [mostrarExportarQr, setMostrarExportarQr] = useState(false);

    const [empleadoEditar, setEmpleadoEditar] = useState(null);
    const [empleadoDetalle, setEmpleadoDetalle] = useState(null);
    const [empleadoRegistrado, setEmpleadoRegistrado] = useState(null);
    const [empleadoQrSeleccionado, setEmpleadoQrSeleccionado] = useState(null);

    useEffect(() => {
        obtenerEmpleados();
        obtenerDepartamentos();
    }, []);

    const obtenerEmpleados = async () => {

        try {

            const response = await api.get("/empleados");

            setEmpleados(response.data);

        } catch (error) {

            console.error("Error al obtener empleados", error);

        }

    };

    const eliminarEmpleado = async (id) => {

        const confirmar = window.confirm(
            "¿Desea eliminar este empleado?"
        );

        if (!confirmar) return;

        try {

            await api.delete(`/empleados/${id}`);

            alert("Empleado eliminado correctamente");

            obtenerEmpleados();

        } catch (error) {

            console.error(error);

            alert("Error al eliminar empleado");

        }

    };

    const obtenerDepartamentos = async () => {

        try {

            const response = await api.get("/departamentos");

            setDepartamentos(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const buscarEmpleados = async () => {

        try {

            if (departamentoFiltro !== "") {

                const response = await api.get(
                    `/empleados/departamento/${departamentoFiltro}`
                );

                setEmpleados(response.data);

                return;
            }

            if (busqueda.trim() === "") {

                obtenerEmpleados();

                return;
            }

            const endpoint =
                tipoBusqueda === "nombre"
                    ? `/empleados/nombre/${busqueda}`
                    : `/empleados/apellido/${busqueda}`;

            const response = await api.get(endpoint);

            setEmpleados(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const limpiarBusqueda = () => {

        setBusqueda("");

        setDepartamentoFiltro("");

        setTipoBusqueda("nombre");

        obtenerEmpleados();

    };

    const obtenerNombreDepartamento = (departamentoId) => {
        const departamento = departamentos.find(
            (dep) => Number(dep.id) === Number(departamentoId)
        );

        return departamento?.nombre || "--";
    };

    return (

        <div className="empleados-container">

            <div className="header">

                <h1>Empleados</h1>

                <div className="header-actions">
                    <button
                        className="btn-secondary"
                        aria-label="Importar empleados en CSV"
                        onClick={() => setMostrarImportador(true)}
                    >
                        <FaFileImport />
                        <span>Importar CSV</span>
                    </button>

                    <button
                        className="btn-primary"
                        aria-label="Registrar un nuevo empleado"
                        onClick={() => {

                            setEmpleadoEditar(null);

                            setMostrarDetalle(false);
                            setEmpleadoDetalle(null);

                            setMostrarFormulario(true);

                        }}
                    >
                        <FaPlus />
                        <span>Nuevo Empleado</span>
                    </button>
                </div>

            </div>

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Buscar..."
                    aria-label="Buscar empleado"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <select
                    aria-label="Tipo de búsqueda"
                    value={tipoBusqueda}
                    onChange={(e) => setTipoBusqueda(e.target.value)}
                >
                    <option value="nombre">
                        Nombre
                    </option>

                    <option value="apellido">
                        Apellido
                    </option>
                </select>

                <select
                    aria-label="Filtrar por departamento"
                    value={departamentoFiltro}
                    onChange={(e) => setDepartamentoFiltro(e.target.value)}
                >

                    <option value="">
                        Todos los departamentos
                    </option>

                    {departamentos.map(dep => (

                        <option
                            key={dep.id}
                            value={dep.id}
                        >
                            {dep.nombre}
                        </option>

                    ))}

                </select>

                <button
                    className="btn-primary"
                    aria-label="Buscar empleado"
                    onClick={buscarEmpleados}
                >
                    Buscar
                </button>

                <button
                    className="btn-secondary"
                    aria-label="Limpiar búsqueda"
                    onClick={limpiarBusqueda}
                >
                    Limpiar
                </button>

            </div>

            {mostrarFormulario && (

                <div className="modal-overlay">

                    <EmpleadoForm
                        empleado={empleadoEditar}
                        onEmpleadoCreado={(empleadoCreado, meta) => {

                            obtenerEmpleados();

                            setMostrarFormulario(false);
                            setEmpleadoEditar(null);

                            if (meta?.esNuevo) {
                                const base = empleadoCreado || meta.datosFormulario;
                                const departamentoNombre = base.nombreDepartamento
                                    || obtenerNombreDepartamento(base.departamentoId);

                                setEmpleadoRegistrado({
                                    ...base,
                                    nombreDepartamento: departamentoNombre
                                });

                                setMostrarConfirmacionRegistro(true);
                            }

                        }}
                        onCerrar={() => {

                            setMostrarFormulario(false);
                            setEmpleadoEditar(null);

                        }}
                    />

                </div>

            )}

            {mostrarImportador && (
                <EmpleadoCsvImport
                    departamentos={departamentos}
                    onCerrar={() => setMostrarImportador(false)}
                    onImportado={obtenerEmpleados}
                />
            )}

            {mostrarConfirmacionRegistro && empleadoRegistrado && (
                <EmpleadoRegistroConfirmacion
                    empleado={empleadoRegistrado}
                    onRegistrarOtro={() => {
                        setMostrarConfirmacionRegistro(false);
                        setEmpleadoRegistrado(null);
                        setEmpleadoEditar(null);
                        setMostrarFormulario(true);
                    }}
                    onVolverListado={() => {
                        setMostrarConfirmacionRegistro(false);
                        setEmpleadoRegistrado(null);
                    }}
                />
            )}

            {mostrarExportarQr && empleadoQrSeleccionado && (
                <EmpleadoQrExportModal
                    empleado={empleadoQrSeleccionado}
                    onCerrar={() => {
                        setMostrarExportarQr(false);
                        setEmpleadoQrSeleccionado(null);
                    }}
                />
            )}

            {mostrarDetalle && empleadoDetalle && (

                <div className="modal-overlay">

                    <EmpleadoDetalle
                        empleado={empleadoDetalle}
                        onCerrar={() => {

                            setMostrarDetalle(false);
                            setEmpleadoDetalle(null);

                        }}
                    />

                </div>

            )}

            <div className="tabla-responsive">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo</th>
                            <th>Cargo</th>
                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {empleados.map((empleado) => (

                            <tr key={empleado.id}>

                                <td>{empleado.id}</td>

                                <td>{empleado.nombre}</td>

                                <td>{empleado.apellido}</td>

                                <td>{empleado.correo}</td>

                                <td>{empleado.cargo}</td>

                                <td className="acciones">

                                    <button
                                        className="accion-ver"
                                        aria-label={`Ver información de ${empleado.nombre} ${empleado.apellido}`}
                                        title="Ver información"
                                        onClick={() => {

                                            setMostrarFormulario(false);
                                            setEmpleadoEditar(null);

                                            setEmpleadoDetalle(empleado);
                                            setMostrarDetalle(true);

                                        }}
                                    >
                                        <FaEye />
                                    </button>

                                    <button
                                        className="accion-editar"
                                        aria-label={`Editar empleado ${empleado.nombre} ${empleado.apellido}`}
                                        title="Editar"
                                        onClick={() => {

                                            setMostrarDetalle(false);
                                            setEmpleadoDetalle(null);

                                            setEmpleadoEditar(empleado);
                                            setMostrarFormulario(true);

                                        }}
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="accion-exportar"
                                        aria-label={`Exportar QR de ${empleado.nombre} ${empleado.apellido}`}
                                        title="Exportar QR"
                                        onClick={() => {
                                            setEmpleadoQrSeleccionado(empleado);
                                            setMostrarExportarQr(true);
                                        }}
                                    >
                                        <FaQrcode />
                                    </button>

                                    <button
                                        className="accion-eliminar"
                                        aria-label={`Eliminar empleado ${empleado.nombre} ${empleado.apellido}`}
                                        title="Eliminar"
                                        onClick={() =>
                                            eliminarEmpleado(empleado.id)
                                        }
                                    >
                                        <FaTrash />
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}
export default Empleados;