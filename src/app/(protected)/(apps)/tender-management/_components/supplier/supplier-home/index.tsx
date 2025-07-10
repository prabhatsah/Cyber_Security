"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { RfpDraft } from "../../../_utils/common/types";
import Link from "next/link";

const columns: DTColumnsProps<RfpDraft>[] = [
  // {
  //   accessorKey: "id",
  //   header: () => <div style={{ textAlign: "center" }}>Id</div>,
  //   cell: ({ row }) => <span>{row.original?.id}</span>,
  // },
  {
    accessorKey: "title",
    header: () => <div style={{ textAlign: "center" }}>Title</div>,
    cell: ({ row }) => (
      <Link href={"./my-rfps/" + row.original?.id}>{row.original?.title}</Link>
    ),
  },
  {
    accessorKey: "industry",
    header: () => <div style={{ textAlign: "center" }}>Industry</div>,
    cell: ({ row }) => <span>{row.original?.industry}</span>,
  },
  {
    accessorKey: "budget",
    header: () => <div style={{ textAlign: "center" }}>Budget</div>,
    cell: ({ row }) => <span>{row.original?.budget}</span>,
  },
  {
    accessorKey: "timeline",
    header: () => <div style={{ textAlign: "center" }}>Timeline</div>,
    cell: ({ row }) => <span>{row.original?.timeline}</span>,
  },
  //   {
  //     id: "actions",
  //     header: () => <div style={{ textAlign: "center" }}>Actions</div>,
  //     cell: ({ row }) => {
  //       const rowData = row.original;

  //     //   return (
  //     //     <DraftTableActionDropdown
  //     //       row={rowData}
  //     //       onEdit={handleEdit}
  //     //       onSelectTemplate={handleSelectTemplate}
  //     //       onFinalizeDraft={handleFinalizeDraft}
  //     //     />
  //     //   );
  //     },
  //   },
];
export default function SupplierHomeComponent({ rfpData }: { rfpData: any[] }) {
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    // extraTools: [<CreateRFPButtonWithModal />],
  };

  return (
    <>
      <DataTable columns={columns} data={rfpData} extraParams={extraParams} />
    </>
  );
}
