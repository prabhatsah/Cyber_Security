export interface EChartProps {
  chartData: number[][];  // Array of data for the chart
  chartConfiguration: {
    title: string;
    seriesNames: string[];
    showLegend?: boolean;
    showCursor?: boolean;
    showScrollx?: boolean;
    showScrolly?: boolean;
    colors?: string[];
  };
}