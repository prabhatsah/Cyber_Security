"use client";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";
import Dashboard from "./dashboard";

export default function WebApi() {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([
      { label: "Scans", href: "/scans" },
      { label: "Web &  API Security", href: "/scans/webApi" },
    ]);
  }, []);

  return <Dashboard />;
}
