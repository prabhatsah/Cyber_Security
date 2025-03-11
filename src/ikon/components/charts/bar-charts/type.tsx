// export type BarChartData = {
//     name: string;
//     value: number;
//   };
  
//   export type BarChartProps = {
//     data: BarChartData[];
//   };


// type.tsx

//First Change
export type BarChartData = {
  name: string;  // Name of the category (e.g., 'Category 1')
  value: number; // Corresponding value (e.g., 100)
};

export type BarChartConfig = {
  DarkColorPalette?: any,
  lightColorPalette?: any,
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
  showoverallTooltip?: boolean; // Whether to show overall tooltip (optional)
  overallTooltip?: "{b}: {c}",
  colors: string[];
  onReadyFn?: () => void;  // Callback function after the chart is ready (optional)
  onHitFn?: (params: any) => void;    // Callback function when a chart item is clicked (optional)
};


// export type BarChartData<T extends BarChartConfig> = {
//   [key in T['categoryKey'] | T['valueKey']]: key extends T['categoryKey'] ? string : number;
// };

//Second Change
export type BarChartProps = {
  //containerId: string;     // The ID of the container where the chart should be rendered
  chartData: BarChartData[];    // The actual data to be displayed in the chart
  configurationObj: BarChartConfig;  // Configuration for the chart
};

// export type BarChartProps<T extends BarChartConfig> = {
//   containerId: string;     // The ID of the container where the chart should be rendered
//   data: BarChartData<T>[]; // The actual data to be displayed in the chart
//   configurationObj: T;     // Configuration for the chart
// };
