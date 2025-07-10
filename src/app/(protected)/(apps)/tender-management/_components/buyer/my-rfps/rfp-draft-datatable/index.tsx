"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { RowData } from "@tanstack/react-table";
import Link from "next/link";
import { RfpDraft } from "../../../../_utils/common/types";
import DraftTableActionDropdown from "../../../../my-rfpsold/components/draft-table-action-dropdown";
import CreateDraftButtonWithModal from "../create-draft";
import CreateDraftModalForm from "../create-draft/CreateDraftModalForm";
import SelectCardModal from "../rfp-details-page/template-selection-form";
import ChatWithTextareaModal from "../rfp-details-page/draft-editor-with-ai";
import moment from "moment";
import { Badge } from "@/shadcn/ui/badge";
import { addSampleTender } from "../../../../_utils/buyer/my-rfps/invoke-create-draft";

export default function RfpDraftDataTable({
  draftData,
  currUserId,
  userGroupDetails,
}: {
  draftData: any[];
  currUserId: string;
  userGroupDetails:any;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<any>("");
  const [isTemplateDialogOpen, setisTemplateDialogOpen] = useState(false);
  const [isFinalizeDraftDialogOpen, setisFinalizeDraftDialogOpen] =
    useState(false);

  const handleEdit = (row: any) => {
    setCurrentDraftId(row.id); // Pass the draftId to the form
    // setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentDraftId(null); // Clear the draftId when the dialog closes
    setisTemplateDialogOpen(false);
    setisFinalizeDraftDialogOpen(false);
  };

  const handleSelectTemplate = (row: any) => {
    setCurrentDraftId(row.id);
    setisTemplateDialogOpen(true);
  };

  const handleFinalizeDraft = (row: any) => {
    setCurrentDraftId(row.id);
    setisFinalizeDraftDialogOpen(true);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currencySymbols = {
      usd: "$", // US Dollar
      eur: "€", // Euro
      gbp: "£", // British Pound
      inr: "₹", // Indian Rupee
      jpy: "¥", // Japanese Yen
      aud: "A$", // Australian Dollar
      cad: "C$", // Canadian Dollar
      cny: "¥", // Chinese Yuan
      chf: "CHF", // Swiss Franc
      sek: "kr", // Swedish Krona
      nzd: "NZ$", // New Zealand Dollar
    };

    return currencySymbols[currencyCode] || currencyCode; // Default to currency code if not found
  };

  function getCurrentStage(stepTracker: any) {
    if (stepTracker["Publish"] === "COMPLETED") {
      return "Published";
    }

    for (const [key, value] of Object.entries(stepTracker)) {
      if (value === "IN PROGRESS") {
        return `${key.replace(/([A-Z])/g, " $1").trim()}`;
      }
    }

    return "All Stages Completed";
  }

  const columns: DTColumnsProps<any>[] = [
    // {
    //   accessorKey: "id",
    //   header: () => <div style={{ textAlign: "center" }}>Id</div>,
    //   cell: ({ row }) => <span>{row.original?.id}</span>,
    // },

    {
      accessorKey: "title",
      header: () => <div style={{ textAlign: "center" }}>Tender Subject</div>,
      cell: ({ row }) => (
        <Link href={"./my-rfps/" + (row.original?.id || "#")}>
          {row.original?.title || "N/A"}
        </Link>
      ),
    },
    {
      accessorKey: "referenceNumber",
      header: () => <div style={{ textAlign: "center" }}>Reference Number</div>,
      cell: ({ row }) => <span>{row.original?.referenceNumber || "N/A"}</span>,
    },
    {
      accessorKey: "industry",
      header: () => <div style={{ textAlign: "center" }}>Industry</div>,
      cell: ({ row }) => <span>{row.original?.industry || "N/A"}</span>,
    },
    {
      accessorKey: "department",
      header: () => <div style={{ textAlign: "center" }}>Department</div>,
      cell: ({ row }) => <span>{row.original?.department || "N/A"}</span>,
    },
    {
      accessorKey: "budget",
      header: () => <div style={{ textAlign: "center" }}>Estimated Value</div>,
      cell: ({ row }) => (
        <span>
          {row.original?.currency
            ? getCurrencySymbol(row.original.currency) +
              " " +
              row.original.budget
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "submissionDeadline",
      header: () => (
        <div style={{ textAlign: "center" }}>Submission Deadline</div>
      ),
      cell: ({ row }) => (
        <span>
          {row.original?.submissionDeadline
            ? moment(row.original.submissionDeadline).format("DD-MMM-YYYY")
            : "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "bidCount",
      header: () => <div style={{ textAlign: "center" }}>No Of Bids</div>,
      cell: ({ row }) => <span>{row.original?.bidCount ?? 0}</span>,
    },
    {
      accessorKey: "stepTracker",
      header: () => <div className="text-center w-full">Status</div>,

      cell: ({ row }) => (
        <div style={{ textAlign: "left" }}>
          <Badge>{getCurrentStage(row.original?.stepTracker)}</Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div style={{ textAlign: "left" }}>Actions</div>,
      cell: ({ row }) => {
        const rowData = row.original;

        if (rowData.publishedStatus !== "published") {
          return (
            <DraftTableActionDropdown
              row={rowData}
              draftId={row.original.id}
              onSelectTemplate={handleSelectTemplate}
              onFinalizeDraft={handleFinalizeDraft}
            />
          );
        } else {
          return (
            <>
              <span className="text-center">No action</span>
            </>
          );
        }
      },
    },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [
      <CreateDraftButtonWithModal
        currUserId={currUserId}
        userGroupDetails={userGroupDetails}
      />,
    ],
  };

  return (
    <>
      <Button variant="outline" onClick={addSampleTender}>
        Add Sample Tender
      </Button>

      <DataTable columns={columns} data={draftData} extraParams={extraParams} />

      {/* CreateDraftDialog */}
      {isDialogOpen && (
        <CreateDraftModalForm
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          draftId={currentDraftId} // Pass the draftId to the form
        />
      )}

      {isTemplateDialogOpen && (
        <SelectCardModal
          isOpen={isTemplateDialogOpen}
          onClose={handleCloseDialog}
          draftId={currentDraftId}
        />
      )}

      {isFinalizeDraftDialogOpen && (
        <ChatWithTextareaModal
          isOpen={isFinalizeDraftDialogOpen}
          onClose={handleCloseDialog}
          draftId={currentDraftId}
        />
      )}
    </>
  );
}
