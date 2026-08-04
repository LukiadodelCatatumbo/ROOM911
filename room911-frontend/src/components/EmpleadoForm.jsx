import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/EmpleadoForm.css";

function EmpleadoForm({ empleado, onEmpleadoCreado, onCerrar }) {

    const [departamentos, setDepartamentos] = useState([]);

    const [form, setForm] = useState({
        documento: "",
        nombre: "",
        apellido: "",
        correo: "",
        cargo: "",
        departamentoId: "",
        accesoPermitido: true
    });

    useEffect(() => {
        cargarDepartamentos();
    }, []);

    useEffect(() => {

        if (empleado) {

            setForm({

                documento: empleado.documento,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                correo: empleado.correo,
                cargo: empleado.cargo,
                departamentoId: empleado.departamentoId,
                accesoPermitido: empleado.accesoPermitido

            });

        }

    }, [empleado]);

    const cargarDepartamentos = async () => {
        try {
            const response = await api.get("/departamentos");
            setDepartamentos(response.data);
        } catch (error) {
            console.error("Error al cargar departamentos", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const guardarEmpleado = async (e) => {
        e.preventDefault();

        try {

            const datos = {
                ...form,
                departamentoId: Number(form.departamentoId)
            };

            if (empleado) {

                await api.put(
                    `/empleados/${empleado.id}`,
                    datos
                );

                alert("Empleado actualizado correctamente");

                onEmpleadoCreado(null, {
                    esNuevo: false
                });

            } else {

                const response = await api.post(
                    "/empleados",
                    datos
                );

                alert("Empleado registrado correctamente");

                onEmpleadoCreado(response.data, {
                    esNuevo: true,
                    datosFormulario: datos
                });

            }

            setForm({
                documento: "",
                nombre: "",
                apellido: "",
                correo: "",
                cargo: "",
                departamentoId: "",
                accesoPermitido: true
            });

        } catch (error) {

            console.error(error);
            alert("Error al registrar empleado");

        }
    };

    const eliminarEmpleado = async (id) => {

        const confirmar = window.confirm(
            "¿Desea eliminar este empleado?"
        );

        if (!confirmar) return;

        try {

            await api.delete(`/empleados/${id}`);

            obtenerEmpleados();

        } catch (error) {

            console.error(error);

            alert("Error al eliminar empleado");

        }

    };

    return (

        <form onSubmit={guardarEmpleado} className="modal">

            <h2>Registrar empleado</h2>

            <div className="form-grid">

                <div className="form-group">
                    <label>Documento</label>
                    <input
                        type="text"
                        name="documento"
                        value={form.documento}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        value={form.apellido}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Correo</label>
                    <input
                        type="email"
                        name="correo"
                        value={form.correo}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Cargo</label>
                    <input
                        type="text"
                        name="cargo"
                        value={form.cargo}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Departamento</label>

                    <select
                        name="departamentoId"
                        value={form.departamentoId}
                        onChange={handleChange}
                    >

                        <option value="">
                            Seleccione un departamento
                        </option>

                        {departamentos
                            .filter(dep => dep.activo)
                            .map((dep) => (

                                <option
                                    key={dep.id}
                                    value={dep.id}
                                >
                                    {dep.nombre}
                                </option>

                            ))}

                    </select>

                </div>

            </div>

            <div className="checkbox">

                <input
                    type="checkbox"
                    name="accesoPermitido"
                    checked={form.accesoPermitido}
                    onChange={handleChange}
                />

                <label>Acceso permitido</label>

            </div>

            <div className="modal-actions">

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={onCerrar}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    className="btn-primary"
                >
                    Guardar
                </button>
            </div>

        </form>

    );
}

export default EmpleadoForm;