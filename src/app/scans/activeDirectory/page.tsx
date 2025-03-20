import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import UnderMaintenance from "@/components/UnderMaintenance";

export default function ActiveDirectory() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Active Directory Security",
          href: "/scans/activeDirectory",
        }}
      />
      <UnderMaintenance />
    </>
  );
}
