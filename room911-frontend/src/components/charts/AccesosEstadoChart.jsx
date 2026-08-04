import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = [
    "#22C55E",
    "#EF4444"
];

function AccesosEstadoChart({ resumen }) {

    const datos = [

        {
            estado: "Permitidos",
            cantidad: resumen.accesosHoy - resumen.denegadosHoy
        },

        {
            estado: "Denegados",
            cantidad: resumen.denegadosHoy
        }

    ];

    return (

        <div className="chart-card">

            <h2>Accesos de Hoy</h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie

                        data={datos}

                        dataKey="cantidad"

                        nameKey="estado"

                        outerRadius={110}

                        label

                    >

                        {

                            datos.map((entry, index) => (

                                <Cell

                                    key={index}

                                    fill={COLORS[index]}

                                />

                            ))

                        }

                    </Pie>

                    <Tooltip/>

                    <Legend/>

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}

export default AccesosEstadoChart;