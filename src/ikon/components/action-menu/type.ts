import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export interface ActionMenuProps {
  items?: ActionMenuProps[];
  type?: "sub" | "group" | "separator" | "label" | null;
  label: ((...args: any) => string) | string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  disabled?: boolean;
  visibility?: ((...args: any) => boolean) | boolean;
  onClick?: (...args: any) => void;
}

export interface ExtraActionParams {
  arguments?: any[];
}
