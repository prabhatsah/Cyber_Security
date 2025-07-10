type ConfigurationObj = {
    title?: string;
    showLegend: boolean;
    showCursor: boolean;
    showoverallTooltip: boolean;
    overallTooltip: string;
    colors: string[];
  };
  interface Props {
    chartData: any;
    configurationObj: any
  }
  
  export type { Props };