"use client";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import ViewControlDetails from "./viewControlDetails";
import ViewSelectedControlDetails from "./ViewSelectedControl";

export default function ControlTable({ frameworkId, userIdNameMap, controlData }: {
  frameworkId: string;
  userIdNameMap: { value: string; label: string }[];
  controlData: Record<string, any>[];
}) {
  const [openControlViewForm, setOpenControlViewForm] = useState<boolean>(false);
  const [selectedControl, setSelectedControl] = useState<Record<string,any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedControls, setSelectedControls] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
      header: "Linked Controls",
      cell: ({ row }) => {
        const frameworks = row.original.Frameworks;

        if (!frameworks || frameworks.length === 0) {
          return <span className="text-muted-foreground">N/A</span>;
        }

        const allControls = frameworks.flatMap(
          (framework: any) => framework.controls || []
        );

        if (allControls.length === 0) {
          return (
            <span className="text-muted-foreground">No linked controls</span>
          );
        }

        const allIndices = allControls.map((control: any) => control.parentIndex || control.actualIndex);

        const uniqueIndices: string[] = Array.from(new Set(allIndices));
        uniqueIndices.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }) );

        return (
          // <div className="grid grid-cols-3 gap-1.5" style={{ maxWidth: "350px" }} >
          //   {uniqueIndices.map((index) => (
          //     <div key={index} className="px-2 py-1 text-xs font-medium text-foreground bg-muted rounded-md text-center" title={"Click here to see the details"}
          //       onClick={() => handleControlClick(index, allControls)}
          //     >{index}</div>
          //   ))}
          // </div>
          <div  className="grid grid-cols-3 gap-x-1 gap-y-2"  style={{ maxWidth: "350px" }}>
            {uniqueIndices.map((index) => (
              <button
                key={index}
                // className="text-primary text-sm font-medium underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                className="px-1.5 py-1 text-xs text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                // className="px-2 py-1 text-xs font-medium text-foreground bg-muted rounded-md text-center"
                title={`Click to see details for index: ${index}`} // More specific title
                onClick={() => handleControlClick(index, allControls)}
              >
                {index}
              </button>
            ))}
          </div>
        );
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    pagination: true,
    actionMenu: {
      items: [
        {
          label: "View",
          onClick: (rowData) => {
            openViewForm(rowData);
          },
        },
      ],
    },
    extraTools: [],
  };

  function openViewForm(row: Record<string, string> | null) {
    setOpenControlViewForm(true);
    setSelectedControl(row);
  }
  const handleControlClick = (index, allControls) => {
    const matchingControls = allControls.filter(
      (control: any) => (control.parentIndex || control.actualIndex) === index
    );

    setSelectedControls(matchingControls);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <DataTable data={controlData} columns={columns} extraParams={extraParams}/>

      {openControlViewForm && (
        <ViewControlDetails open={openControlViewForm} setOpen={setOpenControlViewForm} userIdNameMap={userIdNameMap} controlData={selectedControl}/>
      )}

      {isModalOpen && (
        <ViewSelectedControlDetails open={isModalOpen} setOpen={setIsModalOpen} controlsData={selectedControls} clickedIndex={selectedIndex} />
      )}
    </>
  );
}
