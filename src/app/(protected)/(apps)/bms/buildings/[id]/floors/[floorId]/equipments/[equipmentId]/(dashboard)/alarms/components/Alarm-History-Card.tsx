import { Clock } from "lucide-react";
import { format } from "date-fns";
import type React from "react";
import clsx from "clsx";


interface AlarmHistoryData {
  transitionTime: string | Date;
  fromState: "normal" | "warning" | "critical";
  toState: "normal" | "warning" | "critical";
}

const stateStyles: Record<string, string> = {
  normal: "border-green-600 text-green-500",
  warning: "border-yellow-500 text-yellow-400",
  critical: "border-red-600 text-red-500",
};

const AlarmHistoryCard: React.FC<{ data: AlarmHistoryData }> = ({ data }) => {
  const formattedTime = format(new Date(data.transitionTime), "dd MMM yyyy HH : mm : ss");

  return (
    <div className="border border-gray-600 rounded-md p-3 flex flex-col gap-2 w-fit bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span className="">{formattedTime}</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={clsx(
            "border px-2 py-0.5 text-xs rounded",
            stateStyles[data.fromState]
          )}
        >
          {data.fromState}
        </span>
        <span className="text-muted-foreground">→</span>
        <span
          className={clsx(
            "border px-2 py-0.5 text-xs rounded",
            stateStyles[data.toState]
          )}
        >
          {data.toState}
        </span>
      </div>
    </div>
  );
};

export default AlarmHistoryCard;
