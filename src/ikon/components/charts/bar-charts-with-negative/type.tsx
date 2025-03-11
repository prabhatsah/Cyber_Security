// Define the types for the props
export type EChartBarChartWithNegativeProps = {
  // chartData: {
  //   profit: number[];
  //   income: number[];
  //   expenses: number[];
  // };
  chartData: {
    [key: string]: number[]; // Key can be any string, and the value is an array of numbers
  }
  chartConfiguration: {
    title?: string;
    showLegend?: boolean;
    showScrollx?: boolean;
    showScrolly?: boolean;
    categories: string[];
    colors: string[];
  };
};
