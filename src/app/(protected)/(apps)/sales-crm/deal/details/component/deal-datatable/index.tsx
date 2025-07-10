"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React from "react";
import { DealData } from "../../../../components/type";
import { Button } from "@/shadcn/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import CreateDealButtonWithModal from "../create-deal";
import { format } from "date-fns";
import { VIEW_DATE_TIME_FORMAT } from "@/ikon/utils/config/const";

const getShortAbbreviation = (
  prodObj: Record<string, { productType: string }>
): string => {
  let shortHandString = "";

  for (const eachProduct in prodObj) {
    if (prodObj.hasOwnProperty(eachProduct)) {
      const productType = prodObj[eachProduct].productType;
      let productOutput = "";

      const words = productType.split(" ");
      for (const word of words) {
        productOutput += word.charAt(0);
      }
      productOutput += "-";
      shortHandString += productOutput;
    }
  }

  // Remove the trailing '-' and return the result
  return shortHandString.slice(0, -1);
};

// Column Schema
const columns: DTColumnsProps<DealData>[] = [
  {
    accessorKey: "dealName",
    header: ({ column }) => (
      <div style={{ textAlign: "center" }}>
         Deal Name
        {/* <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Deal Name
          <ArrowUpDown />
        </Button> */}
      </div>
    ),
   // cell: ({ row }) => <span>{row.original?.dealName || "n/a"}</span>,
   cell: (info: any) => (
    <Link className="underline" href={"../deal/details/" + info.row.original.dealIdentifier + "/products"}>
        {info.getValue()}
    </Link>
  ),
    getGroupingValue: (row) => `${row.dealName}`,
  },
  {
    accessorKey: "dealStatus",
    header: () => <div style={{ textAlign: "center" }}>Status</div>,
    cell: ({ row }) => <span>{row.original?.dealStatus || "n/a"}</span>,
  },
  {
    accessorKey: "leadIdentifier",
    header: () => <div style={{ textAlign: "center" }}>Source</div>,
    cell: ({ row }) => (
      <span>{row.original?.leadIdentifier ? "Lead" : "Deal"}</span>
    ),
  },
  {
    accessorKey: "productDetails",
    header: () => <div style={{ textAlign: "center" }}>Product Name</div>,
    cell: ({ row }) => (
      <span>{getShortAbbreviation(row.original.productDetails)}</span>
    ),
  },
  {
    accessorKey: "dealClosingDate",
    header: () => (
      <div style={{ textAlign: "center" }}>Expected Deal Closing Date</div>
    ),
    cell: ({ row }) => {
      const formattedDate =
        (row?.original?.dealClosingDate &&
          format(row.original.dealClosingDate, VIEW_DATE_TIME_FORMAT)) ||
        "n/a";
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "dealWonDate",
    header: () => <div style={{ textAlign: "center" }}>Won Date</div>,
    cell: ({ row }) => {
      const formattedDate =
        (row?.original?.dealWonDate &&
          format(row.original.dealWonDate, VIEW_DATE_TIME_FORMAT)) ||
        "n/a";
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "clientName",
    header: () => <div style={{ textAlign: "center" }}>Client Name</div>,
    cell: ({ row }) => <span>{row.original?.clientName || "n/a"}</span>,
  },
  {
    accessorKey: "accountName",
    header: () => <div style={{ textAlign: "center" }}>Account Name</div>,
    cell: ({ row }) => (
      <span>{row.original?.accountDetails?.accountName || "n/a"}</span>
    ),
  },
  {
    accessorKey: "expectedRevenue",
    header: () => (
      <div style={{ textAlign: "center" }}>Expected Revenue (USD)</div>
    ),
    cell: ({ row }) => <span>{row.original?.expectedRevenue || "n/a"}</span>,
  },
  {
    accessorKey: "updatedOn",
    header: () => <div style={{ textAlign: "center" }}>Updated On</div>,
    cell: ({ row }) => {
      const formattedDate =
        row?.original?.updatedOn &&
        format(row.original.updatedOn, VIEW_DATE_TIME_FORMAT);
      return <span>{formattedDate}</span>;
    },
  },
];

function DealDataTable({ dealsData, accountData, productData }: { dealsData: DealData[], accountData:any, productData:any }) {
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [<CreateDealButtonWithModal dealsData={dealsData} accountData={accountData} productData={productData}/>],
  };
  return (
    <DataTable columns={columns} data={dealsData} extraParams={extraParams} />
  );
}

export default DealDataTable;
