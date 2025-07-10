import { ReactNode } from "react";

interface CardProps {
  title: string;
  tools?: ReactNode;
  children: ReactNode;
  legendData?: { label: string; value: number }[];
  layout?: "default" | "full-width"; // Add a layout prop
}

export default function PieChartCard({ title, tools, children, legendData, layout = "default" }: CardProps) {
  // Calculate total for percentages if legendData is provided
  const total = legendData?.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b shadow pb-2">
        <h5 className="">{title}</h5>
        <div className="text-gray-400">{tools}</div>
      </div>

      {/* Content Layout */}
      {layout === "default" ? (
        <div className="mt-2 flex items-center gap-4">
          {/* Left side - Chart */}
          <div className="w-1/2 flex justify-center">{children}</div>

          {/* Right side - Legend */}
          {legendData && (
            <div className="w-1/2 text-sm text-gray-300 flex flex-col gap-2">
              {legendData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  {/* Color Indicator */}
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ["#6ec6ff", "#4a90e2", "#7b6fe9", "#ff8c00"][index % 4] }}
                    ></span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {/* Value & Percentage */}
                  <span>{item.value} ({((item.value / total) * 100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Full Width Layout for Bar Chart or other components
        <div className="mt-4 w-full h-full flex justify-center items-center">
          {children}
        </div>
      )}
    </div>
  );
}
