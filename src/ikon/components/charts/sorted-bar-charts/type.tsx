export interface EChartProps {
    chartData: any[]; // Data for the chart
    chartConfiguration: {
        title: string;        // Chart title
        showLegend: boolean;  // Whether to show legend
        sortBy: string;       // Field to sort by (e.g., 'score', 'age', etc.)
        colors: string[];
    };
}
