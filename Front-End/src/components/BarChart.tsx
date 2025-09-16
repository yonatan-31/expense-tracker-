import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import type { RecentTransaction } from "../types/transactions";


interface BarChartProps {
    data?: RecentTransaction[];
}


const COLORS = ["#7c3aed", "#c084fc", "#a78bfa", "#d8b4fe", "#e0e7ff"];

const Barchart: React.FC<BarChartProps> = ({ data = [] }) => {
    // Group amounts by category
    const groupedData: { name: string; amount: number }[] = [];
    const map = new Map<string, number>();

    data.forEach((item) => {
        let category = item.category.trim().toLowerCase();
        const amount = typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
        const current = map.get(category) || 0;
        map.set(category, current + amount);
    });


    map.forEach((amount, name) => {
        groupedData.push({ name, amount });
    });

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={groupedData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => `$${value}`} />
                <Bar dataKey="amount" radius={[10, 10, 10, 10]}>
                    {groupedData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Barchart;
