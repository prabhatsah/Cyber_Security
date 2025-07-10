"use client"

import { useState, useEffect } from "react"
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
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts"
import { 
  Brain, 
  Cpu, 
  BarChart, 
  AlertTriangle, 
  Settings, 
  Zap, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  LineChart as Analytics
} from "lucide-react"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Switch } from "@/shadcn/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog"
import { Skeleton } from "@/shadcn/ui/skeleton"
import EChartComponentPredectiveAccuracy from "./charts/predective-accuracy"
import EChartComponentAnamolyDistribution from "./charts/anamoly-distribution"
import EChartPieComponent from "./charts/anamoly-distribution"
import EChartComponentPredection from "./charts/prediction_charts"
import { min } from "date-fns"
import {
  getMyInstancesV2,
  getParameterizedDataForTaskId,
  mapProcessName,
} from "@/ikon/utils/api/processRuntimeService";
import ReactMarkdown from 'react-markdown'
import CO2AnomalyChart from "./charts/co2-anomaly-chart"
import EnergyFeatureImportance from './charts/energy_feature_importance';

//export async function getPredictedSATemp(param: ParamType) {
export async function getPredictedSATemp() {
  const data = await getMyInstancesV2({
    processName: "Schedule Forecast Result",
  });

  /* const taskId = data[0].taskId;

  const parameters: any = {
    limit: param.dataCount ? param.dataCount : null,
    service_name: param.service_name ? param.service_name : null,
    serviceNameList: param.serviceNameList ? param.serviceNameList : null,
    startDate: param.startDate ? param.startDate : null,
    endDate: param.endDate ? param.endDate : null,
    timePeriod: param.timePeriod ? param.timePeriod : null, //in seconds
  };

  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });

  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : []; */
  try{
    let inCommingData = data && data[0].data ? data[0].data.response : [];
    return inCommingData;
  }
  catch(error){
    console.error("Error fetching data:", error);
    return []; // or handle the error as needed
  }
  
}

export async function getPredictedSAPressure() {
  const data = await getMyInstancesV2({
    processName: "Schedule Forecast Result",
  });

  /* const taskId = data[0].taskId;

  const parameters: any = {
    limit: param.dataCount ? param.dataCount : null,
    service_name: param.service_name ? param.service_name : null,
    serviceNameList: param.serviceNameList ? param.serviceNameList : null,
    startDate: param.startDate ? param.startDate : null,
    endDate: param.endDate ? param.endDate : null,
    timePeriod: param.timePeriod ? param.timePeriod : null, //in seconds
  };

  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });

  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : []; */
  try{
    let inCommingData = data && data[0].data ? data[0].data.saPressurePrediction : [];
    return inCommingData;
  }
  catch(error){
    console.error("Error fetching data:", error);
    return []; // or handle the error as needed
  }
  
}

export async function getPredictedFanPower() {
  const data = await getMyInstancesV2({
    processName: "Schedule Forecast Result",
  });

  /* const taskId = data[0].taskId;

  const parameters: any = {
    limit: param.dataCount ? param.dataCount : null,
    service_name: param.service_name ? param.service_name : null,
    serviceNameList: param.serviceNameList ? param.serviceNameList : null,
    startDate: param.startDate ? param.startDate : null,
    endDate: param.endDate ? param.endDate : null,
    timePeriod: param.timePeriod ? param.timePeriod : null, //in seconds
  };

  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });

  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : []; */
  try{
    let inCommingData = data && data[0].data ? data[0].data.fanEnergyPrediction : [];
    return inCommingData;
  }
  catch(error){
    console.error("Error fetching data:", error);
    return []; // or handle the error as needed
  }
  
}

export async function getAnomalyAnalysis(analysis_data:any,type:string) {
  const data = await getMyInstancesV2({
    processName: "AI Based Analysis",
  });

  const taskId = data[0].taskId;
  //analysis_data = analysis_data.slice(0,1000); // Limit the data to 1000 records

  const parameters: any = {
    analysis_data: JSON.stringify(analysis_data),
    type: type
  };

  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });

  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : [];
}

export async function getAllPredictionAnalysis(prediction_data:any, type:string) {
  const data = await getMyInstancesV2({
    processName: "AI Based Analysis",
  });

  const taskId = data[0].taskId;
  //analysis_data = analysis_data.slice(0,1000); // Limit the data to 1000 records

  const parameters: any = {
    analysis_data: JSON.stringify(prediction_data),
    type: type
  };

  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });

  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : [];
}

export async function getAnomalyData(co2_data:any, type:string) {
  const data = await getMyInstancesV2({
    processName: " AI Based Anomaly",
  });

  const taskId = data[0].taskId;
  //analysis_data = analysis_data.slice(0,1000); // Limit the data to 1000 records

  const parameters: any = {
    analysis_data: JSON.stringify(co2_data),
    type: type
  };

  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });

  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : [];
}

// Mock data for prediction accuracy
const accuracyData = [
  { month: "Jan", accuracy: 92 },
  { month: "Feb", accuracy: 93 },
  { month: "Mar", accuracy: 94 },
  { month: "Apr", accuracy: 91 },
  { month: "May", accuracy: 95 },
  { month: "Jun", accuracy: 97 },
  { month: "Jul", accuracy: 96 },
  { month: "Aug", accuracy: 94 },
  { month: "Sep", accuracy: 93 },
  { month: "Oct", accuracy: 95 },
  { month: "Nov", accuracy: 96 },
  { month: "Dec", accuracy: 98 },
]


// Mock data for energy savings
const energySavingsData = [
  { month: "Jan", actual: 120, predicted: 140 },
  { month: "Feb", actual: 115, predicted: 125 },
  { month: "Mar", actual: 130, predicted: 140 },
  { month: "Apr", actual: 135, predicted: 145 },
  { month: "May", actual: 145, predicted: 155 },
  { month: "Jun", actual: 160, predicted: 170 },
  { month: "Jul", actual: 170, predicted: 185 },
  { month: "Aug", actual: 165, predicted: 175 },
  { month: "Sep", actual: 150, predicted: 160 },
  { month: "Oct", actual: 140, predicted: 150 },
  { month: "Nov", actual: 130, predicted: 140 },
  { month: "Dec", actual: 125, predicted: 135 },
]

// Mock data for device health predictions
const deviceHealthData = [
  { 
    id: 1, 
    name: "AHU-01", 
    type: "HVAC",
    health: 92, 
    prediction: "Normal operation for next 30 days",
    maintenance: "Scheduled in 45 days",
    confidence: "high"
  },
  { 
    id: 2, 
    name: "Chiller-02", 
    type: "HVAC",
    health: 78, 
    prediction: "Potential issue in 15-20 days",
    maintenance: "Recommended within 10 days",
    confidence: "medium"
  },
  { 
    id: 3, 
    name: "Pump-03", 
    type: "Water",
    health: 65, 
    prediction: "Failure likely within 7 days",
    maintenance: "Immediate attention required",
    confidence: "high"
  },
  { 
    id: 4, 
    name: "VAV-12", 
    type: "HVAC",
    health: 88, 
    prediction: "Normal operation for next 30 days",
    maintenance: "Scheduled in 30 days",
    confidence: "high"
  },
  { 
    id: 5, 
    name: "Lighting Panel A", 
    type: "Electrical",
    health: 95, 
    prediction: "Normal operation for next 60 days",
    maintenance: "No maintenance required",
    confidence: "high"
  },
  { 
    id: 6, 
    name: "Elevator-01", 
    type: "Transport",
    health: 82, 
    prediction: "Potential issue in 25-30 days",
    maintenance: "Scheduled in 20 days",
    confidence: "medium"
  },
  { 
    id: 7, 
    name: "Fire Panel", 
    type: "Safety",
    health: 97, 
    prediction: "Normal operation for next 90 days",
    maintenance: "Regulatory check in 60 days",
    confidence: "high"
  },
  { 
    id: 8, 
    name: "Boiler-01", 
    type: "HVAC",
    health: 72, 
    prediction: "Efficiency decreasing, issue in 20-25 days",
    maintenance: "Recommended within 15 days",
    confidence: "medium"
  },
]

// Mock data for sensors
const initialSensorsData = [
  {
    id: 1,
    name: "Temperature Sensor 1",
    type: "temperature",
    location: "Server Room",
    value: 23.5,
    unit: "°C",
    min: 10,
    max: 40,
    threshold: 28,
    status: "normal",
    icon: Thermometer
  },
  {
    id: 2,
    name: "Humidity Sensor 1",
    type: "humidity",
    location: "Server Room",
    value: 45,
    unit: "%",
    min: 20,
    max: 80,
    threshold: 70,
    status: "normal",
    icon: Droplets
  },
  {
    id: 3,
    name: "Pressure Sensor 1",
    type: "pressure",
    location: "HVAC System",
    value: 101.3,
    unit: "kPa",
    min: 95,
    max: 105,
    threshold: 103,
    status: "normal",
    icon: Gauge
  },
  {
    id: 4,
    name: "Air Flow Sensor 1",
    type: "airflow",
    location: "Ventilation Duct",
    value: 12.8,
    unit: "m³/min",
    min: 5,
    max: 25,
    threshold: 8,
    status: "normal",
    icon: Wind
  }
]

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];


// ECharts options for the Line Chart
const configObjPredectiveAccuracy = {
  tooltip: {
    trigger: 'axis', // Tooltip triggered on axis hover
  },
  legend: {
    data: ['Accuracy (%)'],
    top: 'bottom', // Position the legend at the top
  },
  xAxis: {
    type: 'category',
    data: accuracyData.map(item => item.month), // Use 'month' as x-axis labels
  },
  yAxis: {
    type: 'value',
    min: 85, // Set the minimum value for Y-axis (accuracy %)
    max: 100, // Set the maximum value for Y-axis (accuracy %)
    axisLabel: { formatter: '{value}%' },
  },
  series: [
    {
      name: 'Accuracy (%)',
      type: 'line',
      data: accuracyData.map(item => item.accuracy),
      lineStyle: { color: '#8884d8' }, // Color for accuracy line
      symbolSize: 8, // Active dot size
      smooth: true, // Smooth line
    },
  ],
};

const configObjPredict_old = {
  
  tooltip: {
    trigger: 'axis', // Tooltip triggered on axis hover
  },
  legend: {
    data: ['Prediction (%)'],
    top: 'bottom', // Position the legend at the top
  },
  xAxis: {
    type: 'category',
    //data: predictionData.map(item => item.timestamp), // Use 'month' as x-axis labels
  },
 /* yAxis: {
    type: 'value',
    //min: 0, // Set the minimum value for Y-axis (accuracy %)
    //max: 100, // Set the maximum value for Y-axis (accuracy %)
    axisLabel: { formatter: '{value} KW' },
  },*/
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: function (value) {
        return value.toFixed(2) + ' KW'; // Format to 2 decimal places and append 'KW'
      },
    },
  },
  series: [
    {
      name: 'Prediction (%)',
      type: 'line',
      //data: predictionData.map(item => item.prediction),
      lineStyle: { color: '#8884d8' }, // Color for accuracy line
      symbolSize: 8, // Active dot size
      smooth: true, // Smooth line
    },
  ],
};

const configObjPredict = {
  // Add a title for the chart
  title: {
    text: 'Prediction over Time',
    left: 'center', // Center-align the title
    textStyle: {
      color: '#fff', // Ensure the title is visible on a dark background
    },
  },

  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      // Format tooltip values to 4 decimal places
      return `${params[0].name}: ${params[0].value.toFixed(4)} KW`;
    },
  },

  legend: {
    data: ['Prediction (KW)'],
    top: 'bottom',
    textStyle: {
      color: '#fff', // Ensure legend text is visible on a dark background
    },
  },

  xAxis: {
    type: 'category',
    //data: predictionData.map(item => item.timestamp),
    axisLabel: {
      // Format x-axis labels to human-readable timestamps
      formatter: function (value: string) {
        const date = new Date(value);
        const options = { hour: 'numeric' as const, minute: 'numeric' as const, hour12: true };
        return date.toLocaleString('en-US', options);
      },
    },
  },

  yAxis: {
    type: 'value',
    //min: Math.min(...predictionData.map(item => item.prediction)).toFixed(4), // Set the minimum value for Y-axis (accuracy %)
    //max: Math.max(...predictionData.map(item => item.prediction)).toFixed(4), // Set the maximum value for Y-axis (accuracy %)
    axisLabel: {
      // Format y-axis labels to 4 decimal places
      formatter: function (value : number) {
        return value.toFixed(4);
      },
    },
  },
  series: [
    {
      name: 'Prediction (KW)',
      type: 'line',
      //data: predictionData.map(item => item.prediction),
      lineStyle: { color: '#8884d8' }, // Line color
      symbolSize: 8, // Active dot size
      smooth: true, // Smooth line
    },
  ],
};


export default function PredictivePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("all")
  const [healthFilter, setHealthFilter] = useState("all")
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [aiModel, setAiModel] = useState("hybrid")
  const [updateFrequency, setUpdateFrequency] = useState("daily")
  const [confidenceThreshold, setConfidenceThreshold] = useState("medium")
  const [useHistoricalData, setUseHistoricalData] = useState(true)
  const [useSensorData, setUseSensorData] = useState(true)
  const [useWeatherData, setUseWeatherData] = useState(true)
  const [useOccupancyData, setUseOccupancyData] = useState(true)
  const [sensorsData, setSensorsData] = useState(initialSensorsData)
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [supplyAirTempPrediction, setSupplyAirTempPrediction] = useState([]);
  const [supplyAirPressurePrediction, setSupplyAirPressurePrediction] = useState([]);
  const [fanPowerPrediction, setFanPowerPrediction] = useState([]);
  const [anomalyData, setAnomalyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [isAnomalyModalOpen, setIsAnomalyModalOpen] = useState(false);
 const [isAnomalyLoading, setIsAnomalyLoading] = useState(false);
 const [predictiveAnalysisContent, setPredictiveAnalysisContent] = useState([]);
 const [anomalyAnalysisContent, setAnomalyAnalysisContent] = useState('');

  useEffect(() => {
    async function fetchPredictionData() {
      try {
        const data = await getPredictedSATemp();
        console.log("supplyAirTempPrediction", data);
        setSupplyAirTempPrediction(data);
      } catch (error) {
        console.error("Error fetching prediction data:", error);
        setSupplyAirTempPrediction([]);
      }

      try {
        const data = await getPredictedSAPressure();
        console.log("supplyAirPressurePrediction", data);
        setSupplyAirPressurePrediction(data);
      } catch (error) {
        console.error("Error fetching prediction data:", error);
        setSupplyAirPressurePrediction([]);
      }

      try {
        const data = await getPredictedFanPower();
        console.log("fanPowerPrediction", data);
        setFanPowerPrediction(data);
      } catch (error) {
        console.error("Error fetching prediction data:", error);
        setFanPowerPrediction([]);
      }

      try {
        // Dynamically import the JSON file
       // debugger;
        /* const data = await import('./charts/co2_anomaly_results.json');
        console.log("Anomaly data:", data.default); */
        let co2_data = [
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:25:53.758 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:25:38.948 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:25:19.206 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:24:52.998 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:24:43.540 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:24:12.601 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:23:58.510 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:23:35.145 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:23:16.609 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:22:58.943 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:22:30.898 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:22:17.924 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:21:55.007 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:21:43.187 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:21:23.531 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:20:53.645 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:20:35.696 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:20:17.885 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:19:58.143 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1231.3585205078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:19:35.524 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:19:22.520 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:18:57.674 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1231.3585205078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:18:35.666 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:18:15.715 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:17:54.222 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:17:37.940 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:17:19.181 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:16:53.537 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:16:38.558 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:16:11.577 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:16:03.737 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1322.02099609375",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:15:34.962 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:15:17.040 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:14:54.421 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:14:34.792 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:14:13.847 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:13:55.505 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:13:38.702 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:13:14.860 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:12:56.009 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:12:43.337 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:12:23.675 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:11:59.953 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:11:38.343 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:11:15.321 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:10:55.353 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:10:37.377 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:10:13.902 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:10:01.597 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1322.02099609375",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:09:42.921 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:09:24.434 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:09:01.628 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:08:32.735 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:08:14.788 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:07:53.899 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:07:39.467 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:07:19.194 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:07:00.344 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:06:33.316 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:06:18.761 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:05:56.549 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:05:38.744 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:05:15.917 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:04:54.832 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:04:41.001 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "901.6434326171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:04:29.296 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:03:54.409 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:03:37.573 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:03:16.746 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:02:57.736 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1231.3585205078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:02:41.887 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:02:17.986 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:01:57.162 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:01:43.485 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "914.6830444335938",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:01:19.790 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:00:51.915 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:00:33.967 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T12:00:16.210 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:59:56.135 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:59:34.256 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:59:17.361 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:58:59.321 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:58:35.853 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:58:16.496 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:57:54.536 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:57:32.610 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:57:13.665 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:57:02.253 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1292.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:56:35.804 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:56:19.498 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:55:59.639 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:55:44.914 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:55:16.059 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:54:58.069 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:54:36.093 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:54:15.114 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:53:58.180 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:53:34.240 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:53:18.385 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1422.9434814453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:53:02.700 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:52:39.009 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "900",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:52:21.189 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:51:54.274 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:51:38.292 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:51:15.384 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:50:53.384 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:50:35.476 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:50:18.650 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:49:57.765 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1231.3585205078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:49:33.783 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:49:14.823 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:49:01.157 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:48:39.272 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:48:16.391 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:48:01.530 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:47:37.602 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:47:14.609 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:46:54.151 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:46:40.362 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:46:19.556 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:45:57.658 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:45:37.686 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:45:13.750 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:44:52.298 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:44:35.044 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:44:16.537 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:43:57.178 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:43:33.636 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:43:20.301 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:42:59.537 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:42:35.622 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:42:17.655 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:41:59.075 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:41:40.081 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:41:18.277 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:41:00.582 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:40:36.736 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:40:24.121 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1376.3355712890625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:39:52.156 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:39:43.420 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:39:17.578 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:38:57.007 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:38:35.026 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:38:18.035 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:37:55.132 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:37:40.243 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "925.9363403320312",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:37:23.431 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:36:56.071 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:36:34.114 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:36:17.199 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:35:55.423 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:35:34.484 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:35:16.608 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:34:56.894 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:34:36.971 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:34:18.990 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:33:55.920 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:33:36.962 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:33:21.119 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:32:54.184 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:32:39.389 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:32:17.544 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:31:54.540 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:31:34.483 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:31:14.487 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:30:52.503 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:30:39.912 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:30:11.247 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:29:58.974 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1292.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:29:34.166 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:29:18.378 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:28:52.385 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:28:32.299 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:28:18.289 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:27:59.447 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:27:39.046 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:27:26.861 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:27:01.985 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:26:39.173 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:26:23.418 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:25:58.812 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1231.3585205078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:25:34.832 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:25:17.961 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:24:52.964 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:24:31.911 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:24:13.889 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:23:52.980 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:23:40.160 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:23:13.272 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:23:00.434 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1262.37353515625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:22:33.769 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:22:17.765 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:22:01.990 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1292.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:21:38.192 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:21:14.295 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:21:04.420 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1292.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:20:41.697 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:20:15.750 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1459.8076171875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:20:04.960 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:19:39.257 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "940.1923828125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:19:16.370 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1400.7391357421875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:18:56.422 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:18:32.853 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:18:16.782 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:17:50.875 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:17:36.693 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:17:16.638 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1474.0635986328125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:16:57.821 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1137.6265869140625",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:16:33.819 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:16:15.864 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:15:55.000 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1200",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:15:35.058 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "977.0565795898438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:15:21.315 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1442.705078125",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:14:58.010 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1168.6414794921875",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:14:39.834 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "957.2948608398438",
              "object_type": "analogValue",
              "units": "noUnits"
          },
          {
              "device_id": "170101",
              "protocol": "Bacnet",
              "service_name": "RA CO2",
              "data_received_on": "2025-04-16T11:14:21.112 UTC",
              "client_id": "5e56d920-0e11-455b-8095-59ff509309a1",
              "ip": "192.168.170.101",
              "monitoring_data": "1485.31689453125",
              "object_type": "analogValue",
              "units": "noUnits"
          }
      ];
        const data = await getAnomalyData(co2_data, "co2_anomaly_analysis");

       // setAnomalyData(data.default);
       if(data && data.results) {
         setAnomalyData(data.results);
        }
        else{
          setAnomalyData([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading anomaly data:', error);
        setIsLoading(false);
      }
    }

    
    
    fetchPredictionData();
  }, []);
  
  // Filter devices based on search and filters
  const filteredDevices = deviceHealthData.filter(device => {
    // Search filter
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.prediction.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Device type filter
    const matchesType = deviceTypeFilter === "all" || device.type === deviceTypeFilter
    
    // Health filter
    const matchesHealth = healthFilter === "all" || 
                         (healthFilter === "good" && device.health >= 85) ||
                         (healthFilter === "warning" && device.health >= 70 && device.health < 85) ||
                         (healthFilter === "critical" && device.health < 70)
    
    return matchesSearch && matchesType && matchesHealth
  })

  // Get unique device types for filter dropdown
  const deviceTypes = [...new Set(deviceHealthData.map(device => device.type))]

  // Handle threshold change
  const handleThresholdChange = (value) => {
    if (selectedSensor) {
      setSelectedSensor({
        ...selectedSensor,
        threshold: value[0]
      })
    }
  }

  // Simulate live sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorsData(prevData => 
        prevData.map(sensor => {
          // Generate a random fluctuation
          const fluctuation = (Math.random() * 2 - 1) * (sensor.max - sensor.min) * 0.02
          let newValue = sensor.value + fluctuation
          
          // Keep within min/max bounds
          newValue = Math.max(sensor.min, Math.min(newValue, sensor.max))
          
          // Determine status based on threshold
          const status = newValue > sensor.threshold ? "alert" : "normal"
          
          return {
            ...sensor,
            value: Number.parseFloat(newValue.toFixed(1)),
            status
          }
        })
      )
    }, 3000) // Update every 3 seconds
    
    return () => clearInterval(interval)
  }, [])

  // Format sensor data for gauge charts
  const formatSensorDataForGauge = (sensor) => {
    const percentage = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100
    return [
      {
        name: sensor.name,
        value: percentage,
        fill: sensor.status === "alert" ? "#ef4444" : "#3b82f6"
      }
    ]
  }



  const handleOpenAnalysisModal = async () => {
    setIsAnalysisModalOpen(true)
    setIsAnalysisLoading(true)
    const findlPred = {
      "sa_temperature_prediction": supplyAirTempPrediction,
      "saPressurePrediction": supplyAirPressurePrediction,
      "fanEnergyPrediction": fanPowerPrediction
    }
    // Simulate loading delay
    const queryResponse = await getAllPredictionAnalysis(findlPred,"all_prediction_analysis");
    console.log("queryResponse", queryResponse.response.data);
    setPredictiveAnalysisContent(queryResponse.response.data);
    setIsAnalysisLoading(false)
  }

  const handleAnomalyAnalysis = async () => {
    setIsAnomalyModalOpen(true)
    setIsAnomalyLoading(true)
    // Simulate loading delay
    const queryResponse = await getAnomalyAnalysis(anomalyData,"co2_anomaly_analysis");
    console.log("queryResponse", queryResponse.response.data);
    setAnomalyAnalysisContent(queryResponse.response.data);
    setIsAnomalyLoading(false)
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Predictive Analysis & AI-Ops</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Configure</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>AI Configuration</DialogTitle>
                <DialogDescription>
                  Configure the AI predictive analysis engine settings
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-model">AI Model Type</Label>
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger id="ai-model">
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statistical">Statistical Analysis</SelectItem>
                      <SelectItem value="machine-learning">Machine Learning</SelectItem>
                      <SelectItem value="hybrid">Hybrid Model</SelectItem>
                      <SelectItem value="deep-learning">Deep Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-frequency">Update Frequency</Label>
                  <Select value={updateFrequency} onValueChange={setUpdateFrequency}>
                    <SelectTrigger id="update-frequency">
                      <SelectValue placeholder="Select update frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                  <Select value={confidenceThreshold} onValueChange={setConfidenceThreshold}>
                    <SelectTrigger id="confidence-threshold">
                      <SelectValue placeholder="Select confidence threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (More Predictions)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Higher Accuracy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label>Data Sources</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="historical-data" className="text-sm">Historical Data</Label>
                      <Switch 
                        id="historical-data" 
                        checked={useHistoricalData} 
                        onCheckedChange={setUseHistoricalData} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sensor-data" className="text-sm">Real-time Sensor Data</Label>
                      <Switch 
                        id="sensor-data" 
                        checked={useSensorData} 
                        onCheckedChange={setUseSensorData} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weather-data" className="text-sm">Weather Data</Label>
                      <Switch 
                        id="weather-data" 
                        checked={useWeatherData} 
                        onCheckedChange={setUseWeatherData} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="occupancy-data" className="text-sm">Occupancy Data</Label>
                      <Switch 
                        id="occupancy-data" 
                        checked={useOccupancyData} 
                        onCheckedChange={setUseOccupancyData} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="devices">Device Health</TabsTrigger>
          <TabsTrigger value="energy">Energy Optimization</TabsTrigger>
          <TabsTrigger value="sensors">Live Sensors</TabsTrigger>
          {/* <TabsTrigger value="settings">AI Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">AI Model Status</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Active</div>
                <p className="text-xs text-muted-foreground">
                  Last trained: 2 days ago
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                <p className="text-xs text-muted-foreground">
                  +2.3% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Predicted Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">3</div>
                <p className="text-xs text-muted-foreground">
                  Within next 30 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Energy Savings</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">12.4%</div>
                <p className="text-xs text-muted-foreground">
                  Through predictive optimization
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Prediction Accuracy Trend</CardTitle>
                <CardDescription>
                  AI model prediction accuracy over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {/* <LineChart data={accuracyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#8884d8" 
                      name="Accuracy (%)"
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart> */}

                < EChartComponentPredectiveAccuracy accuracyData={accuracyData} configurationObj={configObjPredectiveAccuracy}/>

                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Predicted Issues</CardTitle>
                <CardDescription>
                  Maintenance issues predicted by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceHealthData
                    .filter(device => device.health < 85)
                    .sort((a, b) => a.health - b.health)
                    .slice(0, 4)
                    .map((device, i) => (
                      <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 rounded-full p-1 ${
                            device.health < 70 
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" 
                              : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                          }`}>
                            {device.health < 70 ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.prediction}</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {device.health}%
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Predictions</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Distribution</CardTitle>
                <CardDescription>
                  Types of anomalies detected
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   {/* <PieChart>
                    <Pie
                      data={[
                        { name: "Temperature Anomalies", value: 12 },
                        { name: "Power Consumption", value: 8 },
                        { name: "Pressure Deviations", value: 5 },
                        { name: "Flow Rate Issues", value: 4 },
                        { name: "Vibration Anomalies", value: 3 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>  */}
                    <EChartPieComponent pieData={[
                        { name: "Temperature Anomalies", value: 12 },
                        { name: "Power Consumption", value: 8 },
                        { name: "Pressure Deviations", value: 5 },
                        { name: "Flow Rate Issues", value: 4 },
                        { name: "Vibration Anomalies", value: 3 },
                      ]} />
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Prediction Forecasts</h2>
            <Button 
              onClick={handleOpenAnalysisModal} 
              className="gap-2"
              variant="outline"
            >
              <Analytics className="h-4 w-4" />
              Analysis
            </Button>
          </div>
          <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Fan Power</CardTitle>
            <CardDescription>
              Energy Consumption
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <EChartComponentPredection accuracyData={fanPowerPrediction}  configurationObj={configObjPredict} label_unit={"Fan Power (KW)"}/>
            </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>SA Pressure</CardTitle>
              <CardDescription>
               Supply Air Pressure Prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <EChartComponentPredection accuracyData={supplyAirPressurePrediction}  configurationObj={configObjPredict} label_unit={"SA Pressure (Pa)"}/>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>SA Temperature</CardTitle>
              <CardDescription>
               Supply Air Temperature Prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <EChartComponentPredection accuracyData={supplyAirTempPrediction}  configurationObj={configObjPredict} label_unit={"SA Temp (°C)"}/>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Add analysis modal */}
          <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
            <DialogContent className="sm:max-w-[1200px] max-h-none overflow-hidden">
              <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
                <DialogTitle>Predictive Analysis Report</DialogTitle>
                <DialogDescription>
                  Detailed analysis of prediction trends and recommendations
                </DialogDescription>
              </DialogHeader>
              
              <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
                {isAnalysisLoading ? (
                  <div className="space-y-4 py-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-6 w-3/4 mt-8" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-6 w-3/4 mt-8" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <div className="prose dark:prose-invert max-w-none py-4">
                    <ReactMarkdown>{predictiveAnalysisContent}</ReactMarkdown>
                  </div>
                )}
              </div>
              
              <DialogFooter className="sticky bottom-0 bg-background pt-4 mt-4 border-t">
                <Button onClick={() => setIsAnalysisModalOpen(false)}>Close</Button>
                <Button variant="outline">
                  Download Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Anomaly Detection</h2>
        <Button 
         /*  onClick={() => {
            setIsAnomalyModalOpen(true);
            setIsAnomalyLoading(true);
            setTimeout(() => {
              setIsAnomalyLoading(false);
            }, 1500);
          }}  */
         onClick={handleAnomalyAnalysis}
          className="gap-2"
          variant="outline"
        >
          <AlertTriangle className="h-4 w-4" />
          View Analysis
        </Button>
      </div>
          <Card className="col-span-2">
          <CardHeader>
            <CardTitle>CO2 Anomaly</CardTitle>
            <CardDescription>
              CO2 Levels
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <CO2AnomalyChart 
               /*  normalData={[
                  [new Date('2025-03-20 00:00:00'), 500],
                  [new Date('2025-03-20 01:00:00'), 520],
                  [new Date('2025-03-20 02:00:00'), 510],
                  [new Date('2025-03-20 03:00:00'), 800],
                  [new Date('2025-03-20 04:00:00'), 1200],
                  [new Date('2025-03-20 05:00:00'), 530],
                  [new Date('2025-03-20 06:00:00'), 550],
                ]} */
                anomalyData={anomalyData}
                height="300px"
              />
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Anomaly Analysis Modal */}
  <Dialog open={isAnomalyModalOpen} onOpenChange={setIsAnomalyModalOpen}>
    <DialogContent className="sm:max-w-[1200px] max-h-none overflow-hidden">
      <DialogHeader className="sticky top-0 z-10 bg-background pb-4">
        <DialogTitle>CO2 Anomaly Analysis Report</DialogTitle>
        <DialogDescription>
          Detailed analysis of CO2 anomalies and recommendations
        </DialogDescription>
      </DialogHeader>
      
      <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
        {isAnomalyLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-3/4 mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-6 w-3/4 mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none py-4">
            <ReactMarkdown>{anomalyAnalysisContent}</ReactMarkdown>
          </div>
        )}
      </div>
      
      <DialogFooter className="sticky bottom-0 bg-background pt-4 mt-4 border-t">
        <Button onClick={() => setIsAnomalyModalOpen(false)}>Close</Button>
        <Button variant="outline">
          Download Report
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Device Health Monitoring</CardTitle>
              <CardDescription>
                AI-powered predictive maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {/* Search and filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search devices..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Device Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {deviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={healthFilter} onValueChange={setHealthFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Health" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Health</SelectItem>
                        <SelectItem value="good">Good (85%+)</SelectItem>
                        <SelectItem value="warning">Warning (70-84%)</SelectItem>
                        <SelectItem value="critical">Critical (&lt;70%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Devices list */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 border-b bg-muted/50 p-3 font-medium">
                    <div className="col-span-1">Health</div>
                    <div className="col-span-3">Device</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-4">Prediction</div>
                    <div className="col-span-2">Maintenance</div>
                  </div>
                  <div className="divide-y">
                    {filteredDevices.length > 0 ? (
                      filteredDevices.map((device) => (
                        <div key={device.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                          <div className="col-span-1">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              device.health >= 85 
                                ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200" 
                                : device.health >= 70
                                ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200"
                                : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200"
                            }`}>
                              {device.health}%
                            </div>
                          </div>
                          <div className="col-span-3 font-medium">{device.name}</div>
                          <div className="col-span-2">{device.type}</div>
                          <div className="col-span-4 text-sm">{device.prediction}</div>
                          <div className="col-span-2 text-sm">
                            <span className={
                              device.health < 70 
                                ? "text-red-500" 
                                : device.health < 85
                                ? "text-amber-500"
                                : "text-muted-foreground"
                            }>
                              {device.maintenance}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No devices match your filters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Optimization</CardTitle>
              <CardDescription>
                AI-driven energy efficiency recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={energySavingsData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#8884d8" 
                    name="Actual Usage (kWh)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#82ca9d" 
                    name="Predicted Usage without AI (kWh)"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Annual Energy Savings</span>
                  <span className="font-medium text-green-500">1,240 kWh (12.4%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cost Reduction</span>
                  <span className="font-medium text-green-500">$148.80 per year</span>
                </div>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Energy Feature Importances</CardTitle>
              <CardDescription>
                Key factors influencing energy consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
              <EnergyFeatureImportance />
              {/*<EnergyFeatureImportance data={yourFeatureData} />*/}
              </ResponsiveContainer>
            </CardContent>
           {/*  <CardFooter>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between"> 
                  <span className="font-medium">Top Feature</span>
                  <span className="font-medium text-green-500">HVAC System Efficiency</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Second Feature</span>
                  <span className="font-medium text-green-500">Occupancy Levels</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Third Feature</span>
                  <span className="font-medium text-green-500">External Temperature</span>
                </div>
              </div>
            </CardFooter> */}
          </Card>
        </TabsContent>

        <TabsContent value="sensors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Sensor Readings</CardTitle>
              <CardDescription>
                Real-time monitoring with threshold alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {sensorsData.map(sensor => (
                  <div 
                    key={sensor.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      sensor.status === "alert" ? "border-red-500 bg-red-50 dark:bg-red-950" : "hover:border-blue-500"
                    }`}
                    onClick={() => setSelectedSensor(sensor)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <sensor.icon className={`h-5 w-5 ${
                          sensor.status === "alert" ? "text-red-500" : "text-blue-500"
                        }`} />
                        <h3 className="font-medium">{sensor.name}</h3>
                      </div>
                      {sensor.status === "alert" && (
                        <div className="flex items-center gap-1 text-red-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">Alert</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="60%" 
                          outerRadius="80%" 
                          barSize={10} 
                          data={formatSensorDataForGauge(sensor)}
                          startAngle={180}
                          endAngle={0}
                        >
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                          />
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-bold text-lg"
                            fill={sensor.status === "alert" ? "#ef4444" : "#3b82f6"}
                          >
                            {sensor.value}
                          </text>
                          <text
                            x="50%"
                            y="65%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-xs"
                          >
                            {sensor.unit}
                          </text>
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Threshold: {sensor.threshold} {sensor.unit}</span>
                        <span className="text-muted-foreground">{sensor.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={!!selectedSensor} onOpenChange={() => setSelectedSensor(null)}>
            <DialogContent className="sm:max-w-[525px]">
              {selectedSensor && (
                <>
                  <DialogHeader>
                    <DialogTitle>Configure Sensor Threshold</DialogTitle>
                    <DialogDescription>
                      Set alert threshold for {selectedSensor.name} in {selectedSensor.location}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Current Reading</Label>
                        <span className="text-xl font-bold">
                          {selectedSensor.value} {selectedSensor.unit}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="threshold">Alert Threshold</Label>
                          <span className="font-medium">
                            {selectedSensor.threshold} {selectedSensor.unit}
                          </span>
                        </div>
                        <Slider
                          id="threshold"
                          min={selectedSensor.min}
                          max={selectedSensor.max}
                          step={(selectedSensor.max - selectedSensor.min) / 100}
                          value={[selectedSensor.threshold]}
                          onValueChange={handleThresholdChange}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{selectedSensor.min} {selectedSensor.unit}</span>
                          <span>{selectedSensor.max} {selectedSensor.unit}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alert-type">Alert Type</Label>
                        <Select defaultValue="both">
                          <SelectTrigger id="alert-type">
                            <SelectValue placeholder="Select alert type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="above">Above Threshold</SelectItem>
                            <SelectItem value="below">Below Threshold</SelectItem>
                            <SelectItem value="both">Both Directions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="enable-alerts">Enable Alerts</Label>
                          <Switch id="enable-alerts" defaultChecked />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Send notifications when threshold is crossed
                        </p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedSensor(null)}>Cancel</Button>
                    <Button>Save Threshold</Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sensor Alert History</CardTitle>
                <CardDescription>
                  Recent threshold violations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b pb-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-1 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200">
                        <Thermometer className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Temperature Sensor 1</p>
                        <p className="text-sm text-muted-foreground">Exceeded threshold (29.2°C) at 10:42 AM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="flex items-start justify-between border-b pb-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-1 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200">
                        <Droplets className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Humidity Sensor 1</p>
                        <p className="text-sm text-muted-foreground">Exceeded threshold (72%) at 08:15 AM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full p-1 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200">
                        <Wind className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Air Flow Sensor 1</p>
                        <p className="text-sm text-muted-foreground">Below threshold (4.8 m³/min) at Yesterday, 3:22 PM</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Alerts</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sensor Configuration</CardTitle>
                <CardDescription>
                  Manage sensor settings and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-mode">Alert Mode</Label>
                    <Select defaultValue="smart">
                      <SelectTrigger id="alert-mode">
                        <SelectValue placeholder="Select alert mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Thresholds</SelectItem>
                        <SelectItem value="smart">AI-Assisted Thresholds</SelectItem>
                        <SelectItem value="adaptive">Adaptive Thresholds</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      AI-Assisted mode uses predictive analytics to suggest optimal thresholds
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-method">Notification Method</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="notification-method">
                        <SelectValue placeholder="Select notification method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard Only</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="all">All Methods</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-adjust">Auto-Adjust Thresholds</Label>
                      <Switch id="auto-adjust" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automatically adjust thresholds based on historical patterns
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="data-logging">Data Logging</Label>
                      <Switch id="data-logging" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Store sensor readings for historical analysis
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply Configuration</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

       {/*  <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>
                Configure predictive analysis parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                AI settings configuration will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}