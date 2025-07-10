import React from "react";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

interface BarChartProps {
  data: { label: string; value: number }[];
  onBarClick: (label: string) => void; // New prop to handle bar click event
}

const BarChart = ({ data, onBarClick }: BarChartProps) => {
  // ECharts configuration
  const options: EChartsOption = {
    xAxis: {
      type: "category", // X-axis is categorical (labels)
      data: data.map((item) => item.label), // Labels for the bars
      axisLabel: {
        color: "#ffffff", // White text for x-axis labels
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)", // Light gray axis line
        },
      },
    },
    yAxis: {
      type: "value", // Y-axis is numerical (values)
      axisLabel: {
        color: "#ffffff", // White text for y-axis labels
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)", // Light gray axis line
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)", // Light gray grid lines
        },
      },
    },
    series: [
      {
        data: data.map((item) => item.value), // Values for the bars
        type: "bar", // Bar chart type
        itemStyle: {
          color: "#4A90E2", // Bar color
          borderRadius: 5, // Rounded corners for bars
        },
      },
    ],
    tooltip: {
      trigger: "axis", // Show tooltip on hover
      backgroundColor: "rgba(0, 0, 0, 0.8)", // Tooltip background color
      textStyle: {
        color: "#ffffff", // Tooltip text color
      },
    },
  };

  // Event handler for bar clicks
  const handleClick = (params: any) => {
    if (params.componentType === "series" && params.dataIndex !== undefined) {
      const clickedLabel = data[params.dataIndex].label;
      onBarClick(clickedLabel); // Pass the clicked label to the parent component
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full" style={{ height: "240px" }}>
        <ReactECharts
          option={options}
          style={{ height: "100%", width: "100%" }}
          onEvents={{
            click: handleClick, // Attach the click event handler
          }}
        />
      </div>
    </div>
  );
};

export default BarChart;