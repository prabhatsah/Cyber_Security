"use client";

import Dashboard from "@/app/dashboard/components/Dashboard";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import setBreadcrumb from "@/lib/setBreadcrumb";

export default function Home() {
  // setBreadcrumb([{ label: "Dashboard", href: "/dashboard" }]);

  return <>
    <RenderAppBreadcrumb
      breadcrumb={{
        level: 0,
        title: "Dashboard",
        href: "/dashboard",
      }}
    />
    <Dashboard />
  </>;
}
