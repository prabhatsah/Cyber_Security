import CreateBillingButtonWithModal from "@/app/(protected)/(apps)/sales-crm/account-management/license/component/billing-form/billing-create";
import { BillingAccountProps } from "@/app/(protected)/(apps)/sales-crm/account-management/license/component/billing-form/billing-modal";
import { DataTable } from "@/ikon/components/data-table";
import { DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { ColumnDef } from "@tanstack/react-table";
//import { Link } from "lucide-react";
import { format } from "path";
import React from "react";
import CreatePurchaseOrderButtonWithModal from "../purchase_order_form";
import Link from "next/link"; // Ensure this import is added if using Next.js

interface DataTablePurchaseDataProps {
  purchaseData: any[];
}

interface PurchaseOrderProps {
  purchaseOrderIdentifier: string;
  purchaser: string;
  creationDate: string;
  purchaseOrderId: string;
  purchaseOrderObj?: Record<
    string,
    { itemId: string; quantity: number; parentId: string }
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

function PurchaseDataTable({ purchaseData }: DataTablePurchaseDataProps) {
  const extraParams: DTExtraParamsProps = {
    extraTools: [
      <CreatePurchaseOrderButtonWithModal purchaseData={purchaseData} />,
    ],
  };
  const columns: ColumnDef<PurchaseOrderProps>[] = [
    {
      accessorKey: "purchaseOrderId",
      header: () => (
        <div style={{ textAlign: "center" }}>Purchase Order Id</div>
      ),
      cell: (info: any) => (
        <Link
          className="underline text-blue-500 hover:text-blue-700 cursor-pointer"
          href={"../supplier-management/purchase-order/" + info.row.original.purchaseOrderId}
        >
          {info.getValue()}
        </Link>
      ),
    },
    {
      accessorKey: "purchaseOrderName",
      header: () => <div style={{ textAlign: "center" }}>Item</div>,
      cell: ({ row }) => <span>{row.original?.purchaseOrderName}</span>,
    },
    {
      accessorKey: "note",
      header: () => <div style={{ textAlign: "center" }}>Remark</div>,
      cell: ({ row }) => <span>{row.original?.note}</span>,
    },
    {
      accessorKey: "delivaryDate",
      header: () => <div style={{ textAlign: "center" }}>Delivery Date</div>,
      cell: ({ row }) => <span>{row.original?.delivaryDate}</span>,
    },
    {
      accessorKey: "vendor",
      header: () => <div style={{ textAlign: "center" }}>Vendor</div>,
      cell: ({ row }) => <span>{row.original?.vendor}</span>,
    },
    {
      accessorKey: "payment-terms",
      header: () => <div style={{ textAlign: "center" }}>Payment Terms</div>,
      cell: ({ row }) => (
        <span>{row.original?.["payment-terms"] || "n/a"}</span>
      ),
    },
    {
      accessorKey: "purchaseOrderStatus",
      header: () => <div style={{ textAlign: "center" }}>Status</div>,
      cell: ({ row }) => <span>{row.original?.purchaseOrderStatus}</span>,
    },
  ];
  return (
    <div className="mt-2">
      <DataTable
        columns={columns}
        data={purchaseData}
        extraParams={extraParams}
      />
    </div>
  );
}

export default PurchaseDataTable;
