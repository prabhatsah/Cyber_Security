"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import TemplateTable from ".";
import templates from "../../utils/template-data";
import { RfpTemplate } from "../../utils/types";
import TemplateModal from "../template-form";
import DraftTableActionDropdown from "../../../../my-rfpsold/components/draft-table-action-dropdown";
import TemplateTableActionDropdown from "./template-table-action-dropdown";
import OpenTemplateModal from "../template-form/open-template-modal";
import Link from "next/link";

export default function RFPTamplate({
  templates,
}: {
  templates: RfpTemplate[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState<any>("");

  const handleEdit = (row: any) => {
    setCurrentTemplateId(row.templateId); // Pass the draftId to the form
    setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentTemplateId(null); // Clear the draftId when the dialog closes
  };

  const columns: DTColumnsProps<RfpTemplate>[] = [
    // {
    //   accessorKey: "templateId",
    //   header: () => <div style={{ textAlign: "center" }}>Template Id</div>,
    //   cell: ({ row }) => <span>{row.original?.templateId}</span>,
    // },
    {
      accessorKey: "templateName",
      header: () => <div style={{ textAlign: "center" }}>Template Name</div>,
      cell: ({ row }) => (
        <Link
          href={"./my-templates/template-editor/" + row.original?.templateId}
        >
          {row.original?.templateName}
        </Link>
      ),
    },
    {
      accessorKey: "templateDepartment",
      header: () => (
        <div style={{ textAlign: "center" }}>Template Department</div>
      ),
      cell: ({ row }) => <span>{row.original?.templateDepartment}</span>,
    },
    {
      accessorKey: "templateSector",
      header: () => <div style={{ textAlign: "center" }}>Template Sector</div>,
      cell: ({ row }) => <span>{row.original?.templateSector}</span>,
    },
    {
      accessorKey: "templateProduct",
      header: () => <div style={{ textAlign: "center" }}>Template Product</div>,
      cell: ({ row }) => <span>{row.original?.templateProduct}</span>,
    },
    // {
    //   id: "actions",
    //   header: () => <div style={{ textAlign: "center" }}>Actions</div>,
    //   cell: ({ row }) => {
    //     const rowData = row.original;

    //     return (
    //       <TemplateTableActionDropdown row={rowData} onEdit={handleEdit} />
    //     );
    //   },
    // },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [<TemplateModal />],
  };

  return (
    <>
      <DataTable columns={columns} data={templates} extraParams={extraParams} />

      {isDialogOpen && (
        <OpenTemplateModal
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          templateId={currentTemplateId} // Pass the draftId to the form
        />
      )}
    </>
  );
}
