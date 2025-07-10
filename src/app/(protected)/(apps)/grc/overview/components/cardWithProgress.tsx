import { Card, CardContent, CardHeader } from "@/shadcn/ui/card"
import { Shield } from "lucide-react";

interface CardWithProgessProps {
  title: string;
  compliancePercentage: number;
  implemented: number;
  totalControls: number;
  progressColor?: string; // e.g. "bg-blue-500"
}

export function CardWithProgess({
  title,
  compliancePercentage,
  implemented,
  totalControls,
  progressColor = "bg-blue-500",
}: CardWithProgessProps) {
  return (
    <Card className="py-2">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <h4 className="text-base font-semibold">{title}</h4>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1 p-3">
        {/* Compliance Score row */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Compliance Score</span>
          <span className="font-semibold text-white">{compliancePercentage}%</span>
        </div>

        {/* Progress bar with dynamic color */}
        <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-in-out ${progressColor}`}
            style={{ width: `${compliancePercentage}%` }}
          />
        </div>

        {/* Controls Implemented row */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Controls Implemented</span>
          <span className="font-semibold text-white">
            {implemented}/{totalControls}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
