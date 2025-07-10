"use client";

import EChartBarChart from "@/ikon/components/charts/bar-charts";
import { riskLevelColors } from "../../lib/chart-theme";
import ReactEcharts from "echarts-for-react";

// const riskData = [
//   { name: "Critical", value: 6, color: riskLevelColors.Critical },
//   { name: "High", value: 7, color: riskLevelColors.High },
//   { name: "Medium", value: 9, color: riskLevelColors.Medium },
//   { name: "Low", value: 8, color: riskLevelColors.Low }
// ]

// const configurationObj = {
//   title: " ",
//   showTitle: true,
//   showLegend: true,
//   categoryKey: "name",
//   valueKey: "value",
//   showScrollx: false,
//   showCursor: true,
//   showoverallTooltip: true,
//   overallTooltip: "{b}: {c}" as const,
//   colors: riskData.map((item) => item.color),
//   legendData: riskData.map((item) => item.name)
// };

// export function RiskDistribution() {
//   return <EChartBarChart chartData={riskData} configurationObj={configurationObj} />;
// }


import { useThemeOptions } from "@/ikon/components/theme-provider";
import { getColorScale } from "@/ikon/components/charts/common-function";

export function RiskDistribution() {
  const { state } = useThemeOptions();
  const chartData = [
    { name: "Critical", value: 6 },
    { name: "High", value: 7 },
    { name: "Medium", value: 9 },
    { name: "Low", value: 8 },
  ];
  const colorScale = getColorScale(chartData, state);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        return `${params[0].name}: <b>${params[0].value}</b>`;
      },
    },
    xAxis: { type: "category", data: ["Critical", "High", "Medium", "Low"] },
    grid: { left: "3%", right: "4%", bottom: "8%", top: "30%", containLabel: true },
    yAxis: { type: "value" },
    // legend: { 
    //   selectedMode: true,
    //   textStyle: {
    //     color: "#333",
    //   }
    // },
    color: colorScale, 
    series: [
      {
        name: "Critical", type: "bar", data: [6, 0, 0, 0],
        itemStyle: { color: (params: any) => colorScale[0] }
      },
      {
        name: "High", type: "bar", data: [0, 7, 0, 0],
        itemStyle: { color: (params: any) => colorScale[1] } 
      },
      {
        name: "Medium", type: "bar", data: [0, 0, 9, 0],
        itemStyle: { color: (params: any) => colorScale[2] } 
      },
      {
        name: "Low", type: "bar", data: [0, 0, 0, 8],
        itemStyle: { color: (params: any) => colorScale[3] } 
      },
    ],
    barWidth: "40%",
    barGap: "-100%",
    barCategoryGap: "50%"
  };

  return <ReactEcharts option={option} />;
}

