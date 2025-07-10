"use client";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { format } from "date-fns";
import PolicyForm from "./PolicyNewForm";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { BadgeCheckIcon, FileIcon, Plus } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/shadcn/ui/drawer";
import { CustomBadge } from "@/shadcn/ui/custom-badge";
import { Badge } from "@/shadcn/ui/badge";
import { UA_RESOURCE_URL } from "@/ikon/utils/config/urls";

export default function PolicyTable({
  allUsers,
  policyDatas = [],
}: {
  allUsers: { label: string; value: string }[];
  policyDatas?: any[];
}) {
  const [openPolicyForm, setOpenPolicyForm] = useState<boolean>(false);
  const [openActivityLogs, setOpenActivityLogs] = useState(false);
  const [previewOpenIndex, setPreviewOpenIndex] = useState<number | null>(null);
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

  function getFileIcon() {
    return <FileIcon className="h-4 w-4 text-blue-500" />;
    // switch (extension) {
    //   case "pdf":
    //     return <FileIcon className="h-4 w-4 text-red-500" />;
    //   case "doc":
    //   case "docx":
    //     return <FileIcon className="h-4 w-4 text-blue-500" />;
    //   case "xls":
    //   case "xlsx":
    //     return <FileIcon className="h-4 w-4 text-green-500" />;
    //   case "ppt":
    //   case "pptx":
    //     return <FileIcon className="h-4 w-4 text-orange-500" />;
    //   default:
    //     return <FileIcon className="h-4 w-4" />;
    // }
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
      accessorKey: "attachment",
      header: "Attachment",
      cell: ({ row }) => {
        const attachment = row.original.attachment;

        if (!attachment || !attachment.url) {
          return <div className="text-muted-foreground">No file</div>;
        }

        return (
          <div className="flex items-center gap-2">
            {getFileIcon()}
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-blue-600 hover:underline"
              onClick={() => {
                setPreviewOpenIndex(
                  policyDatas.findIndex((p) => p.id === row.original.id)
                );
              }}
            >
              <span className="truncate max-w-[150px]" title={attachment.url}>
                {attachment.url}
              </span>
            </Button>
            {/* <span className="text-xs text-muted-foreground">
              {formatFileSize(attachment.size)}
            </span> */}
          </div>
        );
      },
    },
    {
      accessorKey: "policyStatus",
      header: "Status",
      cell: ({ row }) => (
        <div className="truncate w-[100px]">
          {row.original.policyStatus ? row.original.policyStatus : "Draft"}
        </div>
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
        {
          label: "Preview",
          onClick: (rowData) => {
            setPreviewOpenIndex(
              policyDatas.findIndex((p) => p.id === rowData.id)
            );
          },
        },

        {
          label: "Download",
          onClick: (rowData) => {
            // window.open(rowData?.attachment?.url, "_blank");
            window.open(
              encodeURI(
                UA_RESOURCE_URL + "/" + "S2GRC" + "/" + rowData?.attachment?.url
              )
            );
          },
        },
        {
          label: "Activity Logs",
          onClick: async (rowData) => {
            setSelectedPolicy(rowData);
            setOpenActivityLogs(true);
          },
        },
      ],
    },
    extraTools: [
      <IconButtonWithTooltip
        key="add-policy-btn"
        tooltipContent="Add Policy"
        onClick={() => {
          setSelectedPolicy(null);
          setOpenPolicyForm(true);
        }}
      >
        <Plus />
      </IconButtonWithTooltip>,
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

      {previewOpenIndex !== null &&
        policyDatas[previewOpenIndex]?.attachment && (
          <Dialog
            open={previewOpenIndex !== null}
            onOpenChange={(open) => (open ? null : setPreviewOpenIndex(null))}
          >
            <DialogContent className="h-[90vh] max-w-[90vw] w-full flex flex-col">
              <DialogHeader>
                <DialogTitle>
                  {policyDatas[previewOpenIndex].attachment.url}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0">
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    `https://ikoncloud-uat.keross.com/portal/uaresource/S2GRC/${policyDatas[previewOpenIndex].attachment.url}`
                  )}&embedded=true`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Excel Preview"
                />
              </div>
              <div className="flex justify-end p-4 gap-3">
                <Button
                  onClick={() =>
                    window.open(
                      `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        `https://ikoncloud-uat.keross.com/portal/uaresource/S2GRC/${policyDatas[previewOpenIndex].attachment.url}`
                      )}&embedded=true`,
                      "_blank"
                    )
                  }
                >
                  Open in New Tab
                </Button>
                <Button
                  onClick={() => {
                    console.log(
                      "policyDatas[previewOpenIndex].attachment--",
                      policyDatas[previewOpenIndex].attachment
                    );
                    window.open(
                      encodeURI(
                        UA_RESOURCE_URL +
                          "/" +
                          "S2GRC" +
                          "/" +
                          policyDatas[previewOpenIndex].attachment.url
                      )
                    );
                  }}
                >
                  Download
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

      <Drawer
        open={openActivityLogs}
        onOpenChange={setOpenActivityLogs}
        direction="right"
      >
        <DrawerContent className="h-full w-[400px] ml-auto rounded-l-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle>Activity Logs</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {selectedPolicy?.revisions?.length ? (
              <div className="space-y-6">
                {selectedPolicy.revisions.map((log: any, index: number) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge
                          variant="outline"
                          className="h-6 px-2 bg-blue-500 text-white font-normal hover:bg-blue-600 gap-1"
                        >
                          <BadgeCheckIcon className="h-4 w-4" />
                          Version {log.version}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(Number(log.date)), "PPpp")}
                        </p>
                      </div>
                      <CustomBadge
                        label={
                          allUsers.find((u) => u.value === log.author)?.label ||
                          log.author
                        }
                        bgColor="#e9d85e"
                        txtColor="#100101"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Changes:</span>{" "}
                        {log.summaryOfChanges}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No activity logs available
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
