import React from "react";
import BarChart from "./BarChart"
import type { RecentTransaction } from "../types/transactions";

interface BarChartProps {
    data: RecentTransaction[];
}


const Last30DaysExpense: React.FC<BarChartProps> = ({ data }) => {

    return (
        <div className="w-full  bg-white p-8 rounded shadow  h-full">
            <h3 className="text-lg font-semibold mb-4">Last 30 Days Expenses</h3>
            <BarChart data={data} />
        </div>
    );
};

export default Last30DaysExpense;
