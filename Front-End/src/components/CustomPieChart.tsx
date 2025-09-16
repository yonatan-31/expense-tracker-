import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

interface CustomPieChartProps {
  data: { name: string; value: number }[];
  value: number
}

const COLORS = ["#4ade80", "#f87171", "#60a5fa"]; // expand if needed

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, value }) => {
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          label
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
  );
};

export default CustomPieChart;
