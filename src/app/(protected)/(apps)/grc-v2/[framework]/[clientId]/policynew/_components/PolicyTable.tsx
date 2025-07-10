"use client";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { PolicySchema } from "../page";
import { DataTable } from "@/ikon/components/data-table";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { format } from "date-fns";
import PolicyOpenForm from "./PolicyOpenForm";
import PolicyForm from "./PolicyNewForm";
import {
  IconButtonWithTooltip,
  IconTextButtonWithTooltip,
} from "@/ikon/components/buttons";
import { FileIcon, Plus } from "lucide-react";
import UploadComponent from "./UploadSectionPolicy";
import { Button } from "@/shadcn/ui/button";
export default function PolicyTable({
  allUsers,
  policyDatas = [],
}: {
  allUsers: { label: string; value: string }[];
  policyDatas?: any[];
}) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [openPolicyForm, setOpenPolicyForm] = useState<boolean>(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Record<
    string,
    any
  > | null>(null);
  function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
  function getFileIcon(extension?: string) {
    switch (extension) {
      case "pdf":
        return <FileIcon className="h-4 w-4 text-red-500" />;
      case "doc":
      case "docx":
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileIcon className="h-4 w-4 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileIcon className="h-4 w-4 text-orange-500" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  }
  const columnsPolicyTable: DTColumnsProps<any>[] = [
    {
      accessorKey: "policyTitle",
      header: "Policy Title",
      cell: ({ row }) => (
        <div
          className="capitalize truncate w-[150px]"
          title={row.original.policyTitle}
        >
          {row.original.policyTitle}
        </div>
      ),
    },
    {
      accessorKey: "policyOwner",
      header: "Policy Owner",
      cell: ({ row }) => {
        const policyOwnerId = row.original.policyOwner;
        const policyOwner = policyOwnerId.length
          ? allUsers.find((u) => u.value === policyOwnerId)?.label ||
            policyOwnerId
          : "";
        return (
          <div className="capitalize truncate w-[120px]" title={policyOwner}>
            {policyOwner}
          </div>
        );
      },
    },
    {
      accessorKey: "processIncluded",
      header: "Process Included",
      cell: ({ row }) => (
        <div
          className="capitalize truncate w-[100px]"
          title={row.original.processIncluded}
        >
          {row.original.processIncluded}
        </div>
      ),
    },
    {
      accessorKey: "dateCreated",
      header: "Date Created",
      cell: ({ row }) => (
        <div className="truncate w-[100px]">
          {format(row.original.dateCreated, SAVE_DATE_FORMAT_GRC)}
        </div>
      ),
    },
    {
      accessorKey: "lastReviewed",
      header: "Last Reviewed",
      cell: ({ row }) => (
        <div className="truncate w-[100px]">
          {row.original.lastReviewed
            ? format(row.original.lastReviewed, SAVE_DATE_FORMAT_GRC)
            : "Not reviewed"}
        </div>
      ),
    },
    {
      accessorKey: "nextReview",
      header: "Next Review",
      cell: ({ row }) => (
        <div className="truncate w-[100px]">
          {row.original.nextReview
            ? format(row.original.nextReview, SAVE_DATE_FORMAT_GRC)
            : "Not scheduled"}
        </div>
      ),
    },
    {
      accessorKey: "attachment_name",
      header: "Attachment",
      cell: ({ row }) => (
        <div className="truncate w-[100px]">{row.original.attachment_name}</div>
      ),
    },
  ];

  const extraParamsPolicyTable: DTExtraParamsProps = {
    actionMenu: {
      items: [
        {
          label: "Edit",
          onClick: (rowData) => {
            setSelectedPolicy(rowData);
            setOpenPolicyForm(true);
          },
        },
      ],
    },
    extraTools: [
      <>
        <IconButtonWithTooltip
          key="add-risk-btn"
          tooltipContent="Add Policy"
          onClick={() => {
            setSelectedPolicy(null);
            setOpenPolicyForm(true);
          }}
        >
          <Plus />
        </IconButtonWithTooltip>
        <IconTextButtonWithTooltip
          key="add-Upload-btn"
          tooltipContent="Upload DOC"
          onClick={() => {
            setUploadDialogOpen(true);
          }}
        >
          Upload DOC
        </IconTextButtonWithTooltip>
      </>,
    ],
  };

  return (
    <>
      <DataTable
        columns={columnsPolicyTable}
        data={policyDatas}
        extraParams={extraParamsPolicyTable}
      />
      <PolicyForm
        openPolicyForm={openPolicyForm}
        setOpenPolicyForm={setOpenPolicyForm}
        editPolicyData={selectedPolicy}
        allUsers={allUsers}
      />
      <UploadComponent
        uploadDialogOpen={uploadDialogOpen}
        setUploadDialogOpen={setUploadDialogOpen}
        allUsers={allUsers}
      />
    </>
  );
}
