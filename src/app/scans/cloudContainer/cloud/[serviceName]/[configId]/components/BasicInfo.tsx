import { Card } from "@tremor/react";
import { Label } from "@radix-ui/react-label";
import { format } from "date-fns";
import { BasicInfoWidget } from "@/components/BasicInfoWidget";

/// For Border Color
// const colorMap: Record<string, string> = {
//     Danger: "bg-red-900",
//     Warning: "bg-red-500",
//     Medium: "bg-amber-500",
//     Low: "bg-green-800",
// };


// const widgetData = [
//     {
//         name: 'Danger',
//         amount: 10,
//         borderColor: 'bg-red-900',
//     },
//     {
//         name: 'Warning',
//         amount: 9,
//         borderColor: 'bg-red-500',
//     },
//     {
//         name: 'Medium',
//         amount: 6,
//         borderColor: 'bg-amber-500',
//     },
//     {
//         name: 'Low',
//         amount: 2,
//         borderColor: 'bg-green-800',
//     },
// ];

export default function BasicInfo({ summary, scanTime, serviceNameAsDisplayStr, serviceCode, projectId }: {
    summary: Record<string, {
        checked_items: number;
        flagged_items: number;
        max_level: string;
        resources_count: number;
        rules_count: number;
    }>;
    scanTime: string;
    serviceNameAsDisplayStr: string;
    serviceCode: string;
    projectId?: string;
}) {

    serviceCode = serviceCode.toUpperCase();

    let serviceScanned = 0;
    let rulesCount = 0;
    let flaggedItems = 0;
    let resourcesCount = 0;
    for (let key in summary) {
        serviceScanned++;
        rulesCount += summary[key].rules_count;
        flaggedItems += summary[key].flagged_items;
        resourcesCount += summary[key].resources_count;
    }

    const basicInfo: Array<{
        name: string;
        value: string;
    }> = [
            {
                name: "Provider Code",
                value: serviceCode
            },
            {
                name: "Project ID",
                value: projectId ?? "N/A",
            },
            {
                name: "Resources Count",
                value: resourcesCount
            },

            {
                name: "Services Scanned",
                value: serviceScanned
            },
            {
                name: "Provider Name",
                value: serviceNameAsDisplayStr
            },
            {
                name: "Flagged Items",
                value: flaggedItems
            },
            {
                name: "Rules Evaluated",
                value: rulesCount
            },
            {
                name: "Scan Time",
                value: format(scanTime, "dd-MMM-yyyy HH:mm")
            },
        ]

    return (
        <div className="col-span-3 space-y-2">
            <Label className="text-lg font-bold text-widget-title">Basic Information</Label>
            <BasicInfoWidget items={basicInfo} />
            {/* <Card className=" rounded-md">
                <div className=" h-full">
                    <ul
                        role="list"
                        className="mt-6 grid grid-cols-1 gap-3 lg:mt-0 lg:grid-cols-4"
                    >
                        {basicInfo.map((item) => (
                            // Adjust dark:bg-gray-950 accordingly if a different dark mode background tone is set
                            <li
                                key={item.name}
                                className=" px-0 py-3 lg:px-4 lg:py-2 lg:text-left "
                            >
                                <div className="border-l-2 border-l-white/70 pl-2">
                                    <p className="text-sm font-semibold text-widget-mainHeader">
                                        {item.value}
                                    </p>
                                    <p className="text-sm text-widget-mainDesc">
                                        {item.name}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card> */}
        </div>
    );
}
