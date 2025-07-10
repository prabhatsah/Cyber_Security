import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";

export default async function PurchaseDetailsComponent({
  id,
  purchaseOrderData,
}: {
  id: string;
  purchaseOrderData: any;
}): Promise<ReactNode> {
  console.log("purchase Order Data", purchaseOrderData);

  return (
    <Card className="h-1/2 flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center border-b">
        <CardTitle>Purchase Order Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 p-0 overflow-hidden">
        <div className="flex flex-col flex-grow overflow-auto">
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Purchase Order ID : {purchaseOrderData.purchaseOrderId}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Purchaser : {purchaseOrderData?.purchaser || "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Creation Date : {purchaseOrderData.creationDate || "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Delivery Date : {purchaseOrderData.delivaryDate || "n/a"}
          </span>
          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Billing Currency : {purchaseOrderData.billingCurrency || "n/a"}
          </span>

          <span className="flex gap-2 align-middle border-b py-2 px-3">
            Vendor : {purchaseOrderData.vendor || "n/a"}
          </span>
          <span className="flex gap-2 align-middle py-2 px-3">
            Vendor Address : {purchaseOrderData.vendorAddress || "n/a"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
