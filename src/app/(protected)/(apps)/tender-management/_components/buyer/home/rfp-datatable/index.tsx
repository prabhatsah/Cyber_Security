"use client";
import { RfpData } from "../../utils/types";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import React from "react";
import { Button } from "@/shadcn/ui/button";
import CreateRFPButtonWithModal from "../rfp-upload";
import { getTicket } from "@/ikon/utils/actions/auth";
import { DOWNLOAD_URL } from "@/ikon/utils/config/urls";

 const viewFile = async (data: File) => {
    console.log("View File", data);
    const ticket = await getTicket();

    /* const url =
       `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
       `&resourceId=${encodeURIComponent(data.resourceId)}` +
       `&resourceName=${encodeURIComponent(data.resourceName)}` +
       `&resourceType=${encodeURIComponent(data.resourceType)}`;*/

    //window.open(encodeURI(url), "_blank");
    let link = "";
    if (
      data.resourceType == "image/jpeg" ||
      data.resourceType == "image/png" ||
      data.resourceType == "text/plain" ||
      data.resourceType == "application/pdf" ||
      data.resourceType == "video/mp4" ||
      data.resourceType == "image/gif"
    ) {
      var pdf_newTab : any = window.open();
      link =
        `${DOWNLOAD_URL}?ticket=${ticket}` +
        `&resourceId=${data.resourceId}` +
        `&resourceType=${data.resourceType}`;
      pdf_newTab.document.write(
        `<iframe id='viewdocId' width='100%' height='100%' src=''></iframe><script>var iframe = document.getElementById('viewdocId'); iframe.src = '${link}'</script>`
      );
    } else {
      link =
        `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
        `&resourceId=${encodeURIComponent(data.resourceId)}` +
        `&resourceName=${encodeURIComponent(data.resourceName)}` +
        `&resourceType=${encodeURIComponent(data.resourceType)}`;
      window.open(encodeURI(link), "_blank");
    }
  };


const columns: DTColumnsProps<RfpData>[] = [
  {
    accessorKey: "rfpTitle",
    header: () => <div style={{ textAlign: "center" }}>Title</div>,
    cell: ({ row }) => <span>{row.original?.rfpTitle}</span>,
    //accessorFn: ({ row }) => "abc",
  },
  {
    accessorKey: "rfpDeadline",
    header: () => <div style={{ textAlign: "center" }}>Deadline</div>,
    cell: ({ row }) => (
      <span>{row.original.rfpDeadline ? row.original.rfpDeadline : "N/A"}</span>
    ),
  },
  {
    accessorKey: "sector",
    header: () => <div style={{ textAlign: "center" }}>Sector</div>,
    cell: ({ row }) => <span>{row.original?.sector}</span>,
  },
  {
    accessorKey: "resourceData.resourceName",
    header: () => <div style={{ textAlign: "center" }}>File</div>,
    cell: ({ row }) => (
      <span
        onClick={() => viewFile(row.original?.resourceData)}
        className={
          row.original.resourceData ? "cursor-pointer hover:text-primary" : ""
        }
      >
        {row.original?.resourceData
          ? row.original?.resourceData.resourceName
          : "No file"}
      </span>
    ),
  },
];

export default function RfpDataTable({ rfpData }: { rfpData: RfpData[] }) {
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [<CreateRFPButtonWithModal />],
  };

  return (
    <>
      <DataTable columns={columns} data={rfpData} extraParams={extraParams} />
    </>
  );
}
