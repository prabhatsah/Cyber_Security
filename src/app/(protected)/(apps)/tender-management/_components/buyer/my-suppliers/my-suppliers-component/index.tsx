"use client";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { approveSupplier, rejectSupplier } from "../../../../_utils/buyer/my-suppliers/approve-reject-supplier";

const columns: DTColumnsProps<any>[] = [
  {
    accessorKey: "accountName",
    header: () => <div style={{ textAlign: "center" }}>Company Name</div>,
    cell: ({ row }) => <span>{row.original?.accountName}</span>,
  },
  {
    accessorKey: "title",
    header: () => <div style={{ textAlign: "center" }}>Tender Name</div>,
    cell: ({ row }) => (
      <span>{row.original.title ? row.original.title : "N/A"}</span>
    ),
  },
  {
    accessorKey: "contactPerson",
    header: () => <div style={{ textAlign: "center" }}>Contact Person</div>,
    cell: ({ row }) => <span>{row.original?.contactPerson ? row.original?.contactPerson : 'N/A'}</span>,
  },
  {
    accessorKey: "contactEmail",
    header: () => <div style={{ textAlign: "center" }}>Contact Email</div>,
    cell: ({ row }) => (
      <span>{row.original.contactEmail ? row.original.contactEmail : "N/A"}</span>
    ),
  },
  // {
  //   accessorKey: "status",
  //   header: () => <div style={{ textAlign: "center" }}>Status</div>,
  //   cell: ({ row }) => (
  //     <span>{row.original.status ? row.original.status : "N/A"}</span>
  //   ),
  // },
];

export default function MySuppliersComponent({
  suppliers,
}: {
  suppliers: any;
}) {
  const extraParams: DTExtraParamsProps = {
    grouping: true,
    defaultGroups: ["accountName"],
    // actionMenu: {
    //   items: [
    //     {
    //       label: "Approve",
    //       onClick: (rowData: any) => {
    //         console.log("rowdata");
    //         approveSupplier(rowData.supplierId)
    //       },
    //       visibility: (rowData: any) => {
    //         return rowData.status==='Review';
    //       },
    //     },
    //     {
    //       label: "Reject",
    //       onClick: (rowData: any) => {
    //         console.log("rowdata");
    //         rejectSupplier(rowData.supplierId);
    //       },
    //       visibility: (rowData: any) => {
    //         return rowData.status === "Review";
    //       },
    //     },
    //   ],
    // },
  };

  return (
    <>
      <DataTable columns={columns} data={suppliers} extraParams={extraParams} />
    </>
  );
}
