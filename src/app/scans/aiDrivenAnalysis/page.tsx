import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import UnderMaintenance from "@/components/UnderMaintenance";

export default function AIDrivenAnalysis() {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "AI-Driven Security Analysis",
          href: "/scans/aiDrivenAnalysis",
        }}
      />
      <UnderMaintenance />
    </>
  );
}
