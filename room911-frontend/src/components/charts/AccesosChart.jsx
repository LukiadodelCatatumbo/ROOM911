import {

    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    CartesianGrid

} from "recharts";

function AccesosChart({ datos }) {

    return (

        <div className="chart-card">

            <h2>Accesos últimos 7 días</h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart data={datos}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="dia"/>

                    <Tooltip/>

                    <Bar
                        dataKey="cantidad"
                        radius={[8,8,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default AccesosChart;