"use client"
import { Card, DonutChart } from "@tremor/react";
import { AnalysisResult, HarvesterData, WidgetDataItem } from "./type";
import { Label } from "@radix-ui/react-label";

/// For Border Color
const colorMap: Record<string, string> = {
    Danger: "bg-red-900",
    Warning: "bg-red-500",
    Medium: "bg-amber-500",
    Low: "bg-green-800",
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const widgetData = [
    {
        name: 'Danger',
        amount: 10,
        borderColor: 'bg-red-900',
    },
    {
        name: 'Warning',
        amount: 9,
        borderColor: 'bg-red-500',
    },
    {
        name: 'Medium',
        amount: 6,
        borderColor: 'bg-amber-500',
    },
    {
        name: 'Low',
        amount: 2,
        borderColor: 'bg-green-800',
    },
];

export default function BasicInfo({ scanTime, serviceName, serviceCode, summary }: {
    scanTime: string;
}) {

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

    const basicInfo = [
        {
            name: "Provider Code",
            value: serviceCode
        },
        {
            name: "Project ID",
            value: (serviceCode === "GCP") ? "meta-sensor-447310-c0" : "n/a"
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
            value: serviceName
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
            value: "n/a"
        },
    ]

    return (
        <div className="col-span-3 space-y-2">
            <Label className="text-lg font-bold text-gray-900 dark:text-gray-50">Basic Information</Label>
            <Card className=" rounded-md">
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
                                    <p className="text-sm font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                        {item.value}
                                    </p>
                                    <p className="text-sm text-tremor-content dark:text-dark-tremor-content">
                                        {item.name}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
    );
}
