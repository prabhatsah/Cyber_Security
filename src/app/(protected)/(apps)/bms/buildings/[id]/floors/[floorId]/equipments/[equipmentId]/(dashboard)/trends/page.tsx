"use client";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Download, RefreshCw } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { getLatestLiveBacnetDataTest } from "@/app/(protected)/(apps)/bms/get-data/get-cassandra-data";
import { formatChartData } from "@/app/(protected)/(apps)/bms/helpers/formatChartData";
import html2canvas from "html2canvas";
import { analyzeDamper, analyzeValve } from '@/app/(protected)/(apps)/bms/helpers/analysisApi';
import ReactMarkdown from 'react-markdown';

const param1 = {
  dataCount: null,
  service_name: null,
  serviceNameList: ['RA CO2', 'ra CO2 setpoint', 'RA Damper feedback'],
  startDate: null,
  endDate: null,
  timePeriod: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
};

const param2 = {
  dataCount: null,
  service_name: null,
  serviceNameList: ['AHU-01 RA Temp', 'RA Temp control( Valve Feedback)', 'SA temp', 'RA  temperature setpoint'],
  startDate: null,
  endDate: null,
  timePeriod: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
};

export default function TrendsPage() {
  const [damperBehaviorAnalysisChartData, setDamperBehaviorAnalysisChartData] = useState<any[]>([]);
  const [valveAnalysisChartData, setValveAnalysisChartData] = useState<any[]>([]);
  const [isLoadingDamper, setIsLoadingDamper] = useState(true);
  const [isLoadingValve, setIsLoadingValve] = useState(true);
  const [isAnalyzingDamper, setIsAnalyzingDamper] = useState(false);
  const [isAnalyzingValve, setIsAnalyzingValve] = useState(false);
  const [damperAnalysisResult, setDamperAnalysisResult] = useState<any>(null);
  const [valveAnalysisResult, setValveAnalysisResult] = useState<any>(null);
  const [modalContent, setModalContent] = useState("");

  const damperChartRef = useRef(null);
  const valveChartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingDamper(true);
        setIsLoadingValve(true);

        // Fetch damper data
        const damperResponse = await getLatestLiveBacnetDataTest(param1);
        const damperData = damperResponse?.queryResponse || [];
        const formattedDamperData = await formatChartData(damperData);
        setDamperBehaviorAnalysisChartData(formattedDamperData);

        // Fetch valve data
        const valveResponse = await getLatestLiveBacnetDataTest(param2);
        const valveData = valveResponse?.queryResponse || [];
        const formattedValveData = await formatChartData(valveData);
        setValveAnalysisChartData(formattedValveData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingDamper(false);
        setIsLoadingValve(false);
      }
    };

    fetchData();
  }, []);

  const saveDamperChartAsImage = () => {
    const chart = damperChartRef.current;
    if (chart) {
      html2canvas(chart).then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'damper_behavior_analysis_chart.png';
        link.click();
      });
    }
  };

  const saveValveChartAsImage = () => {
    const chart = valveChartRef.current;
    if (chart) {
      html2canvas(chart).then((canvas) => {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'valve_behavior_analysis_chart.png';
        link.click();
      });
    }
  };

  const handleDamperAnalysis = async () => {
    try {
      setIsAnalyzingDamper(true);
      const analysisData = {
        analysis_data: damperBehaviorAnalysisChartData,
      };
      const result = await analyzeDamper(analysisData);
      setDamperAnalysisResult(result?.message);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzingDamper(false);
    }
  };

  const handleValveAnalysis = async () => {
    try {
      setIsAnalyzingValve(true);
      const analysisData = {
        analysis_data: valveAnalysisChartData,
      };
      const result = await analyzeValve(analysisData);
      setValveAnalysisResult(result?.message);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzingValve(false);
    }
  };

  const damperAnalysisChartConfiguration = {
    series: [
      {
        dataKey: 'RA CO2',
        name: 'Return Air CO2',
        lineStyle: { color: '#2563eb' }, // Bright blue
        smooth: true,
      },
      {
        dataKey: 'RA Damper feedback',
        name: 'Damper Position',
        lineStyle: { color: '#16a34a' }, // Green
        smooth: true,
      },
      {
        dataKey: 'ra CO2 setpoint',
        name: 'CO2 Setpoint',
        lineStyle: { color: '#dc2626' }, // Red
        smooth: true,
      },
    ],
    chartConfig: {
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
      gridStyle: { strokeDasharray: '3 3', stroke: 'rgba(148, 163, 184, 0.2)' },
      tooltipStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  };

  const valveAnalysisChartConfiguration = {
    series: [
      {
        dataKey: 'AHU-01 RA Temp',
        name: 'Return Air Temperature',
        lineStyle: { color: '#2563eb' }, // Bright blue
        smooth: true,
      },
      {
        dataKey: 'RA Temp control( Valve Feedback)',
        name: 'Cooling Coil Feedback',
        lineStyle: { color: '#16a34a' }, // Green
        smooth: true,
      },
      {
        dataKey: 'SA temp',
        name: 'Supply Air Temperature',
        lineStyle: { color: '#dc2626' }, // Red
        smooth: true,
      },
      {
        dataKey: 'RA  temperature setpoint',
        name: 'Return Air Temperature Setpoint',
        lineStyle: { color: '#9333ea' }, // Purple
        smooth: true,
      },
    ],
    chartConfig: {
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
      gridStyle: { strokeDasharray: '3 3', stroke: 'rgba(148, 163, 184, 0.2)' },
      tooltipStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  };

  const refreshData = async () => {
    try {
      setIsLoadingDamper(true);
      setIsLoadingValve(true);

      const damperResponse = await getLatestLiveBacnetDataTest(param1);
      const damperData = damperResponse?.queryResponse || [];
      const formattedDamperData = await formatChartData(damperData);
      setDamperBehaviorAnalysisChartData(formattedDamperData);

      const valveResponse = await getLatestLiveBacnetDataTest(param2);
      const valveData = valveResponse?.queryResponse || [];
      const formattedValveData = await formatChartData(valveData);
      setValveAnalysisChartData(formattedValveData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoadingDamper(false);
      setIsLoadingValve(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal for displaying markdown content */}
      <Dialog>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analysis Details</DialogTitle>
          </DialogHeader>
          <div className="prose dark:prose-invert max-w-none">
            {modalContent && <ReactMarkdown>{modalContent}</ReactMarkdown>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trend Analysis</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={refreshData}
            disabled={isLoadingDamper || isLoadingValve}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={saveDamperChartAsImage}
            disabled={isLoadingDamper || damperBehaviorAnalysisChartData.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export Damper Chart</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={saveValveChartAsImage}
            disabled={isLoadingValve || valveAnalysisChartData.length === 0}
          >
            <Download className="h-4 w-4" />
            <span>Export Valve Chart</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          {/* <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger> */}
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          {/* Damper Behavior Analysis Chart */}
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Damper Behavior Analysis</CardTitle>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleDamperAnalysis}
                disabled={isAnalyzingDamper || isLoadingDamper || damperBehaviorAnalysisChartData.length === 0}
              >
                {isAnalyzingDamper ? 'Analyzing...' : 'Analyze'}
              </Button>
            </CardHeader>
            <CardContent className="h-[400px]" ref={damperChartRef}>
              {isLoadingDamper ? (
                <div className="flex items-center justify-center h-full">
                  Loading damper data...
                </div>
              ) : damperBehaviorAnalysisChartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={damperBehaviorAnalysisChartData}
                      margin={damperAnalysisChartConfiguration.chartConfig.margin}
                    >
                      <CartesianGrid
                        strokeDasharray={damperAnalysisChartConfiguration.chartConfig.gridStyle.strokeDasharray}
                        stroke={damperAnalysisChartConfiguration.chartConfig.gridStyle.stroke}
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={damperAnalysisChartConfiguration.chartConfig.tooltipStyle}
                        cursor={{ strokeDasharray: '3 3' }}
                      />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                      />
                      {damperAnalysisChartConfiguration.series.map((seriesConfig, index) => (
                         <Line
                         key={index}
                         type="monotone"
                         dataKey={seriesConfig.dataKey}  // Use dataKey for data mapping
                         name={seriesConfig.name}        // Use name for legend display
                         stroke={seriesConfig.lineStyle.color}
                         dot={false}
                         activeDot={{ r: 6, strokeWidth: 0 }}
                         strokeWidth={2.5}
                         animationDuration={300}
                       />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                  {damperAnalysisResult && (
                    <div className="mt-4 p-4 rounded">
                      {/* <h3 className="font-semibold">Analysis Results:</h3> */}
                      <Dialog defaultOpen>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Damper Analysis Details</DialogTitle>
                          </DialogHeader>
                          <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{damperAnalysisResult}</ReactMarkdown>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  No damper data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Valve Behavior and Performance Analysis Chart */}
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Valve Behavior and Performance Analysis</CardTitle>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleValveAnalysis}
                disabled={isAnalyzingValve || isLoadingValve || valveAnalysisChartData.length === 0}
              >
                {isAnalyzingValve ? 'Analyzing...' : 'Analyze'}
              </Button>
            </CardHeader>
            <CardContent className="h-[400px]" ref={valveChartRef}>
              {isLoadingValve ? (
                <div className="flex items-center justify-center h-full">
                  Loading valve data...
                </div>
              ) : valveAnalysisChartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                      data={valveAnalysisChartData}
                      margin={valveAnalysisChartConfiguration.chartConfig.margin}
                    >
                      <CartesianGrid
                        strokeDasharray={valveAnalysisChartConfiguration.chartConfig.gridStyle.strokeDasharray}
                        stroke={valveAnalysisChartConfiguration.chartConfig.gridStyle.stroke}
                      />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={valveAnalysisChartConfiguration.chartConfig.tooltipStyle}
                        cursor={{ strokeDasharray: '3 3' }}
                      />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                      />
                      {valveAnalysisChartConfiguration.series.map((seriesConfig, index) => (
                        <Line
                        key={index}
                        type="monotone"
                        dataKey={seriesConfig.dataKey}  // Use dataKey for data mapping
                        name={seriesConfig.name}        // Use name for legend display
                        stroke={seriesConfig.lineStyle.color}
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        strokeWidth={2.5}
                        animationDuration={300}
                      />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                  {valveAnalysisResult && (
                    <div className="mt-4 p-4 rounded">
                      {/* <h3 className="font-semibold">Analysis Results:</h3> */}
                      <Dialog defaultOpen>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Valve Analysis Details</DialogTitle>
                          </DialogHeader>
                          <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{valveAnalysisResult}</ReactMarkdown>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Close</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  No valve data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

