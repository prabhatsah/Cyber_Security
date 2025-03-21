"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { Reports } from "../../components/Reports";
import UnderMaintenance from "@/components/UnderMaintenance";

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
      {/* <Reports /> */}
      <UnderMaintenance />
    </>
  );
}
