"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import ViewPurchaseOrderButtonWithModal from "../purchaseOrderViewFormComponent";
import EditPurchaseOrderButtonWithModal from "../purchaseOrderEditFormComponent";

interface DataTablePurchaseDataProps {
  id: string;
  purchaseOrderData: any[];
  items: any[];
}

interface PurchaseOrderProps {
  total: string;
  unitPrice: string;
  finalAmount: string;
  discount: string;
  discountAmount: string;
  item: string;
  quantity: string;
  itemId: string;
  itemQuantity: string | number;
  itemPrice: string | number;
  currency: string;
  itemUnit: string | number;
  itemName: string;
  billingCurrency_manually: string;
  vatOrGstAmtWithoughtItem: string;
  discountPercentWithoughtItem: string;
  discountedAmtWithoughtItem: string;
  finalAmountWithoughtItem: string;
  purchaseOrderIdentifier: string;
  vatOrGstPercentWithoughtItem: string;
  billingAmtWithoughtItem: string;
  purchaser: string;
  creationDate: string;
  purchaseOrderId: string;
  purchaseOrderObj?: Record<
    string,
    { itemId: string; quantity: number; item: string }
  >;
  delivaryDate: string;
  vendor: string;
  "payment-terms": string;
  selVatGst: string;
  billingCurrency: string;
  note?: string;
  purchaseOrderStatus: string;
  vendorAddress: string;
  vendorContactName: string;
  vendorContactPhonenumber: string;
  vendorContactEmail: string;
  organitionName: string;
  createPurchaseFrom: string;
  purchaseOrderName: string;
}

function PurchaseOrderTable({
  id,
  purchaseOrderData,
  items,
}: DataTablePurchaseDataProps) {
  const [editForm, setEditForm] = useState(false);
  const itemsData: any = items.map((e: any) => e.data);

  console.log("entering items ", itemsData);
  let columnsForItem: ColumnDef<PurchaseOrderProps>[] = [];
  let dataForTable = [];
  var extraParams: DTExtraParamsProps = {
    extraTools: [],
  };

  if (purchaseOrderData[0]?.POWithoutItem) {
    dataForTable = purchaseOrderData;
    columnsForItem = [
      {
        accessorKey: "billingCurrency_manually",
        header: () => (
          <div style={{ textAlign: "center" }}>Billing Currency</div>
        ),
        cell: ({ row }) => (
          <span>{row.original?.billingCurrency_manually}</span>
        ),
      },
      {
        accessorKey: "discountPercentWithoughtItem",
        header: () => <div style={{ textAlign: "center" }}>Discount (%)</div>,
        cell: ({ row }) => (
          <span>{row.original?.discountPercentWithoughtItem}</span>
        ),
      },
      {
        accessorKey: "vatOrGstPercentWithoughtItem",
        header: () => <div style={{ textAlign: "center" }}>GST(%)</div>,
        cell: ({ row }) => (
          <span>{row.original?.vatOrGstPercentWithoughtItem}</span>
        ),
      },
      {
        accessorKey: "billingAmtWithoughtItem",
        header: () => <div style={{ textAlign: "center" }}>Billing Amount</div>,
        cell: ({ row }) => <span>{row.original?.billingAmtWithoughtItem}</span>,
      },
      {
        accessorKey: "discountedAmtWithoughtItem",
        header: () => (
          <div style={{ textAlign: "center" }}>Discount Amount</div>
        ),
        cell: ({ row }) => (
          <span>{row.original?.discountedAmtWithoughtItem || "n/a"}</span>
        ),
      },
      {
        accessorKey: "vatOrGstAmtWithoughtItem",
        header: () => <div style={{ textAlign: "center" }}>GST Amount</div>,
        cell: ({ row }) => (
          <span>{row.original?.vatOrGstAmtWithoughtItem}</span>
        ),
      },
    ];
  } else {
    if (purchaseOrderData[0]?.updaetOrderItem == undefined) {
      dataForTable = purchaseOrderData[0].purchaseOrderObj;
      extraParams.extraTools.push(
        <EditPurchaseOrderButtonWithModal purchaseData={purchaseOrderData} itemData={itemsData} />
      );
    }else if(Object.values(purchaseOrderData[0].updaetOrderItem).length > 0){
      dataForTable = Object.values(purchaseOrderData[0].updaetOrderItem);
      extraParams.extraTools.push(
        <ViewPurchaseOrderButtonWithModal purchaseData={purchaseOrderData}  />
      );
    }

    columnsForItem = [
      {
        accessorKey: "item",
        header: () => <div style={{ textAlign: "center" }}>Item</div>,
        cell: ({ row }) => <span>{row.original?.item}</span>,
      },
      {
        accessorKey: "itemId",
        header: () => <div style={{ textAlign: "center" }}>Item Id</div>,
        cell: ({ row }) => <span>{row.original?.itemId}</span>,
      },
      {
        accessorKey: "itemQuantity",
        header: () => <div style={{ textAlign: "center" }}>Quantity</div>,
        cell: ({ row }) => <span>{row.original?.quantity}</span>,
      },
      
      {
        accessorKey: "unitPrice",
        header: () => <div style={{ textAlign: "center" }}>Unit Price</div>,
        cell: ({ row }) => <span>{row.original?.unitPrice}</span>,
      },
      {
        accessorKey: "total",
        header: () => <div style={{ textAlign: "center" }}>Total</div>,
        cell: ({ row }) => (
          <span>{row.original?.total || "n/a"}</span>
        ),
      },
      {
        accessorKey: "discount",
        header: () => <div style={{ textAlign: "center" }}>Discount %</div>,
        cell: ({ row }) => (
          <span>{row.original?.discount || "n/a"}</span>
        ),
      },
      {
        accessorKey: "discountAmount",
        header: () => (
          <div style={{ textAlign: "center" }}>Discount Amount</div>
        ),
        cell: ({ row }) => (
          <span>{row.original?.discountAmount || "n/a"}</span>
        ),
      },
      {
        accessorKey: "finalAmount",
        header: () => <div style={{ textAlign: "center" }}>Total Amount</div>,
        cell: ({ row }) => (
          <span>{row.original?.finalAmount || "n/a"}</span>
        ),
      },
    ];
  }

  return (
    <div className="mt-2">
      <DataTable
        columns={columnsForItem}
        data={dataForTable}
        extraParams={extraParams}
      />
    </div>
  );
}

export default PurchaseOrderTable;
