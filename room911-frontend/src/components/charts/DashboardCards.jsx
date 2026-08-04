import "../../styles/DashboardCards.css";

function DashboardCards({ resumen }) {

    return (

        <div className="cards">

            <div className="card">
                <h3>Empleados</h3>
                <span>{resumen.empleados}</span>
            </div>

            <div className="card">
                <h3>Departamentos</h3>
                <span>{resumen.departamentos}</span>
            </div>

            <div className="card">
                <h3>Accesos Hoy</h3>
                <span>{resumen.accesosHoy}</span>
            </div>

            <div className="card">
                <h3>Accesos Denegados</h3>
                <span>{resumen.denegadosHoy}</span>
            </div>

        </div>

    );

}

export default DashboardCards;