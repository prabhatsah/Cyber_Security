// Type for ECharts options
// type EChartsOption = echarts.EChartsOption;
// Define types for props
interface SeriesCreation {
  seriesType: "line" | "column";
  seriesValueKey: string;
  seriesTooltipText: string;
  seriesName: string;
  seriesColor: string;
  showSeriesTooltip: boolean;
}

interface ConfigurationObj {
  version: number;
  categoryKey: string;
  seriesCreationArrayofObj: SeriesCreation[];
  showLegend: boolean;
  showCursor: boolean;
  showScrollx: boolean;
  showScrolly: boolean;
  zoomToIndex: boolean;
  zoomStartIndex: string;
  zoomEndIndex: string;
  showoverallTooltip: boolean;
  overallTooltip: string;
}
interface Props {
  chartData: any; // Input data for the chart
  configurationObj: any; // Configuration object for the chart
}

export type { Props };

