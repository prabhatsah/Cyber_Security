import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

import ScheduleDataComponent from "../components/schedule-data-component";

export default function ProductScheduleTab({
  params,
}: {
  params: { product_id: string };
}) {
  const productIdentifier = params?.product_id || "";

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 5,
          title: "Schedule",
          href: `/schedule`,
        }}
      />
      <ScheduleDataComponent productIdentifier={productIdentifier} />
    </>
  );
}
