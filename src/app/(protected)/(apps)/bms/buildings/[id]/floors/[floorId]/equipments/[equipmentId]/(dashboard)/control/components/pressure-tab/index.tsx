"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import TemperatureChart from "../charts/temperature-chart"
import PressureControl from "./pressure-control"
import ZoneControl from "./zone-control"
import PressureChart from "../charts/pressure-chart"
import { ResponsiveContainer } from "recharts"
import { Maximize, Minimize } from "lucide-react"
import { useState } from "react"

export default function PressureTab() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };
    const [chartType, setChartType] = useState('line');
    const handleChartChange = (e: any) => {
        const selectedType = e.target.value;
        setChartType(selectedType);
    };
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <PressureControl />
            <ZoneControl />

            {/* <Card className="md:col-span-2">
                <PressureChart />
            </Card> */}
            <Card
                className={`col-span-full lg:col-span-2 duration-0 ${isFullscreen
                    ? "fixed inset-0 z-50 bg-white dark:bg-gray-900 p-6 overflow-auto rounded-none shadow-lg"
                    : ""
                    }`}
            >
                <CardHeader className="relative space-y-2 p-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">
                            SA Pressure setpoint
                            </CardTitle>
                            {/* <CardDescription className="text-sm text-muted-foreground">
                                Real-time monitoring of building conditions
                            </CardDescription> */}
                        </div>

                        {/* Right-side controls: chart type selector + fullscreen toggle */}
                        <div className="flex items-center space-x-2 mt-1">
                            <label htmlFor="chartType" className="sr-only">
                                Select chart type
                            </label>
                            <select
                                id="chartType"
                                className="border border-input rounded-md p-1 text-sm bg-background"
                                onChange={handleChartChange}

                            >
                                <option value="line">Line</option>
                                <option value="bar">Bar</option>
                                {/* <option value="area">Area</option>
                    <option value="pie">Pie</option> */}
                            </select>
                            {/* Fullscreen Toggle Button */}
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                                aria-label={
                                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                                }
                            >
                                {isFullscreen ? (
                                    <Minimize size={18} />
                                ) : (
                                    <Maximize size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent
                    className={`m-0 p-0 ${isFullscreen ? "h-[700px]" : "350px"}`}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PressureChart chartType={chartType}/>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}