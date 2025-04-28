"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { AuditLog } from "../../components/AuditLog";

export default function AuditPage() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Audit Log",
          href: "/audit",
        }}
      />
      <AuditLog />
    </>
  );
}
