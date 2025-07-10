"use client";

import EChartLineChart from "@/ikon/components/charts/line-charts";
import { useThemeOptions } from "@/ikon/components/theme-provider";
import { getColorScale } from "@/ikon/components/charts/common-function";

export function Compliance() {
  const { state } = useThemeOptions();
  const complianceData = [
    { month: "Jan", rate: 40 },
    { month: "Feb", rate: 80 },
    { month: "Mar", rate: 25 },
    { month: "Apr", rate: 20 },
    { month: "May", rate: 90 }
  ].map(data => ({
    name: data.month,  // Now matches categoryKey
    value: data.rate   // Now matches valueKey
  }));
  const colorScale = getColorScale(complianceData, state);

  const configurationObj = {
    title: "",
    showLegend: true,
    categoryKey: "name",  // Match transformed data
    valueKey: "value",    // Match transformed data
    showScrollx: false,
    showCursor: true,
    showoverallTooltip: true,
    overallTooltip: "{b}: {c}%",
    colors: [colorScale[0], colorScale[1], colorScale[2], colorScale[3], colorScale[4]]
  };

  return <EChartLineChart chartData={complianceData} configurationObj={configurationObj} />;
}
