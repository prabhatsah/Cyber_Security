// Type for ECharts options
// type EChartsOption = echarts.EChartsOption;
export interface configurationObj {
  categoryKey: string;
  valueKey: string;
  title?: string;
  showLegend?: boolean;
  showScrollx?: boolean;
  showScrolly?: boolean;
  zoomStartIndex?: number;
  zoomEndIndex?: number;
  columnValueKey: string;
  lineValueKey: string;
  seriesNames: string[];
  categories: string[];
  sortBy: string;
  colors: string[];
}
interface Props {
    type: string;
    chartData: any;
    configurationObj: configurationObj
}
  
  export type { Props };
  
  