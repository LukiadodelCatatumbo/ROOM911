import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/DepartamentoForm.css";

function DepartamentoForm({
    departamento,
    onDepartamentoCreado,
    onCerrar
}) {

    const [form, setForm] = useState({
        nombre: "",
        descripcion: ""
    });

    useEffect(() => {

        if (departamento) {

            setForm({
                nombre: departamento.nombre,
                descripcion: departamento.descripcion
            });

        }

    }, [departamento]);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const guardarDepartamento = async (e) => {

        e.preventDefault();

        try {

            if (departamento) {

                await api.put(
                    `/departamentos/${departamento.id}`,
                    form
                );

                alert("Departamento actualizado");

            } else {

                await api.post(
                    "/departamentos",
                    form
                );

                alert("Departamento registrado");

            }

            onDepartamentoCreado();

        } catch (error) {

            console.error(error);

            alert("Ocurrió un error.");

        }

    };

    return (

        <form
            onSubmit={guardarDepartamento}
            className="modal"
        >

            <h2>

                {departamento
                    ? "Editar Departamento"
                    : "Nuevo Departamento"}

            </h2>

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

                <label>Descripción</label>

                <textarea
                    name="descripcion"
                    rows="4"
                    value={form.descripcion}
                    onChange={handleChange}
                />

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

export default DepartamentoForm;