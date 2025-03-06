"use client";

import Dashboard from "@/app/dashboard/components/Dashboard";
import setBreadcrumb from "@/lib/setBreadcrumb";

export default function Home() {
  setBreadcrumb([{ label: "Dashboard", href: "/dashboard" }]);

  return <Dashboard />;
}
