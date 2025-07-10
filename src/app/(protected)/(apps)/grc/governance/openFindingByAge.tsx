import { getColorScale } from '@/ikon/components/charts/common-function';
import { useThemeOptions } from '@/ikon/components/theme-provider';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from '../components/ui/chart';

const OpenFindingsByAge = () => {

    const chartData = [
        { name: '0-30 days', value: 7 },
        { name: '31-60 days', value: 4 },
        { name: '>60 days', value: 2 },
    ];

    const { state } = useThemeOptions();
    const chartRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);

    const textColor = useMemo(() => {
        if (state.mode === 'dark') {
            return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`;
        } else {
            return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()})`;
        }
    }, [state.mode]);

    const handleFullScreen = () => {
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (document.fullscreenElement) {
                setIsFullscreen(true);
            } else {
                setIsFullscreen(false);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const colorScale = getColorScale(chartData, state);

    const option: EChartsOption = {
        title: {
            //text: 'Open Findings By Age',
            left: 'left',
            textStyle: {
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
            },
        },
        toolbox: {
            show: true,
            right: 10,
            feature: {
                myFullScreen: {
                    show: true,
                    title: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
                    icon: isFullscreen
                        ? 'path://M512 832h320V512h128v448H512v-128zM832 512V192H512V64h448v448h-128zM192 512v320h320v128H64V512h128zM512 192v320H384V64h448v128H512z'
                        : 'path://M928 544H544v384h384V544zm-64 320H608V608h256v256zM480 480H96v384h384V480zm-64 320H160V544h256v256zM480 96H96v384h384V96zm-64 320H160V160h256v256zM928 96H544v384h384V96zm-64 320H608V160h256v256z',
                    onclick: handleFullScreen,
                },
            },
        },
        xAxis: {
            type: 'category',
            data: chartData.map((data) => data.name),
            axisLabel: { color: textColor },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: textColor },
            show: false,
        },
        series: [
            {
                name: 'count',
                type: 'bar',
                data: chartData.map((data) => data.value),
                itemStyle: {
                    color: (params: any) => colorScale[params.dataIndex % colorScale.length],
                },
            },
        ],
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{
                height: isFullscreen ? '100vh' : 'auto',
                position: 'relative', // Keep chart within the card bounds
            }}
        >
            <div className="relative">
                <Chart >
                    <ReactECharts
                        ref={chartRef}
                        option={option}
                        style={{
                            height: isFullscreen ? '80vh' : '400px',
                            width: '100%', // Make sure chart stretches to fit
                        }}
                    />
                </Chart>
            </div>
        </div>
    );
};

export default OpenFindingsByAge;
