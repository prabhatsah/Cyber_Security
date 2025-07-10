import {
  Building,
  ShieldCheck,
  Code,
  ChartPie,
  Database,
  DollarSign,
  BrainCog,
  Cpu,
  Headset,
  Dock,
  BrainCircuit,
  FileText,
  List,
  LucideProps,
  FolderOpenDot,
} from "lucide-react";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

export interface SoftwareNameVersionProps {
  softwareName: string;
  version: string;
  tooltip?: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export const appWiseSoftwareNameVersionMap: {
  [key: string]: SoftwareNameVersionProps;
} = {
  "base-app": {
    softwareName: "Base App",
    version: "1",
  },
  "sales-crm": {
    softwareName: "Sales CRM",
    version: "1",
    icon: DollarSign,
  },
  "document-management": {
    softwareName: "Document Management",
    version: "1",
    icon: FileText,
  },
  ssd: {
    softwareName: "SSD",
    version: "1",
    icon: ChartPie,
  },
  "ai-ml-workbench": {
    softwareName: "AI-ML Workbench",
    version: "1",
    icon: BrainCog,
  },
  "tender-management": {
    softwareName: "Tender Management",
    version: "1",
    icon: Dock,
  },
  ccc: {
    softwareName: "CCC",
    version: "1",
    icon: Code,
  },
  "project-management": {
    softwareName: "Project Management",
    version: "1",
    icon: List,
  },
  bms: {
    softwareName: "BMS",
    version: "1",
    icon: Building,
  },
  grc: {
    softwareName: "GRC",
    version: "1",
    icon: FolderOpenDot,
  },
  "grc-v2": {
    softwareName: "GRC-V2",
    version: "1",
    icon: ShieldCheck,
    tooltip: "Autokrator",
  },
  // "grc-v2": {
  //   softwareName: "S2 GRC",
  //   version: "1",
  //   icon: ShieldCheck,
  //   tooltip: "Autokrator",
  // },
  // "GRC-DEMO": {
  //   softwareName: "GRC-DEMO",
  //   version: "1",
  //   icon: ShieldCheck,
  // },
  itsm: {
    softwareName: "ITSM",
    version: "1",
    icon: Database,
  },
  "ai-workforce": {
    softwareName: "AI Workforce",
    version: "1",
    icon: Cpu,
  },
  "customer-support": {
    softwareName: "Customer Support",
    version: "1",
    icon: Headset,
  },
  "task-management": {
    softwareName: "Task Management",
    version: "1",
    icon: BrainCircuit,
  },
  atkins: {
    softwareName: "Atkins",
    version: "1",
    icon: BrainCircuit,
  },
};
