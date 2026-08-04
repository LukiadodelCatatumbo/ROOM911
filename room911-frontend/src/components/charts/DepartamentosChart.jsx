import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS=[
"#2563EB",
"#22C55E",
"#F97316",
"#A855F7",
"#06B6D4",
"#EF4444"
];

function DepartamentosChart({datos}){

    return(

        <div className="chart-card">

            <h2>

                Empleados por departamento

            </h2>

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <PieChart>

                    <Pie

                        data={datos}

                        dataKey="cantidad"

                        nameKey="departamento"

                        outerRadius={110}

                        label

                    >

                        {

                            datos.map((entry,index)=>(

                                <Cell

                                    key={index}

                                    fill={COLORS[index%COLORS.length]}

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
export default DepartamentosChart;