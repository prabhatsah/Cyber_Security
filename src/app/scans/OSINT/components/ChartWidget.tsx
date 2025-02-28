import { Card, DonutChart } from "@tremor/react";
import { AnalysisResult, HarvesterData, WidgetDataItem } from "./type";

/// For Border Color
const colorMap: Record<string, string> = {
  malicious: "bg-red-900",
  suspicious: "bg-red-500",
  undetected: "bg-amber-500",
  harmless: "bg-green-800",
};

export default function ChartWidget({
  widgetData,
}: {
  widgetData: HarvesterData;
}) {
  const last_analysis_stats: AnalysisResult | Object =
    widgetData.attributes.last_analysis_stats ?? {};

  const chartData: WidgetDataItem[] = Object.entries(last_analysis_stats)
    .filter(([key]) => key !== "timeout") // Exclude "timeout"
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
      amount: value,
      borderColor: colorMap[key] || "bg-gray-500", // Default color if not mapped
    }));

  const reputation = widgetData.attributes.reputation ?? "0";
  const reputationCss =
    reputation >= 0 ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900";

  return (
    <>
      <Card className="col-span-1 rounded-md">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mt-2 grid grid-cols-8 gap-8 items-center">
            <div className="relative col-span-3">
              <DonutChart
                data={chartData}
                category="amount"
                index="name"
                showTooltip={false}
                className="h-24 hide-donut-center"
                colors={["red-900", "red-500", "yellow-500", "green-800"]}
              />
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <span className="inline-flex items-center space-x-2.5 rounded-md bg-tremor-background py-1 pl-2.5 pr-1 ring-1 ring-inset ring-tremor-ring">
                  <span className="text-sm font-semibold text-gray-700">
                    Reputation
                  </span>
                  <span
                    className={`rounded-md text-sm px-2 font-bold ${reputationCss}`}
                  >
                    {reputation}
                  </span>
                </span>
              </div>
            </div>
            <div className="col-span-5">
              <p className="text-xs">Security Vendors Flag</p>
              <ul className="space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {chartData.map((item) => (
                  <li key={item.name} className="flex space-x-3">
                    <span
                      className={`${item.borderColor} w-1 shrink-0 rounded`}
                    />
                    <div>
                      <p className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {item.amount}
                      </p>
                      <p className="mt-0.5 whitespace-nowrap text-sm text-tremor-content dark:text-dark-tremor-content">
                        {item.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
