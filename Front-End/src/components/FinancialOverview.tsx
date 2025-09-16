import React from 'react';
import CustomPieChart from './CustomPieChart';

interface Metric {
  name: string;
  value: number;
}

interface FinancialOverviewProps {
  metric: Metric[];
  value: number
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ metric, value }) => {

  return (
    <div className="flex-1 rounded-lg shadow bg-white p-4" style={{ minHeight: 400 }}>
      <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
      <div className="w-full h-[400px]">
        <CustomPieChart data={metric} value={value} />
      </div>

    </div>
  );
}

export default FinancialOverview;
