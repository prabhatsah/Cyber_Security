"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { Reports } from "../../components/Reports";

export default function ReportsPage() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Reports",
          href: "/reports",
        }}
      />
      <Reports />
    </>
  );
}
