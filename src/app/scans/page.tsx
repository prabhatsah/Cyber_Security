"use client";

import { Scans } from "@/app/scans/components/Scans";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

export default function ScansPage() {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([{ label: "Scans", href: "/scans" }]);
  }, []);

  return <Scans />;
}
