import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface ActionMenuProps {
  items?: ActionMenuProps[];
  type?: "sub" | "group" | "separator" | "label" | null;
  label: string;
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
