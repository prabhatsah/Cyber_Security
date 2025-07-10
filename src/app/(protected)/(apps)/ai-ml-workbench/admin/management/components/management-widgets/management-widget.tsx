"use client";

import Widgets from "@/ikon/components/widgets";
import { WidgetProps } from "@/ikon/components/widgets/type";

export default function ManagementWidget({
  mlManagementWidgetData,
}: {
  mlManagementWidgetData: WidgetProps[];
}) {
  return (
    <>
      <Widgets widgetData={mlManagementWidgetData} />
    </>
  );
}
