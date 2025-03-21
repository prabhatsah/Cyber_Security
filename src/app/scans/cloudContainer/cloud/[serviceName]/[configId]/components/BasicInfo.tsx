import { Card, DonutChart } from "@tremor/react";
import { AnalysisResult, HarvesterData, WidgetDataItem } from "./type";

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

const basicInfo = [
    {
        name: "Provider Code",
        value: "GCP"
    },
    {
        name: "Project ID",
        value: "meta-sensor-447310-c0"
    },
    {
        name: "Scan Time",
        value: "2025-12-05 16:20"
    },
    {
        name: "Services Scanned",
        value: 12
    },
    {
        name: "Provider Name",
        value: "Google Cloud Platform"
    },
    {
        name: "Issue Detected",
        value: 25
    },
    {
        name: "Rules Evaluated",
        value: 25
    },
    {
        name: "Rules Evaluated",
        value: 25
    },
]

export default function BasicInfo() {

    // const chartData: WidgetDataItem[] = Object.entries(last_analysis_stats)
    //   .filter(([key]) => key !== "timeout") // Exclude "timeout"
    //   .map(([key, value]) => ({
    //     name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
    //     amount: value,
    //     borderColor: colorMap[key] || "bg-gray-500", // Default color if not mapped
    //   }));



    return (
        <>
            <Card className="col-span-3 rounded-md">
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
        </>
    );
}
