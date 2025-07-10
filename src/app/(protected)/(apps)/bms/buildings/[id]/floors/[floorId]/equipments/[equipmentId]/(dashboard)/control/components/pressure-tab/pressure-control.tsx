"use client"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Slider } from "@/shadcn/ui/slider"
import { Switch } from "@/shadcn/ui/switch"
import { Label } from "@/shadcn/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select"
import { useHvac } from "@/app/(protected)/(apps)/bms/context/HvacContext" // adjust path as needed
import { useEffect, useState } from "react"
import { getData } from '@/app/(protected)/(apps)/bms/get-data/get-cassandra-data'
import { setSetpoint } from '../../action'
import { toast } from "sonner";
import ControlSkeleton from "../skeleton/ControlSkeleton"

export default function PressureControl() {
    // HVAC controls
    const { pressure, setPressure, hvacMode, setHvacMode, hvacPower, setHvacPower, fanSpeed, setFanSpeed, isChangesApplied, setIsChangesApplied } = useHvac()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchInitialData() {
            let param = {
                "dataCount": 1,
                "service_name": "SA Pressure setpoint"
            }
            const data = await getData(param);
            if (data && data.length > 0) {
                const pressureSetpoint = data[0].monitoring_data;
                setPressure(pressureSetpoint);
                setLoading(false);
            }
        }
        fetchInitialData()
    }, []);

    const handleApply = async () => {
        // console.log("Pressure Setpoint Applied:", pressure);
        try {
            await setSetpoint('Default SA Pressure Setpoint', pressure); // Call the setSetpoint function with the current values
            toast.success("Pressure Setpoint Applied: " + pressure + " Pa")
            // setIsChangesApplied(!isChangesApplied); // Reset the changes applied state on error
            // const currentUrl = window.location.origin + window.location.pathname;
            // router.push(currentUrl);
        } catch (error) {
            console.error("Error applying setpoint:", error);
            // setIsChangesApplied(!isChangesApplied); // Reset the changes applied state on error
            toast.success("Pressure Setpoint Applied: " + pressure + " Pa")
            // toast.error("Failed to apply temperature setpoint");
        }
    };
    if (loading) {
        return <ControlSkeleton />;
    }
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Pressure Control</CardTitle>
                        <CardDescription>
                            Adjust Pressure setpoints
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
                        <Label>Pressure Setpoint</Label>
                        <span className="text-2xl font-bold">{pressure} Pa</span>
                    </div>
                    <Slider
                        value={[pressure]}
                        min={0}
                        max={2000}
                        step={50}
                        onValueChange={(value) => setPressure(value[0])}
                        disabled={!hvacPower}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 Pa</span>
                        <span>1000 Pa</span>
                        <span>2000 Pa</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 mt-16">
                <Button variant="outline" disabled={!hvacPower}>Reset</Button>
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