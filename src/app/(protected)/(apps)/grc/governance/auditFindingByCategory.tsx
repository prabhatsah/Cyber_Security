'use client'
import { getColorScale } from '@/ikon/components/charts/common-function';
import { useThemeOptions } from '@/ikon/components/theme-provider';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from '../components/ui/chart';
const AuditFindingsByCategory = () => {

  const chartData = [
    { value: 15, name: 'Cybersecurity' },
    { value: 12, name: 'Operational Risk' },
    { value: 4, name: 'Incident Response' },
    { value: 4, name: 'Communications' }
  ]

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
      //text: 'Audit Findings by Practice',
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
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: textColor }
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['35%', '50%'],
        data: chartData,
        label: {
          color: textColor
        },
        color: colorScale
      }
    ],
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: isFullscreen ? '100vh' : 'auto' }}>
      <div className='relative'>
        <Chart>
          <ReactECharts
            ref={chartRef}
            option={option}
            style={{ height: isFullscreen ? '80vh' : '400px' }}
          />
        </Chart>
      </div>
    </div>
  )
};

export default AuditFindingsByCategory;