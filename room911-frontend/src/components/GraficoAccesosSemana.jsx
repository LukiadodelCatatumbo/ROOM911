import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

function GraficoAccesosSemana({ datos }) {

    return (

        <div className="grafico-card">

            <h2>Accesos últimos 7 días</h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart data={datos}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="dia" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="cantidad"
                        stroke="#2563EB"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default GraficoAccesosSemana;