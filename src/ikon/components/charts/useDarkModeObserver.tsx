import { EChartsCoreOption } from 'echarts/types/dist/echarts';
import { useEffect } from "react";
import * as echarts from "echarts";

const useDarkModeObserver = (chartInstance?: echarts.ECharts | null, isDarkModeEnabled?:boolean) => {
  const updateChartTheme = (isDarkMode?: boolean) => {
    if (chartInstance) {
      const textColor = isDarkMode ? "#ffffff" : "#000000";

      // Initialize options object
      const options: echarts.EChartsCoreOption = {
        title: {
          textStyle: { color: textColor }
        },
      };

      // Conditionally apply legend styles
      if (chartInstance.getOption().legend) {
        options.legend = {
          textStyle: { color: textColor }
        };
      }

      // Conditionally apply axis styles
      if (chartInstance.getOption().xAxis) {
        options.xAxis = {
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor },
        };
      }

      if (chartInstance.getOption().yAxis) {
        options.yAxis = {
          axisLine: { lineStyle: { color: textColor } },
          axisLabel: { color: textColor },
        };
      }
      // Conditionally apply visualMap styles only if it exists
      const visualMapOption = chartInstance.getOption().visualMap as EChartsCoreOption['visualMap'][];
      if (visualMapOption && visualMapOption.length > 0) {
        options.visualMap = {
          textStyle: { color: textColor }
        };
      }

      chartInstance.setOption(options);
    }
  };

  useEffect(() => {
    const handleThemeChange = () => {
      // const darkModeEnabled = document.documentElement.classList.contains("dark");
      updateChartTheme(isDarkModeEnabled);
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial theme check
    handleThemeChange();

    return () => observer.disconnect();
  }, [chartInstance]);
};

export default useDarkModeObserver;