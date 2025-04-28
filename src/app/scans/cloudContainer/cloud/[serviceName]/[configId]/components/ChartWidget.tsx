import { Card, DonutChart } from "@tremor/react";
import { Label } from "@radix-ui/react-label";

/// For Border Color
const colorMap: Record<string, string> = {
  Danger: "bg-red-900",
  Warning: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-green-800",
};

export default function ChartWidget({ summary }: {
  summary: Record<string, {
    checked_items: number;
    flagged_items: number;
    max_level: string;
    resources_count: number;
    rules_count: number;
  }>;
}) {

  // Initialize maxLevelSum with default 0 values for all levels
  const maxLevelSum: Record<string, number> = {
    danger: 0,
    warning: 0,
    medium: 0,
    low: 0
  };

  // Iterate over the summary object and sum the rules_count by max_level
  for (const key in summary) {
    const maxLevel: string = summary[key].max_level;
    const rulesCount = summary[key].rules_count;

    // Sum rules_count based on max_level
    if (maxLevelSum[maxLevel] !== undefined) {
      maxLevelSum[maxLevel] += rulesCount;
    }
  }

  // Create the widgetData array
  const widgetData = Object.keys(maxLevelSum).map((level) => {
    let borderColor = '';

    // Assign border colors based on the level
    switch (level) {
      case 'danger':
        borderColor = 'bg-red-900';
        break;
      case 'warning':
        borderColor = 'bg-red-500';
        break;
      case 'medium':
        borderColor = 'bg-amber-500';
        break;
      case 'low':
        borderColor = 'bg-green-800';
        break;
      default:
        borderColor = 'bg-gray-500';
    }

    return {
      name: level.charAt(0).toUpperCase() + level.slice(1), // Capitalize first letter
      amount: maxLevelSum[level],  // Use the sum from maxLevelSum
      borderColor: borderColor
    };
  });

  console.log(widgetData);


  return (
    <div className="col-span-1 space-y-2">
      <Label className="text-lg font-bold text-widget-title">Flag</Label>
      <Card className="rounded-md">
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
              {/* <p className="text-xs">Levels</p> */}
              <ul className="space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {widgetData.map((item) => (
                  <li key={item.name} className="flex space-x-3">
                    <span
                      className={`${item.borderColor} w-1 shrink-0 rounded`}
                    />
                    <div>
                      <p className="text-sm font-medium text-widget-mainHeader">
                        {item.amount}
                      </p>
                      <p className="mt-0.5 whitespace-nowrap text-sm text-widget-mainDesc">
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
    </div>
  );
}
