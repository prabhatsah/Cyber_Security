"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import BidReviewModal from "../Bid-Review-Modal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";


export default function BidList({
  bidList,
  tenderId,
}: {
  bidList: any;
  tenderId: string;
}) {
  console.log(bidList);
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId");
  console.log(accountId);
  const columns: DTColumnsProps<any>[] = [
    {
      accessorKey: "bidId",
      header: () => <div style={{ textAlign: "center" }}>Bidder Name</div>,
      cell: ({ row }) => (
        <Link
          href={{
            pathname: `./${tenderId}/Bid/${row.original?.bidId}`,
            query: { accountId: row.original?.accountId },
          }}
          passHref
        >
          {row.original?.accountName}
        </Link>
      ),
    },
    {
      accessorKey: "bidCompletionTime",
      header: () => <div style={{ textAlign: "center" }}>Bid Time</div>,
      cell: ({ row }) => <span>{moment(row.original?.bidCompletionTime).format("DD-MMM-YYYY")}</span>,
    },
  ];

  const [isReviewFormOpen, openReviewForm] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);

  const handleCloseDialog = () => {
    openReviewForm(false);
  };
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    //extraTools: [<CreateRFPButtonWithModal />],

    actionMenu: {
      items: [
        {
          label: "Review",
          onClick: (rowData: any) => {
            openReviewForm(true);
            setSelectedBid(rowData);
          },
          visibility: (rowData: any) => {
            return true;
          },
        },
      ],
    },
  };

  return (
    <>
      <DataTable columns={columns} data={bidList} extraParams={extraParams} />
      {isReviewFormOpen && (
        <BidReviewModal
          isOpen={isReviewFormOpen}
          onClose={handleCloseDialog}
          data={selectedBid}
        />
      )}
    </>
  );
}
