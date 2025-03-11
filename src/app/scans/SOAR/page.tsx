"use client";

import UnderMaintenance from "@/components/UnderMaintenance";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

export default function SOAR() {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([
      { label: "Scans", href: "/scans" },
      {
        label: "Security Orchestration & Automation (SOAR)",
        href: "/scans/SOAR",
      },
    ]);
  }, []);

  return (
    <>
      <UnderMaintenance />
    </>
  );
}
