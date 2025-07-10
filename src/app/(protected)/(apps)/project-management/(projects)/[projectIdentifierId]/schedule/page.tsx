import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

import ScheduleDataComponent from "../components/schedule-data-component";

export default function ProductScheduleTab({
  params,
}: {
  params: { projectIdentifierId: string };
}) {
  const projectIdentifier = params?.projectIdentifierId || "";

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 5,
          title: "Schedule",
          href: `/schedule`,
        }}
      />
      <ScheduleDataComponent projectIdentifier={projectIdentifier} />
    </>
  );
}
