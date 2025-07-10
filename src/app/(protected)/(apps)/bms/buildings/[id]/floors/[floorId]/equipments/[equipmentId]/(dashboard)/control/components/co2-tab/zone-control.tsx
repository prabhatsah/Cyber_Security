"use client"

import { Button } from "@/shadcn/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/ui/card"
import { Switch } from "@/shadcn/ui/switch"
import { Wind } from "lucide-react"


export default function ZoneControl() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Zone Control</CardTitle>
                <CardDescription>
                    Manage HVAC settings by zone
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wind className="h-5 w-5 text-muted-foreground" />
                            <span>Zone A (Offices)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">22.5°C</span>
                            <Switch checked={true} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wind className="h-5 w-5 text-muted-foreground" />
                            <span>Zone B (Meeting Rooms)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">21.5°C</span>
                            <Switch checked={true} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wind className="h-5 w-5 text-muted-foreground" />
                            <span>Zone C (Common Areas)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">23.0°C</span>
                            <Switch checked={true} />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wind className="h-5 w-5 text-muted-foreground" />
                            <span>Zone D (Technical)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">20.0°C</span>
                            <Switch checked={false} />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Apply to All Zones</Button>
            </CardFooter>
        </Card>
    )
}