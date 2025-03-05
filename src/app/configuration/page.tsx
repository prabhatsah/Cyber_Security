"use client";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function ConfigurationPage() {
  const { setItems } = useBreadcrumb();
  const defaultConfigData: Record<string, any> = {};
  const [configurationData, setConfigurationData] = useState(defaultConfigData);

  useEffect(() => {
    setItems([{ label: "Configuration", href: "/configuration" }]);
  }, []);

  redirect("/configuration/cloud-services");
}
