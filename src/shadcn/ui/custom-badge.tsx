import { Badge } from "./badge";

interface StatusBadgeProps {
  label: string;
  bgColor: string;
  txtColor?:string;
  className?: string;
}

export function CustomBadge({
  label,
  bgColor,
  txtColor,
  className
}: StatusBadgeProps) {
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: bgColor,
        color: txtColor ? txtColor: "black",
        border: "none",
      }}
    >
      {label}
    </Badge>
  );
}