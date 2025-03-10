"use client";
import React from "react";
import { Props } from "./types";
import PieChart from './piechart/index';
import ColumnLineChart from './column-line-chart/index';
import HeatMapChart from "./heat-map-chart/index";
import StackedLineChart from "./stacked-line-chart/index";
import EChartLineChart from "./line-charts";
import EChartBarChart from "./bar-charts";
import EChartStackBarNormalization from "./stack-bar-normalization";
import EchartBarChartWithNegative from "./bar-charts-with-negative";
import EChartSortedBarChart from "./sorted-bar-charts";
const Chart: React.FC<Props> = ({ type, chartData, configurationObj }) => {
  const renderChart = () => {
    switch (type) {
      case 'Stacked-Line-Chart':
        return <StackedLineChart chartData={chartData} configurationObj={configurationObj} />;
      case 'Pie-Chart':
        return <PieChart chartData={chartData} configurationObj={configurationObj} />;
      case 'Heat Map Chart':
        return <HeatMapChart chartData={chartData} configurationObj={configurationObj}/>;
      case 'Column-Line-Chart':
        return <ColumnLineChart chartData={chartData} configurationObj={configurationObj} />;
      case 'Line-Chart':
        return <EChartLineChart chartData={chartData} configurationObj={configurationObj} />
      case 'Bar-Chart':
        return <EChartBarChart chartData={chartData} configurationObj={configurationObj} />
      case 'Stack-Bar-Chart':
        return <EChartStackBarNormalization chartData={chartData} chartConfiguration={configurationObj} />
      case 'Bar-Chart-Negative':
        return <EchartBarChartWithNegative chartData={chartData} chartConfiguration={configurationObj} />
      case 'stack-bar-chart-negative':
        return <EChartStackBarNormalization chartData={chartData} chartConfiguration={configurationObj} />
      case 'sorted-bar-chart':
        return <EChartSortedBarChart chartData={chartData} chartConfiguration={configurationObj} />
      default:
        return <div>Invalid chart type</div>;
    }
  };

  return <>{renderChart()}</>
};

export default Chart;
