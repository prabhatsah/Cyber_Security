"use client";

import { WidgetProps } from "@/ikon/components/widgets/type";
import Widgets from "@/ikon/components/widgets";

interface WidgetPurchaseDataProps {
  widgetValues: {
    created: number;
    approved: number;
    waiting: number;
    paid: number;
  };
}

export default function WidgetPurchaseData({
  widgetValues,
 }: WidgetPurchaseDataProps) {
  const WidgetData: WidgetProps[] = [
    {
      id: "noOfCreatedPurchaseOrder",
      widgetText: "Total Created Purchase Order",
      widgetNumber: widgetValues.created.toString(),
      iconName: "shopping-cart" as const,
    },
    {
      id: "noOfApprovedPurchaseOrder",
      widgetText: "Total Approved Purchase Order",
      widgetNumber: widgetValues.approved.toString(),
      iconName: "shopping-cart" as const,
    },
    {
      id: "noOfWaitingPurchaseOrder",
      widgetText: "Total Waiting Purchase Order",
      widgetNumber: widgetValues.waiting.toString(),
      iconName: "shopping-cart" as const,
    },
    {
      id: "totalActiveDealCount",
      widgetText: "Total Paid Purchase Order",
      widgetNumber: widgetValues.paid.toString(),
      iconName: "shopping-cart" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Widgets widgetData={WidgetData} />
    </div>
  );
}
