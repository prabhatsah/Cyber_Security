import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import UnderMaintenance from "@/components/UnderMaintenance";

export default function SOAR() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Security Orchestration & Automation (SOAR)",
          href: "/scans/SOAR",
        }}
      />
      <UnderMaintenance />
    </>
  );
}
