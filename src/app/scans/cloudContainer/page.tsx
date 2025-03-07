"use client";

import Tabs from "@/components/Tabs";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import CloudDashboard from "./cloud/page";
import ContainerDashboard from "./containers/page";

export default function GeneralDashboard() {
  const [activeTab, setActiveTab] = useState<"Cloud" | "Containers">("Cloud");
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    setItems([
      { label: "Scans", href: "/scans" },
      { label: "Cloud & Container Security", href: "/scans/cloudContainer" },
    ]);
  }, [activeTab]);

  const tabs = [
    {
      label: "Cloud",
      content: <CloudDashboard />,
    },
    {
      label: "Container",
      content: <ContainerDashboard />,
    },
  ];

  return <Tabs tabs={tabs} />;
}
