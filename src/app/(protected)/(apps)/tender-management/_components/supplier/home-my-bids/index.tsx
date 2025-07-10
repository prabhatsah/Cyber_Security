"use client";

import { DataTable } from "@/ikon/components/data-table";
import { Badge } from "@/shadcn/ui/badge";
import moment from "moment";
import Link from "next/link";

const SupplierHomeMyBids = ({ data }: { data: any }) => {
  const columns: DTColumnsProps<any>[] = [
    {
      accessorKey: "title",
      title : "Tender Subject",
      header: () => <div style={{ textAlign: "center" }}>Tender Subject</div>,
      cell: ({ row }) => {
        if (row.original?.publishedStatus === "External Source") {
          return (
            <Link
              href={"https://tender247.com" + row.original?.url}
              target="_blank"
            >
              {row.original?.title}
            </Link>
          );
        } else {
          return (
            <Link href={"./tender-management/" + row.original?.id}>
              {row.original?.title}
            </Link>
          );
        }
      },
    },
    {
      accessorKey: "industry",
      header: () => <div style={{ textAlign: "center" }}>Industry</div>,
      cell: ({ row }) => <span>{row.original?.industry}</span>,
    },

    {
      accessorKey: "publishedStatus",
      header: () => <div style={{ textAlign: "center" }}>Status</div>,
      cell: ({ row }) => (
        <span>
          <Badge variant="default">{ row.original?.publishedStatus ?? "Bid Pending"}</Badge>
        </span>
      ),
    },
    {
      accessorKey: "submissionDeadlineRemaining",
      header: () => <div style={{ textAlign: "center" }}>Time Remain</div>,
      cell: ({ row }) => (
        <span>
          {moment(row.original?.submissionDeadline).diff(moment(), "days")} days
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
      <DataTable columns={columns} data={data ? data : []} extraParams={extraParams} />
    </>
  );
};

export default SupplierHomeMyBids;
