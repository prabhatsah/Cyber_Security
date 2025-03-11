"use client";

import UnderMaintenance from "@/components/UnderMaintenance";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

export default function AIDrivenAnalysis() {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([
      { label: "Scans", href: "/scans" },
      { label: "AI-Driven Security Analysis", href: "/scans/aiDrivenAnalysis" },
    ]);
  }, []);

  return (
    <>
      <UnderMaintenance />
    </>
  );
}
