interface SeriesCreation {
    seriesType: "line" | "column" | "heatmap";
    seriesName: string;
  }
interface ConfigurationObj {
    title: string;
    seriesCreationArrayofObj: SeriesCreation[];
    hours: string[];
    days: string[];
    showLegend: boolean;
    showCursor: boolean;
    showScrollx: boolean;
    showScrolly: boolean;
    zoomToIndex: boolean;
    zoomStartIndex: string;
    zoomEndIndex: string;
    showoverallTooltip: boolean;
  }

interface Props {
    chartData: any;
    configurationObj: any;
}
export type { Props };