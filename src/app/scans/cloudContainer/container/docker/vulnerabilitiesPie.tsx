"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PieChartProps {
  data: { severity: string; count: number }[];
}

// Define vibrant colors for each severity level
const severityColors: Record<string, string> = {
    LOW: "#14532d",       // Darker Green (Tailwind: bg-green-900)
    MEDIUM: "#92400e",    // Darker Yellow-Orange (Tailwind: bg-yellow-900)
    HIGH: "#7c2d12",      // Darker Orange-Red (Tailwind: bg-orange-900)
    CRITICAL: "#7f1d1d",  // Darker Red (Tailwind: bg-red-900)
    DEFAULT: "#1f2937"    // Darker Gray (Tailwind: bg-gray-900) (Fallback)
  };

const CustomDonutChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="severity"
          cx="50%"
          cy="50%"
          innerRadius={80} 
          outerRadius={130} 
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry) => (
            <Cell key={entry.severity} fill={severityColors[entry.severity] || severityColors.DEFAULT} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} reports`} />
        <Legend wrapperStyle={{ fontSize: "14px", fontWeight: "bold" }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomDonutChart;
