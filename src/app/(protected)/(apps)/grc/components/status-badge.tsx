import { Badge } from "@/shadcn/ui/badge";
// import { getStatusColor } from "../lib/chart-theme"

interface StatusBadgeProps {
  status: string;
  className?: string;
  customColors?: Record<string, string>;
  textcolor?: string;
}

export function StatusBadge({
  status,
  className,
  customColors,
  textcolor,
}: StatusBadgeProps) {
  const color = customColors &&  customColors[status];
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: color,
        color: textcolor ? textcolor : "black",
        border: "none",
      }}
    >
      {status}
    </Badge>
  );
}


export function EditStatusBadge({
  status,
  className,
  customColors
}: StatusBadgeProps) {
  const color = customColors &&  customColors[status];
  console.log(status);
  console.log(color);
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: color,
        color: "black",
        border: "none",
      }}
    >
      { status === 'fullyImplemented' ? "Fully Implemented" :status === 'partiallyImplemented' ? "Partially Implemented" : "Not Implemented"}
    </Badge>
  );
}
