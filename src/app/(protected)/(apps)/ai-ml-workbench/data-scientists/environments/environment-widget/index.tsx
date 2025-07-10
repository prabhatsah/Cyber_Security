"use client";

import Widgets from "@/ikon/components/widgets";
import { WidgetProps } from "@/ikon/components/widgets/type";

export default function EnvironmentWidget({
  widgetData,
}: {
  widgetData: WidgetProps[];
}) {
  return (
    <>
      <Widgets widgetData={widgetData} />
    </>
  );
}
