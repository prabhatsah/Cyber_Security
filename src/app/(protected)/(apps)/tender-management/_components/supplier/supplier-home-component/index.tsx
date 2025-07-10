"use client";
import { DataTable } from "@/ikon/components/data-table";
import Link from "next/link";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Badge } from "@/shadcn/ui/badge";
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";

export default function SupplierHomeComponent({ data }: { data: any }) {
 const filteredData = data.map((obj) => {
   const cleaned :any = {};

   Object.entries(obj).forEach(([key, value]) => {
     // Skip if null or undefined
     if (value === null || value === undefined) return;

     // If it's an object with className
     if (
       typeof value === "object" &&
       "className" in value &&
       (value.className === "Undefined" || value.className === key)
     ) {
       return;
     }

     // Keep valid data
     cleaned[key] = value;
   });

   return cleaned;
 });
  console.log(data);
  console.log(filteredData);
  const columns: DTColumnsProps<any>[] = [
    {
      accessorKey: "title",
      header: () => <div style={{ textAlign: "center" }}>Tender Subject</div>,
      cell: ({ row }) => (
        <Link href={"./tender-management/" + row.original?.id}>
          {row.original?.title}
        </Link>
      ),
    },
    {
      accessorKey: "industry",
      header: () => <div style={{ textAlign: "center" }}>Industry</div>,
      cell: ({ row }) => (
        <span>
          {row.original.tender_department
            ? row.original?.tender_department
            : row.original?.industry }
        </span>
      ),
    },

    {
      accessorKey: "publishedStatus",
      header: () => <div style={{ textAlign: "center" }}>Status</div>,
      cell: ({ row }) => (
        <span>
          <Badge variant="default">Bid Pending</Badge>
        </span>
      ),
    },
    {
      accessorKey: "submissionDeadlineRemaining",
      header: () => <div style={{ textAlign: "center" }}>Time Remain</div>,
      cell: ({ row }) => (
        <span>
          {moment(row.original?.submissionDeadline).diff(moment(), "days") > 0
            ? moment(row.original?.submissionDeadline).diff(moment(), "days") +
              " days"
            : "Expired"}
        </span>
      ),
    },
    {
      accessorKey: "submissionDeadline",
      header: () => <div style={{ textAlign: "center" }}>Bid End Date</div>,
      cell: ({ row }) => (
        <>
          {row.original.submissionDeadline ? (
            <span>
              {moment(row.original?.submissionDeadline).format("DD-MMM-YYYY")}
            </span>
          ) : (
            <span>Not Specified</span>
          )}
        </>
      ),
    },

    {
      accessorKey: "publisherAccountName",
      header: () => <div style={{ textAlign: "center" }}>Tender Company</div>,
      cell: ({ row }) => <span>{row.original?.publisherAccountName}</span>,
    },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    //extraTools: [<CreateDraftButtonWithModal />],
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredData}
        extraParams={extraParams}
      />
    </>
  );
}
