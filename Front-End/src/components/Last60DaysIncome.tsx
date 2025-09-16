import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import type { RecentTransaction } from "../types/transactions";


interface Last60DaysIncomeProps {
    data: RecentTransaction[]
    value: number
}

const COLORS = ["#4ade80", "#f87171", "#60a5fa"]; // expand if needed

const Last60DaysIncome: React.FC<Last60DaysIncomeProps> = ({ data, value }) => {
    
    return (
        <div className="w-full  bg-white p-8 rounded shadow  h-full">
            <h3 className="text-lg font-semibold mb-4">Last 60 Days Income</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}

                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <Label
                            value={`$${value.toFixed(2)}`}
                            position="center"
                            className="text-lg font-bold"
                        />
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>

    );
};

export default Last60DaysIncome;
