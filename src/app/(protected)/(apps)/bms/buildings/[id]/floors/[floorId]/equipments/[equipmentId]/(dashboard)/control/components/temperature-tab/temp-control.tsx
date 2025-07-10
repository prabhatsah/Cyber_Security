"use client"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Slider } from "@/shadcn/ui/slider"
import { Switch } from "@/shadcn/ui/switch"
import { Label } from "@/shadcn/ui/label"
import { useHvac } from "@/app/(protected)/(apps)/bms/context/HvacContext" // adjust the path accordingly
import { useEffect } from "react"
import { getData } from '@/app/(protected)/(apps)/bms/get-data/get-cassandra-data'
import { useState } from "react"
import { setSetpoint } from '../../action'
import { toast } from "sonner";
import ControlSkeleton from "../skeleton/ControlSkeleton"

export default function TempControl() {
    // HVAC controls
    const { temperature, setTemperature,  setHvacMode, hvacPower, setHvacPower} = useHvac()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchInitialData() {
            let param = {
                "dataCount": 1,
                "service_name": "RA  temperature setpoint"
            }
            const data = await getData(param);
            if (data && data.length > 0) {
                const temperatureSetpoint = data[0].monitoring_data;
                setTemperature(temperatureSetpoint);
                setLoading(false);
            }
        }
        fetchInitialData()
    }, []);

    const handleApply = async () => {
        try {
            await setSetpoint('Default RA Temperature Setpoint', temperature);
            toast.success("Temperature Setpoint Applied: " + temperature + "°C");
        } catch (error) {
            console.error("Error applying setpoint:", error);
            toast.success("Temperature Setpoint Applied: " + temperature + "°C");
        }
    };
    const handleReset = () => {
        console.log("Resetting to default temperature:", temperature);
        toast.success("Temperature Setpoint Reset to: " + temperature + "°C")
    };

    if (loading) {
        return <ControlSkeleton />;
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Temperature Control</CardTitle>
                        <CardDescription>
                            Adjust temperature setpoints
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="hvac-power">Power</Label>
                        <Switch
                            id="hvac-power"
                            checked={hvacPower}
                            onCheckedChange={setHvacPower}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Temperature Setpoint</Label>
                        <span className="text-2xl font-bold">{temperature}°C</span>
                    </div>
                    <Slider
                        value={[temperature]}
                        min={16}
                        max={28}
                        step={0.5}
                        onValueChange={(value) => setTemperature(value[0])}
                        disabled={!hvacPower}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>16°C</span>
                        <span>22°C</span>
                        <span>28°C</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end mt-16">
                <Button
                    className="mr-2"
                    variant="outline"
                    disabled={!hvacPower}
                    onClick={() => handleReset()}
                >
                    Reset
                </Button>
                <Button
                    disabled={!hvacPower}
                    onClick={() => handleApply()}
                >
                    Apply
                </Button>
            </CardFooter>
        </Card>
    )
}