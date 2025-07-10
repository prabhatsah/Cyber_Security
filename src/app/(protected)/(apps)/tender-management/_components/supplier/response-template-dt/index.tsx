"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import TemplateTable from ".";
import { RfpTemplate } from "../../../_utils/common/types";
import TemplateTableActionDropdown from "../../buyer/my-templates/template-page/template-table-action-dropdown";
import OpenTemplateModal from "../../buyer/my-templates/template-form/open-template-modal";
import ResponseTemplateModal from "../response-template-modal-components/response-template-modal";
import OpenResponseTemplateModal from "../response-template-modal";
import Link from "next/link";


export default function ResponseTemplate({
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
        <Link href={"./template/template-editor/" + row.original?.templateId}>
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
    extraTools: [<ResponseTemplateModal />],
  };

  return (
    <>
      <DataTable columns={columns} data={templates} extraParams={extraParams} />

      {isDialogOpen && (
        <OpenResponseTemplateModal
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          templateId={currentTemplateId} // Pass the draftId to the form
        />
      )}
    </>
  );
}
