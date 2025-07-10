import { Scans } from "@/app/scans/components/Scans";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function ScansPage() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Scans",
          href: "/scans",
        }}
      />
      <Scans />
    </>
  );
}
