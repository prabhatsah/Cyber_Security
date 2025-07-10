// "use client"

// import { Bar, BarChart, Cell } from "recharts"
// import { Chart } from "../../components/ui/chart"
// import { categoryColors } from "../../lib/chart-theme"

// const data = [
//   { name: "Security", total: 12, color: categoryColors.Security },
//   { name: "Compliance", total: 15, color: categoryColors.Compliance },
//   { name: "Risk", total: 18, color: categoryColors.Risk },
//   { name: "Audit", total: 14, color: categoryColors.Audit },
//   { name: "Policy", total: 22, color: categoryColors.Policy }
// ]

// export function Overview() {
//   return (
//     <Chart height={350}>
//       <BarChart data={data}>
//         <Chart.Grid />
//         <Chart.XAxis 
//           dataKey="name" 
//           label={{ 
//             value: "Category",
//             position: "bottom",
//             offset: 0,
//             style: { fill: "hsl(var(--foreground))" }
//           }}
//         />
//         <Chart.YAxis
//           label={{
//             value: "Total Items",
//             angle: -90,
//             position: "insideLeft",
//             offset: 10,
//             style: { fill: "hsl(var(--foreground))" }
//           }}
//         />
//         <Chart.Tooltip />
//         <Chart.Legend />
//         <Bar 
//           dataKey="total" 
//           name="Total Items"
//           radius={[4, 4, 0, 0]}
//         >
//           {data.map((entry, index) => (
//             <Cell 
//               key={`cell-${index}`} 
//               fill={entry.color}
//               style={{ filter: "brightness(1)" }}
//               className="hover:brightness-90 transition-all"
//             />
//           ))}
//         </Bar>
//       </BarChart>
//     </Chart>
//   )
// }

"use client";

import PieChart from "@/ikon/components/charts/piechart";
import { categoryColors } from "../../lib/chart-theme";

const data = [
  { name: "Open", value: 15, color: categoryColors.Compliance },
  { name: "Passed", value: 18, color: categoryColors.Risk },
  { name: "Failed", value: 14, color: categoryColors.Audit },
];

const configurationObj = {
  title: " ",
  showLegend: true,
  showCursor: true,
  showoverallTooltip: true,
  overallTooltip: "{b}: {c}",
  colorPalette: data.map((item) => item.color), // Ensure color mapping
};

export function Overview() {
  return <PieChart chartData={data} configurationObj={configurationObj} />;
}


