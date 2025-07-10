import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React from "react";
import { ControlDataMap } from "../../Type";
import { Button } from "@/shadcn/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";



// Column Schema
const columns: DTColumnsProps<ControlDataMap>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div style={{ textAlign: "center" }}>
        Name
      </div>
    ),
    //cell: ({ row }) => <span>{row.name || "n/a"}</span>,
//    cell: (info: any) => (
//     <Link className="underline" href={"../deal/details/" + info.row.original.dealIdentifier + "/products"}>
//         {info.getValue()}
//     </Link>
//   ),
    //getGroupingValue: (row) => `${row.name}`,
  },
  {
    accessorKey: "type",
    header: () => <div style={{ textAlign: "center" }}>Type</div>,
    //cell: ({ row }) => <span>{row.type|| "n/a"}</span>,
  },
  {
    accessorKey: "frameworks",
    header: () => <div style={{ textAlign: "center" }}>Framework</div>,
    cell: ({ row }) => {
      const frameworks = row.original.frameworks || [];
      return frameworks.length > 0 ? (
        <div className="flex flex-col">
          {frameworks.map((framework, index) => (
            <span key={index} className="text-sm text-gray-300">
              {framework.name} (Weight: {framework.weight})
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-500">n/a</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div style={{ textAlign: "center" }}>Status</div>,
    //cell: ({ row }) => <span>{row.status|| "n/a"}</span>,
  },
  {
    accessorKey: "lastReview",
    header: () => (
      <div style={{ textAlign: "center" }}>Last Review</div>
    ),
    //cell: ({ row }) => <span>{row.lastReview|| "n/a"}</span>,
  },
];

function ControlDataTable({ controlData}: { controlData: ControlDataMap[]}) {
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
   // extraTools: [<CreateDealButtonWithModal dealsData={dealsData} accountData={accountData} productData={productData}/>],
  };
  return (
    <DataTable columns={columns} data={controlData} extraParams={extraParams}/>
  );
}
export default ControlDataTable;
