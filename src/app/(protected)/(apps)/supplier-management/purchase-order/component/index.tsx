
"use client"
import React, { useEffect, useState } from "react";
import WidgetPurchaseData from "./widget-purchase";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import PurchaseDataTable from "./data-table-purchase";

function PurchaseOrderOuterPage() {
  const [purchaseData, setPurchaseData] = useState([]);
  const [widgetValues, setWidgetValues] = useState({
    created: 0,
    approved: 0,
    waiting: 0,
    paid: 0,
  });

  const fetchPurchaseOrderData = async () => {
    try {
      const purchaseOrderInsData = await getMyInstancesV2({
        processName: "Purchase Order",
        predefinedFilters: { taskName: "View Purchase Order" },
        projections: ["Data"],
      });

      const purchaseOrderData: any = purchaseOrderInsData.map(
        (e: any) => e.data
      );
      console.log("purchaseOrderData", purchaseOrderData);

      let createdPurchaseOrder = 0;
      let approvedPurchaseOrder = 0;
      let waitingPurchaseOrder = 0;
      let paidPurchaseOrder = 0;

      purchaseOrderData.forEach((order: any) => {
        switch (order.purchaseOrderStatus) {
          case "Created":
            createdPurchaseOrder++;
            break;
          case "Waiting Approval":
            waitingPurchaseOrder++;
            break;
          case "paid":
            paidPurchaseOrder++;
            break;
          case "Order Approved":
            approvedPurchaseOrder++;
            break;
          default:
            break;
        }
      });

      console.log("Created:", createdPurchaseOrder);
      console.log("Waiting Approval:", waitingPurchaseOrder);
      console.log("Paid:", paidPurchaseOrder);
      console.log("Order Approved:", approvedPurchaseOrder);

      setPurchaseData(purchaseOrderData);

      setWidgetValues({
        created: createdPurchaseOrder,
        approved: approvedPurchaseOrder,
        waiting: waitingPurchaseOrder,
        paid: paidPurchaseOrder,
      });
    } catch (error) {
      console.error("Error fetching Purchase Order Data:", error);
    }
  };

  useEffect(() => {
    fetchPurchaseOrderData();
  }, []);
  return (
    <div>
      <WidgetPurchaseData widgetValues={widgetValues}  />
      <PurchaseDataTable  purchaseData={purchaseData} />
    </div>
  );
}

export default PurchaseOrderOuterPage;
