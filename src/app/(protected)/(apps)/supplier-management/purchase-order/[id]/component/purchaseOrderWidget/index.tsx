"use client";
import { WidgetProps } from "@/ikon/components/widgets/type";
import Widgets from "@/ikon/components/widgets";
import { useMemo } from "react";

export default function WidgetPurchaseOrder({
  id,
  purchaseOrderData,
}: {
  id: string;
  purchaseOrderData: any;
}) {
  const formatNumber = (num: number | string) => {
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(number) ? '0' : number.toLocaleString('en-IN');
  };

  const widgetData = useMemo<WidgetProps[]>(() => {
    if (!purchaseOrderData) return [
      {
        id: "noOfBillingAmount",
        widgetText: "Total Billing Amount",
        widgetNumber: "0",
        iconName: "shopping-cart",
      },
      {
        id: "noOfInvoicedAmount",
        widgetText: "Total Invoiced Amount",
        widgetNumber: "0",
        iconName: "shopping-cart",
      },
      {
        id: "paymentStatus",
        widgetText: "Payment Status",
        widgetNumber: "n/a",
        iconName: "shopping-cart",
      },
    ];

    const isWithoutItems = purchaseOrderData.POWithoutItem;
    const status = purchaseOrderData.purchaseOrderStatus;

    let billingAmount = "0";
    let invoicedAmount = "0";
    let paymentStatus = "Not Paid";

    if (isWithoutItems) {
      billingAmount = formatNumber(purchaseOrderData.billingAmtWithoughtItem);
      
      if (status === "paid") {
        invoicedAmount = formatNumber(purchaseOrderData.finalAmountWithoughtItem);
        paymentStatus = "Paid";
      } else if (["Created", "Waiting Approval", "Order Approved"].includes(status)) {
        invoicedAmount = "0";
        paymentStatus = "Not Paid";
      }
    } else {
      if (status === "paid") {
        billingAmount = formatNumber(purchaseOrderData.finalAmount || "0");
        invoicedAmount = formatNumber(purchaseOrderData.finalAmount || "0");
        paymentStatus = "Paid";
      } else if (status === "partiallyPaid") {
        billingAmount = formatNumber(purchaseOrderData.finalAmount || "0");
        invoicedAmount = formatNumber(purchaseOrderData.finalAmount || "0");
        paymentStatus = "Partially Paid";
      } else if (status === "Order Rejected") {
        billingAmount = "0";
        invoicedAmount = "0";
        paymentStatus = "Order Rejected";
      } else if (["Created", "Waiting Approval", "Order Approved"].includes(status)) {
        billingAmount = formatNumber(purchaseOrderData.finalAmount || "0");
        invoicedAmount = "0";
        paymentStatus = "Not Paid";
      }
    }

    return [
      {
        id: "noOfBillingAmount",
        widgetText: "Total Billing Amount",
        widgetNumber: billingAmount,
        iconName: "shopping-cart",
      },
      {
        id: "noOfInvoicedAmount",
        widgetText: "Total Invoiced Amount",
        widgetNumber: invoicedAmount,
        iconName: "shopping-cart",
      },
      {
        id: "paymentStatus",
        widgetText: "Payment Status",
        widgetNumber: paymentStatus,
        iconName: "shopping-cart",
      },
    ];
  }, [purchaseOrderData]);

  return (
    <div className="flex flex-col gap-3">
      <Widgets widgetData={widgetData} />
    </div>
  );
}