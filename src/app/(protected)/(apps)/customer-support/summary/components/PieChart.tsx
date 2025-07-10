// PieChart.tsx (Updated to handle clicks)
"use client"
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface PieChartProps {
  data: { label: string; value: number }[];
  onSectionClick: (category: string) => void; // New prop to handle click event
}

const PieChart = ({ data, onSectionClick }: PieChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current, "dark");

      const options = {
        backgroundColor: "transparent",
        title: {
          text: "Ticket(s)",
          left: "center",
          textStyle: { color: "#ffffff", fontSize: 14 },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)",
        },
        series: [
          {
            name: "Tickets",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: { show: false },
            labelLine: { show: false },
            data: data.map((item, index) => ({
              value: item.value,
              name: item.label,
              itemStyle: {
                color: ["#6ec6ff", "#4a90e2", "#7b6fe9", "#ff8c00"][index % 4],
              },
            })),
          },
        ],
      };

      chart.setOption(options);

      chart.on("click", (params: any) => {
        if (params.name) {
          onSectionClick(params.name); // Pass the clicked category name
        }
      });

      return () => {
        chart.dispose();
      };
    }
  }, [data, onSectionClick]);

  return <div ref={chartRef} style={{ width: "100%", height: "250px" }} />;
};

export default PieChart;
