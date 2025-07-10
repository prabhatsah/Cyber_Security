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
    chartData: any;
    configurationObj: any;
}
export type { Props, ConfigurationObj, SeriesCreation };