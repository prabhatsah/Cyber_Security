"use client";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import SoaEditForm from "./soaEditModal";

type RefItem = {
  justification: string;
  applicable: string;
  clientId: string;
};
export interface SoaDataItem {
  customControlId: string;
  refId: string;
  title: string;
  description: string;
  domain: string;
  applicable: string;
  justification: string;
  Frameworks: Array<{
    frameworkId: string;
    frameworkName: string;
    controls: any[];
  }>;
}

export default function SoaDataTable({
  controlData,
  clientId,
  allUsers,
}: {
  controlData: SoaDataItem[];
  clientId: string;
  allUsers: { value: string; label: string }[];
}) {
  const [openSoaForm, setOpenSoaForm] = useState(false);
  const [selectedSoa, setSelectedSoa] = useState<SoaDataItem | null>(null);
  if (!controlData || controlData.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        No control data available
      </div>
    );
  }
  console.log("CONTROL DATA------", controlData);
  // const refIdMap: Record<string, RefItem> = soaInstanceData?.reduce(
  //   (acc: any, item: any) => {
  //     acc[item.refId] = {
  //       applicable: item.applicable,
  //       justification: item.justification,
  //       clientId: item.clientId,
  //     };
  //     return acc;
  //   },
  //   {}
  // );
  // for (const eachControl of controlData) {
  //   const match = refIdMap[eachControl.refId];
  //   if (match) {
  //     eachControl.applicable = match.applicable;
  //     eachControl.justification = match.justification;
  //   }
  // }
  // debugger;
  // console.log("UPDATED CONTROL DATA --- ", refIdMap);
  const columns: DTColumnsProps<SoaDataItem>[] = [
    {
      accessorKey: "refId",
      header: "Reference ID",
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]">{row.original.refId}</div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]" title={row.original.title}>
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="truncate max-w-[400px]"
          title={row.original.description}
        >
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "domain",
      header: "Domain",
      cell: ({ row }) => (
        <div className="truncate max-w-[200px]" title={row.original.domain}>
          {row.original.domain}
        </div>
      ),
    },
    {
      accessorKey: "applicable",
      header: "Applicable",
      cell: ({ row }) => (
        <div
          className="truncate max-w-[40px]"
          title={row.original.applicable || ""}
        >
          {row.original.applicable}
        </div>
      ),
    },
    {
      accessorKey: "justification",
      header: "Justification",
      cell: ({ row }) => (
        <div
          className="truncate max-w-[100px]"
          title={row.original.justification || ""}
        >
          {row.original.justification}
        </div>
      ),
    },
  ];

  const extraParams: DTExtraParamsProps = {
    pagination: true,
    actionMenu: {
      items: [
        {
          label: "Edit",
          onClick: (rowData) => {
            setSelectedSoa(rowData);
            setOpenSoaForm(true);
          },
        },
      ],
    },
  };

  return (
    <>
      <DataTable
        data={controlData}
        columns={columns}
        extraParams={extraParams}
      />

      {selectedSoa && (
        <SoaEditForm
          open={openSoaForm}
          setOpen={setOpenSoaForm}
          clientId={clientId}
          soaData={selectedSoa}
          frameworkId={selectedSoa.Frameworks[0]?.frameworkId}
          // frameworkName={selectedSoa.Frameworks[0]?.frameworkName}
          allUsers={allUsers}
        />
      )}
    </>
  );
}
