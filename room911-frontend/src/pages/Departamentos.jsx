import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DepartamentoForm from "../components/DepartamentoForm";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import "../styles/Departamentos.css";

import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaUndoAlt,
    FaSearch,
    FaTimes
} from "react-icons/fa";

function Departamentos() {

    const [busqueda, setBusqueda] = useState("");

    const [departamentos, setDepartamentos] = useState([]);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [departamentoEditar, setDepartamentoEditar] = useState(null);

    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

    const [accionModal, setAccionModal] = useState("");

    useEffect(() => {

        obtenerDepartamentos();

    }, []);

    const obtenerDepartamentos = async () => {

        try {

            const response = await api.get("/departamentos");

            const ordenados = response.data.sort((a, b) => a.id - b.id);

            setDepartamentos(ordenados);

        } catch (error) {

            console.error("Error al obtener departamentos", error);

        }

    };

    const desactivarDepartamento = async (id) => {

        try {

            await api.delete(`/departamentos/${id}`);

            obtenerDepartamentos();

            alert("Departamento desactivado correctamente.");

        } catch (error) {

            console.error(error);

            alert("Error al desactivar el departamento.");

        }

    };

    const activarDepartamento = async (id) => {

        try {

            await api.patch(`/departamentos/${id}/activar`);

            obtenerDepartamentos();

            alert("Departamento reactivado correctamente.");

        } catch (error) {

            console.error(error);

            alert("Error al reactivar el departamento.");

        }

    };

    const departamentosFiltrados = departamentos.filter(dep =>
        dep.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (

        <>

            <Sidebar />

            <div className="departamentos-container">

                <div className="header">

                    <h1>Departamentos</h1>

                    <button
                        className="btn-primary"
                        onClick={() => {

                            setDepartamentoEditar(null);

                            setMostrarFormulario(true);

                        }}
                    >

                        <FaPlus />

                        Nuevo Departamento

                    </button>

                </div>

                <div className="search-box">

                    <input
                        type="text"
                        placeholder="Buscar departamento..."
                        aria-label="Buscar departamento"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />

                    <button
                        className="btn-primary"
                        aria-label="Buscar"
                    >

                        <FaSearch />

                    </button>

                    <button
                        className="btn-secondary"
                        aria-label="Limpiar búsqueda"
                        onClick={() => setBusqueda("")}
                    >

                        <FaTimes />

                    </button>

                </div>

                {mostrarFormulario && (

                    <div className="modal-overlay">

                        <DepartamentoForm

                            departamento={departamentoEditar}

                            onDepartamentoCreado={() => {

                                obtenerDepartamentos();

                                setMostrarFormulario(false);

                                setDepartamentoEditar(null);

                            }}

                            onCerrar={() => {

                                setMostrarFormulario(false);

                                setDepartamentoEditar(null);

                            }}

                        />

                    </div>

                )}

                {mostrarConfirmacion && departamentoSeleccionado && (

                    <ConfirmModal

                        titulo={

                            accionModal === "desactivar"

                                ? "Desactivar departamento"

                                : "Reactivar departamento"

                        }

                        mensaje={

                            accionModal === "desactivar"

                                ? `¿Desea desactivar el departamento "${departamentoSeleccionado.nombre}"?`

                                : `¿Desea reactivar el departamento "${departamentoSeleccionado.nombre}"?`

                        }

                        textoBoton={

                            accionModal === "desactivar"

                                ? "Desactivar"

                                : "Reactivar"

                        }

                        onCancelar={() => {

                            setMostrarConfirmacion(false);

                            setDepartamentoSeleccionado(null);

                            setAccionModal("");

                        }}

                        onConfirmar={async () => {

                            if (accionModal === "desactivar") {

                                await desactivarDepartamento(departamentoSeleccionado.id);

                            } else {

                                await activarDepartamento(departamentoSeleccionado.id);

                            }

                            setMostrarConfirmacion(false);

                            setDepartamentoSeleccionado(null);

                            setAccionModal("");

                        }}

                    />

                )}

                <div className="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Nombre</th>

                                <th>Descripción</th>

                                <th>Estado</th>

                                <th>Acciones</th>

                            </tr>

                        </thead>

                        <tbody>

                            {departamentosFiltrados.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="sin-registros"
                                    >

                                        No hay departamentos registrados.

                                    </td>

                                </tr>

                            ) : (

                                departamentosFiltrados.map((dep) => (

                                    <tr key={dep.id}>

                                        <td>{dep.id}</td>

                                        <td>{dep.nombre}</td>

                                        <td>{dep.descripcion}</td>

                                        <td>

                                            <span
                                                className={`estado ${dep.activo ? "activo" : "inactivo"}`}
                                            >

                                                {dep.activo ? "Activo" : "Inactivo"}

                                            </span>

                                        </td>

                                        <td className="acciones">

                                            <button

                                                aria-label="Editar departamento"

                                                title="Editar"

                                                disabled={!dep.activo}

                                                onClick={() => {

                                                    setDepartamentoEditar(dep);

                                                    setMostrarFormulario(true);

                                                }}

                                            >

                                                <FaEdit />

                                            </button>

                                            {dep.activo ? (

                                                <button

                                                    aria-label="Desactivar departamento"

                                                    title="Desactivar"

                                                    onClick={() => {

                                                        setDepartamentoSeleccionado(dep);

                                                        setAccionModal("desactivar");

                                                        setMostrarConfirmacion(true);

                                                    }}

                                                >

                                                    <FaTrash />

                                                </button>

                                            ) : (

                                                <button

                                                    aria-label="Reactivar departamento"

                                                    title="Reactivar"

                                                    onClick={() => {

                                                        setDepartamentoSeleccionado(dep);

                                                        setAccionModal("reactivar");

                                                        setMostrarConfirmacion(true);

                                                    }}

                                                >

                                                    <FaUndoAlt />

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}

export default Departamentos;