import * as prevScans from "./scanHistory";
import { Card, Title, Text, Badge } from "@tremor/react";

interface Vulnerability {
    Image: string;
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
}

export function getTotalVulnerabilitiesForImages(historyData: any): Vulnerability[] | null {
    if (!historyData) return null;

    const historyImages = historyData[0]?.data;
    if (!historyImages) return null;

    const imageVulnerabilitiesMap: Record<string, Map<string, number>> = {};

    for (let key in historyImages) {
        const severity = new Map<string, number>([
            ["LOW", 0],
            ["MEDIUM", 0],
            ["HIGH", 0],
            ["CRITICAL", 0],
        ]);

        const obj = historyImages[key];

        if (obj?.Results?.[0]?.Vulnerabilities?.length) {
            for (const vul of obj.Results[0].Vulnerabilities) {
                const count = severity.get(vul.Severity) || 0;
                severity.set(vul.Severity, count + 1);
            }
        }

        imageVulnerabilitiesMap[obj?.ArtifactName || key] = severity;
    }

    const finalResult: Vulnerability[] = Object.entries(imageVulnerabilitiesMap).map(([image, severityMap]) => ({
        Image: image,
        LOW: severityMap.get("LOW") || 0,
        MEDIUM: severityMap.get("MEDIUM") || 0,
        HIGH: severityMap.get("HIGH") || 0,
        CRITICAL: severityMap.get("CRITICAL") || 0,
    }));

    console.log("Final Vulnerability Results:", finalResult);
    return finalResult;
}

export default function ScannedImages({ data }: { data: Vulnerability[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {data.map((vul, index) => (
                <Card key={index} className="p-4 border border-gray-200 shadow-lg">
                    <Title>{vul.Image}</Title>
                    <div className="mt-2 space-y-2">
                        <Text>
                            <Badge color="gray" className="mr-2">LOW:</Badge> {vul.LOW}
                        </Text>
                        <Text>
                            <Badge color="yellow" className="mr-2">MEDIUM:</Badge> {vul.MEDIUM}
                        </Text>
                        <Text>
                            <Badge color="orange" className="mr-2">HIGH:</Badge> {vul.HIGH}
                        </Text>
                        <Text>
                            <Badge color="red" className="mr-2">CRITICAL:</Badge> {vul.CRITICAL}
                        </Text>
                    </div>
                </Card>
            ))}
        </div>
    );
}
