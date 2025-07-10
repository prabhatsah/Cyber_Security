"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Wind,
  Lightbulb,
  Gauge,
  AlertTriangle,
  Check,
  Clock,
  Battery,
  Zap,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Button } from "@/shadcn/ui/button";
//import EChartLineChart from "@/ikon/components/charts/line-charts"
//import Chart from "@/ikon/components/charts/chart"
//import EChartLineComponent from "./eChartsMultipleSeries/multiple-series-line-chart"
import EBarChartComponent from "./eChartsMultipleSeries/multiple-series-bar-chart";
import EChartAreaComponent from "./eChartsMultipleSeries/area-chart";
import EChartAreaOccupancyComponent from "./eChartsMultipleSeries/area-chart-occupancy";
// import { getMeanOfDifferentDays } from "../streaming-average/get-streaming-avarage"
import TemperatureCard from "./components/temperature-card";
import Humiditycard from "./components/Humidity-card";
import EnergyUasgeCard from "./components/energy-uasge-card";
import OccupancyCard from "./components/occupancy-card";
import OverviewTab from "./components/overview-tab";
import AnalyzeDialog from "./components/analyze-dialog";
import React from "react";
import { analyzeChart } from "./components/analyze-chart";
//import { energyUsageLiveDatafunction } from "../(dashboard)/components/liveData"

const generateOccupancyData = () => {
  const data = [];
  const now = new Date();

  for (let i = 9; i >= 0; i--) {
    const hour = (now.getHours() - i + 24) % 24;

    data.push({
      time: `${hour}:00`,
      occupancy:
        hour >= 8 && hour <= 18
          ? Math.floor(Math.random() * 50) + 30
          : Math.floor(Math.random() * 10),
    });
  }

  return data;
};

export default function DashboardPage() {
  const [occupancyData, setOccupancyData] = useState(generateOccupancyData());

  const energyDistributiondata = [
    { name: "HVAC", value: 45 },
    { name: "Lighting", value: 25 },
    { name: "Equipment", value: 20 },
    { name: "Other", value: 10 },
  ];

  const chartOptionForAreaChartForEnergyDistribution = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Value"],
      top: "bottom",
    },
    xAxis: {
      type: "category",
      data: energyDistributiondata.map((item) => item.name), // Use 'name' as x-axis labels
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Value",
        type: "line",
        areaStyle: {}, // This is what makes it an area chart
        data: energyDistributiondata.map((item) => item.value),
        itemStyle: {
          color: "rgba(136, 132, 216, 0.5)", // Semi-transparent color for the area
        },
        lineStyle: {
          color: "#8884d8", // Color for the line
        },
      },
    ],
  };
  const chartOptionForOccupancyData = {
    tooltip: {
      trigger: "axis", // Trigger tooltip on axis hover
    },
    xAxis: {
      type: "category",
      data: occupancyData.map((item) => item.time), // Using 'time' as x-axis labels
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Occupancy (%)",
        type: "line",
        data: occupancyData.map((item) => item.occupancy),
        areaStyle: {}, // This makes it an area chart
        lineStyle: {
          color: "#8884d8", // Line color
        },
        itemStyle: {
          color: "rgba(136, 132, 216, 0.5)", // Semi-transparent fill for the area
        },
        smooth: true, // Smooth line like 'monotone'
      },
    ],
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [analyzeData, setAnalyzeData] = useState<any[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const handleAnalyzeClick = async () => {
    // Perform analysis based on the selected chart type
    setIsDisabled(true);
    const analyze = await analyzeChart(["Fan Power meter (KW)"]);
    setAnalyzeData(analyze);
    setIsDialogOpen(true);
    setIsDisabled(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Building Management Dashboard
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {/* <span>
            {mounted ? currentTime : "Loading..."}
          </span> */}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <TemperatureCard />
        <Humiditycard />
        <EnergyUasgeCard />
        <OccupancyCard />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full overflow-x-auto flex flex-nowrap sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="systems">Systems</TabsTrigger>
        </TabsList>

        <OverviewTab />

        {/* Energy Tab */}
        <TabsContent value="energy" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Energy Consumption Chart */}
            <Card className="col-span-full">
              <CardHeader>
                <div className="flex justify-between items-start w-full">
                  {/* Left Side: Title and Description */}
                  <div>
                    <CardTitle>Energy Consumption (Weekly)</CardTitle>
                    <CardDescription>
                      Building energy usage by category
                    </CardDescription>
                  </div>

                  {/* Right Side: Button */}
                  <Button
                    type="button"
                    className="rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={handleAnalyzeClick}
                    disabled={isDisabled}
                  >
                    {isDisabled ? (
                      <span className="animate-pulse">Analyzing</span>
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {/* <BarChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hvac" stackId="a" fill="#8884d8" name="HVAC" />
                    <Bar dataKey="lighting" stackId="a" fill="#82ca9d" name="Lighting" />
                    <Bar dataKey="equipment" stackId="a" fill="#ffc658" name="Equipment" />
                  </BarChart> */}
                  <EBarChartComponent />
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Energy Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Distribution</CardTitle>
                <CardDescription>
                  Current energy usage by system
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {/* <AreaChart data={[
                    { name: 'HVAC', value: 45 },
                    { name: 'Lighting', value: 25 },
                    { name: 'Equipment', value: 20 },
                    { name: 'Other', value: 10 },
                  ]}> 
                  
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                    />
                  </AreaChart> */}
                  <EChartAreaComponent />
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Energy Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Efficiency</CardTitle>
                <CardDescription>
                  Performance metrics and targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        HVAC Efficiency
                      </span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Lighting Efficiency
                      </span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Overall Energy Rating
                      </span>
                      <span className="text-sm font-medium">B+</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <AnalyzeDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          analyzeData={analyzeData}
        />
        {/* Occupancy Tab */}
        <TabsContent value="occupancy" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Occupancy Chart */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Building Occupancy (Today)</CardTitle>
                <CardDescription>Real-time occupancy tracking</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <EChartAreaOccupancyComponent
                    occupancyData={occupancyData}
                    configurationObj={chartOptionForOccupancyData}
                  />
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Zone Occupancy */}
            <Card>
              <CardHeader>
                <CardTitle>Zone Occupancy</CardTitle>
                <CardDescription>
                  Current occupancy by building zone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Zone A (Offices)
                      </span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5"></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Zone B (Meeting Rooms)
                      </span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: "42%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Zone C (Common Areas)
                      </span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: "28%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Zone D (Technical)
                      </span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: "15%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Occupancy Trends</CardTitle>
                <CardDescription>
                  Weekly patterns and predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Peak Hours</span>
                    <span className="text-sm">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Average Daily Occupancy
                    </span>
                    <span className="text-sm">47%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Weekly Trend</span>
                    <span className="text-sm text-green-500">+5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Predicted Tomorrow
                    </span>
                    <span className="text-sm">52%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Systems Tab */}
        <TabsContent value="systems" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* HVAC System */}
            <Card>
              <CardHeader>
                <CardTitle>HVAC System</CardTitle>
                <CardDescription>
                  Heating, ventilation, and air conditioning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <div className="flex items-center gap-1 text-green-500">
                      <Check className="h-4 w-4" />
                      <span>Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Mode</span>
                    <span>Cooling</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Set Temperature</span>
                    <span>22.0°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Fan Speed</span>
                    <span>Auto</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Filter Status</span>
                    <span className="text-amber-500">Replace Soon</span>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full">Adjust Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lighting System */}
            <Card>
              <CardHeader>
                <CardTitle>Lighting System</CardTitle>
                <CardDescription>Building lighting controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <div className="flex items-center gap-1 text-green-500">
                      <Check className="h-4 w-4" />
                      <span>Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Mode</span>
                    <span>Auto (Occupancy Sensing)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Brightness</span>
                    <span>75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Energy Saving</span>
                    <span className="text-green-500">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Schedule</span>
                    <span>6:00 AM - 8:00 PM</span>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full">Adjust Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security System */}
            <Card>
              <CardHeader>
                <CardTitle>Security System</CardTitle>
                <CardDescription>
                  Access control and surveillance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <div className="flex items-center gap-1 text-green-500">
                      <Check className="h-4 w-4" />
                      <span>Armed</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Access Points</span>
                    <span>12/12 Secured</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cameras</span>
                    <span>24/24 Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Last Event</span>
                    <span>Door Access (10:42 AM)</span>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full">View Security Panel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fire Alarm System */}
            <Card>
              <CardHeader>
                <CardTitle>Fire Alarm System</CardTitle>
                <CardDescription>
                  Fire detection and suppression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Maintenance Required</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Detectors</span>
                    <span>48/50 Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Sprinklers</span>
                    <span>All Operational</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Last Test</span>
                    <span className="text-amber-500">45 days ago</span>
                  </div>
                  <div className="pt-2">
                    <Button className="w-full">Schedule Maintenance</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
