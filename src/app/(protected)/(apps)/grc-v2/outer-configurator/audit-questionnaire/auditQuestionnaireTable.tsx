"use client";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import AuditQuestionnaireForm from "./addQuestionnaireModal";
import { AuditQuestionaireData } from "./page";

export default function AuditQuestionnaireTable({
  userIdNameMap,
  customControlData,
}: {
  userIdNameMap: { value: string; label: string }[];
  customControlData: Record<string, any>[];
}) {
  // State to manage the form modal
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<Record<
    string,
    any
  > | null>(null);
  const [existingQuestionnaire, setExistingQuestionnaire] = useState<Record<
    string,
    any
  > | null>(null);

  //   const handleEditClick = (rowData: Record<string, any>) => {
  //     setSelectedControl(rowData);
  //     if (rowData.refId === "WEB-2") {
  //       setExistingQuestionnaire({
  //         questions: [
  //           "What is the defined Content Security Policy?",
  //           "How is the CSP enforced and monitored for violations?",
  //         ],
  //       });
  //     } else {
  //       setExistingQuestionnaire(null);
  //     }
  //     setFormOpen(true);
  //   };

  const handleEditClick = async (rowData: Record<string, any>) => {
    try {
      setSelectedControl(rowData);
      const existingData = await AuditQuestionaireData(rowData.customControlId);
      if (existingData && existingData.length > 0) {
        setExistingQuestionnaire(existingData[0]);
        console.log("Existing Questionnaire Data:", existingData[0]);
      } else {
        setExistingQuestionnaire(null);
      }

      setFormOpen(true);
    } catch (error) {
      console.error("Failed to fetch questionnaire data:", error);
      setFormOpen(false);
    }
  };

  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "refId",
      header: "Reference Id",
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]" title={row.getValue("title")}>
          {row.getValue("title") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "domain",
      header: "Domain",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]" title={row.getValue("domain")}>
          {row.getValue("domain") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ row }) => {
        const ownerIds = row.original.owner;
        const ownerNames = Array.isArray(ownerIds)
          ? ownerIds
              .map(
                (id: string) =>
                  userIdNameMap.find((user) => user.value === id)?.label
              )
              .filter((name) => name)
          : [];

        const fullNames = ownerNames.join(", ");
        const displayNames =
          fullNames.length > 20 ? `${fullNames.slice(0, 20)}...` : fullNames;

        return <span title={fullNames}> {displayNames || "N/A"} </span>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="truncate max-w-[300px]"
          title={row.getValue("description")}
        >
          {row.getValue("description") || "N/A"}
        </div>
      ),
    },
    {
      header: "Link Frameworks",
      cell: ({ row }) => {
        const frameworks = row.original.Frameworks;
        if (!frameworks || frameworks.length === 0) {
          return "N/A";
        }

        return (
          <>
            <div className="flex flex-col gap-2 items-start">
              {frameworks.map((framework: any) => (
                <button
                  key={framework.frameworkId}
                  className="px-2 py-1 text-xs font-medium text-foreground bg-muted rounded-md text-center"
                >
                  {framework.frameworkName}
                </button>
              ))}
            </div>
          </>
        );
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    pagination: true,
    actionMenu: {
      items: [
        {
          label: "Add/Edit Questionnaire",
          onClick: (rowData) => {
            handleEditClick(rowData);
          },
        },
      ],
    },
    extraTools: [],
  };

  return (
    <>
      <DataTable
        data={customControlData}
        columns={columns}
        extraParams={extraParams}
      />

      <AuditQuestionnaireForm
        open={isFormOpen}
        setOpen={setFormOpen}
        userIdNameMap={userIdNameMap}
        populatedData={selectedControl}
        existQuestionnaireData={existingQuestionnaire}
      />
    </>
  );
}
