import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import PurchaseDetailsComponent from "./component/purchaseOrderDetails";
import PurchaseOrderWorkflow from "./component/purchaseOrderWorkflow";
import WidgetPurchaseOrder from "./component/purchaseOrderWidget";
import PurchaseOrderTable from "./component/purchaseOrderTable";

export default async function PurchaseDetails({
  params,
}: {
  params: { id: string };
}) {
  const purchaseOrderInsData = await getMyInstancesV2({
    processName: "Purchase Order",
    predefinedFilters: { taskName: "View Purchase Order" },
    mongoWhereClause: `this.Data.purchaseOrderId == "${params.id}"`,
    projections: ["Data"],
  });

  const purchaseOrderData: any = purchaseOrderInsData.map((e: any) => e.data);
  console.log("purchase Order Data", purchaseOrderData[0]);

  const itemsInsData = await getMyInstancesV2({
    processName: "Vendable Item",
    predefinedFilters: { taskName: "View Item" },
    projections: ["Data"],
  });
  const itemsData: any = itemsInsData.map((e: any) => e.data);
  console.log("itemsData", itemsData);
  return (
    <div
      className="w-full h-full overflow-auto overflow-x-hidden"
      id="leadMainTemplateDiv"
    >
      <div className="h-full flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-1/4 h-full">
          <div className="flex flex-col gap-3 h-full">
            <PurchaseDetailsComponent
              id={params.id}
              purchaseOrderData={purchaseOrderData[0]}
            />
            <PurchaseOrderWorkflow
              id={params.id}
              purchaseOrderData={purchaseOrderData[0]}
            />
          </div>
        </div>
        <div className="w-full lg:w-3/4 h-full flex flex-col gap-3">
          <div className="">
            <WidgetPurchaseOrder
              id={params.id}
              purchaseOrderData={purchaseOrderData[0]}
            />
          </div>

          <PurchaseOrderTable
            id={params.id}
            purchaseOrderData={purchaseOrderData}
            items = {itemsInsData}
          />
        </div>
      </div>
      {/* <EditLeadModalWrapper leadIdentifier={leadIdentifier} /> */}
    </div>
  );
}
