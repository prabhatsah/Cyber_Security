import React from "react";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { DataTable } from "@/ikon/components/data-table";

// export default function PreviewDatasetTable({ ...previewData , previewDataKeys}) {
//   return (
//     <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto h-[85vh]">
//       <div className="grid col-span-2 items-center gap-1.5">preview tab</div>
//     </div>
//   );
// }

export default function PreviewDatasetTable({
  previewData,
  previewDataKeys,
}: {
  previewData: any[];
  previewDataKeys: string[];
}) {
  const columns: DTColumnsProps<any>[] = previewDataKeys.map((key) => ({
    accessorKey: key,
    header: () => (
      <div style={{ textAlign: "center" }}>
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </div>
    ),
    cell: ({ row }) => <span>{row.original?.[key] || "n/a"}</span>,
  }));

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
  };

  return (
    <DataTable columns={columns} data={previewData} extraParams={extraParams} />
  );
}
