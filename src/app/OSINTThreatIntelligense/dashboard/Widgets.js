"use client";
import { Card, CardContent } from "@/components/ui/card";

export default function Widgets({ data }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-bold">Threat Score</h3>
                    <p>{data.abuseipdb?.data?.abuseConfidenceScore || "N/A"}</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-bold">ISP</h3>
                    <p>{data.ipinfo?.org || "N/A"}</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-bold">Location</h3>
                    <p>{data.ipinfo?.city}, {data.ipinfo?.country}</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-bold">Open Ports</h3>
                    <p>{data.shodan?.ports?.join(", ") || "None"}</p>
                </CardContent>
            </Card>
        </div>
    );
}
