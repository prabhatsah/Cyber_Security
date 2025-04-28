// useECharts.ts
import { useEffect, useState, RefObject } from "react";
import * as echarts from "echarts";

const useECharts = (chartRef: RefObject<HTMLDivElement>) => {
    const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const instance = echarts.init(chartRef.current);
            setChartInstance(instance);

            const handleResize = () => {
                if (instance) {
                    instance.resize();
                }
            };

            const resizeObserver = new ResizeObserver(handleResize);
            if (chartRef.current?.parentElement) {
                resizeObserver.observe(chartRef.current.parentElement);
            }

            return () => {
                resizeObserver.disconnect();
                instance.dispose();
            };
        }
    }, [chartRef]);

    return chartInstance;
};

export default useECharts;
