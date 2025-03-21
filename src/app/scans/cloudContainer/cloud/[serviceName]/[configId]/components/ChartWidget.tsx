import { Card, DonutChart } from "@tremor/react";
import { AnalysisResult, HarvesterData, WidgetDataItem } from "./type";

/// For Border Color
const colorMap: Record<string, string> = {
  Danger: "bg-red-900",
  Warning: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-green-800",
};

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

export default function ChartWidget() {

  return (
    <>
      <Card className="col-span-1 rounded-md">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mt-2 grid grid-cols-8 gap-8 items-center">
            <div className="relative col-span-3">
              <DonutChart
                data={widgetData}
                category="amount"
                index="name"
                showTooltip={false}
                className="h-28 hide-donut-center"
                colors={["red-900", "red-500", "yellow-500", "green-800"]}
              />

            </div>
            <div className="col-span-5">
              <p className="text-xs">Levels</p>
              <ul className="space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {widgetData.map((item) => (
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
