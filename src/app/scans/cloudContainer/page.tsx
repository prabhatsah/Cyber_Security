"use client";

import { useState } from "react";
import CloudDashboard from "./cloud/page";
import ContainerDashboard from "./containers/page";
import { redirect } from "next/navigation";

export default function GeneralDashboard() {
  const [activeTab, setActiveTab] = useState<"Cloud" | "Containers">("Cloud");

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

  // return <Tabs tabs={tabs} />;
  redirect("/scans/cloudContainer/cloud");
}
