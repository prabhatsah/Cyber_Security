"use client";

import Layout from "@/components/Layout";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";
import ConfigDashboard from "./components/ConfigDashboard";

export default function ScansPage() {
  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([{ label: "Scans", href: "/scans" }]);
  }, []);

  return (
    <Layout>
      <ConfigDashboard />
    </Layout>
  );
}
