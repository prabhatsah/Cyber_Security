// export type LineChartData = {
//     name: string;
//     value: number;
//   };
  
//   export type LineChartProps = {
//     data: LineChartData[];
//   };




export type LineChartData = {
  name: string;  // Name of the category (e.g., 'Category 1')
  value: number; // Corresponding value (e.g., 100)
};

export type LineChartConfig = {
  version?: number;         // Version for chart configuration (optional)
  categoryKey: string;      // Key to access the category in the data (e.g., 'name')
  valueKey: string;         // Key to access the value in the data (e.g., 'value')
  title?: string;           // Optional title for the chart
  showLegend?: boolean;     // Whether to show the legend (optional)
  showCursor?: boolean;    // Whether to show cursor interaction (optional)
  showScrollx?: boolean;   // Whether to allow horizontal scrolling (optional)
  showScrolly?: boolean;   // Whether to allow vertical scrolling (optional)
  zoomToIndex?: boolean;   // Whether to zoom into a specific index (optional)
  zoomStartIndex?: number; // Start index for zooming (optional)
  zoomEndIndex?: number;   // End index for zooming (optional)
  colors: string[],
  onReadyFn?: () => void;  // Callback function after the chart is ready (optional)
  onHitFn?: () => void;    // Callback function when a chart item is clicked (optional)
};

export type LineChartProps = {
  //containerId: string;     // The ID of the container where the chart should be rendered
  chartData: LineChartData[];    // The actual data to be displayed in the chart
  configurationObj: LineChartConfig;  // Configuration for the chart
};
