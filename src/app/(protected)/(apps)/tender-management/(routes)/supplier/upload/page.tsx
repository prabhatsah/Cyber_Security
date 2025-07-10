"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import CreateResponseUploadButtonWithModal from "../../../_components/supplier/response-upload-form-button-component";
import uploadedResponseData from "../../../_utils/supplier/get-uploaded-response-data";

const columns: DTColumnsProps<any>[] = [
  {
    accessorKey: "Title",
    header: () => <div style={{ textAlign: "center" }}>Title</div>,
    cell: ({ row }) => <span>{row.original?.responseTitle}</span>,
  },
  {
    accessorKey: "Deadline",
    header: () => <div style={{ textAlign: "center" }}>Deadline</div>,
    cell: ({ row }) => (
      <span>
        {row.original.responseDeadline ? row.original.responseDeadline : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "Sector",
    header: () => <div style={{ textAlign: "center" }}>Sector</div>,
    cell: ({ row }) => <span>{row.original?.sector}</span>,
  },
  {
    accessorKey: "resourceData.resourceName",
    header: () => <div style={{ textAlign: "center" }}>File</div>,
    cell: ({ row }) => (
      <span>{row.original?.resourceData?.resourceName || "No file"}</span>
    ),
  },
];

export default function ResponseUpload() {
  const [responseData, setResponseData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await uploadedResponseData();
        console.log("Fetched Data:", data); // 🔍 Debugging
        setResponseData([...data]); // ✅ Force re-render
      } catch (error) {
        console.error("Error fetching response data:", error);
      }
    }
    fetchData();
  }, []);

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [<CreateResponseUploadButtonWithModal key="uploadButton" />],
  };

  console.log("Table Data:", responseData); // 🔍 Check if state updates

  return (
    <DataTable
      key={responseData.length} // ✅ Forces re-render
      columns={columns}
      data={responseData}
      extraParams={extraParams}
    />
  );
}
