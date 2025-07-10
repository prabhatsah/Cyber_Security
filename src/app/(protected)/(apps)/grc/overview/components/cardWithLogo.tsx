import { FC, ReactNode } from "react";
import { Card, CardHeader, CardContent } from "@/shadcn/ui/card"

interface ControlStatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  changeIcon: ReactNode;
  changeValue: string;
  changeLabel: string;
  period: string;
  changeColor?: string;
  iconBgColor?: string;
  iconTextColor?: string;
}

const ControlStatsCard: FC<ControlStatsCardProps> = ({
  title,
  value,
  icon,
  changeIcon,
  changeValue,
  changeLabel,
  period,
  changeColor = "text-green-500",
  iconBgColor = "bg-blue-900/20",
  iconTextColor = "text-blue-700",
}) => {
  return (
    <Card>
      <CardHeader className="w-full space-y-0 pb-2">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-sm">{title}</div>
            <div className="text-lg font-bold">{value}</div>
          </div>
          <div className={`rounded-full ${iconBgColor} self-center ml-auto p-2`}>
            <div className={`h-6 w-6 ${iconTextColor}`}>{icon}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-xs text-muted-foreground">
          <span className={`mr-1 w-4 h-4 ${changeColor}`}>{changeIcon}</span>
          <span className={`${changeColor} font-medium`}>{changeValue}</span>
          <span className={`${changeColor} font-medium ml-1`}>{changeLabel}</span>
          <span className="ml-1">{period}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlStatsCard;
