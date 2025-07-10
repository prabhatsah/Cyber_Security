"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { Loader2Icon } from "lucide-react";
import SoaEditForm from "./soaEditModal";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export interface SoaInstanceProps {
  id: string;
  frameworkName: string;
  controlName: string;
  objectiveIndex: number | string;
  objectiveName: string;
  objectiveDescription: string;
  applicable: string;
  justification: string;
}

export default function SoaDataTable({ soaData }: { soaData: any }) {
  const [transformedData, setTransformedData] = useState<SoaInstanceProps[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [openSoaForm, setOpenSoaForm] = useState(false);
  const [selectedSoa, setSelectedSoa] = useState<any>(null);
  useEffect(() => {
    async function prepareData() {
      try {
        // Fetch all SOA instances at once
        const allInstances = await getMyInstancesV2({
          processName: "SOA",
          predefinedFilters: { taskName: "edit soa task" },
        });

        // Create a lookup map: key = `${controlName}|${objectiveIndex}`, value = { applicable, justification }
        const instanceMap = new Map();
        allInstances?.forEach((instance) => {
          const key = `${instance.data.controlName}|${instance.data.objectiveIndex}`;
          instanceMap.set(key, {
            applicable: instance.data.applicable || "",
            justification: instance.data.justification || "",
          });
        });

        // Create and transform data in single pass
        const result = soaData.flatMap(
          (item) =>
            item.controls?.flatMap(
              (control) =>
                control.controlObjectives?.map((objective) => {
                  const key = `${control.controlName}|${objective.objectiveIndex}`;
                  const instanceData = instanceMap.get(key);

                  return {
                    id: `${item.frameworkName}-${control.controlName}-${objective.objectiveIndex}`,
                    frameworkName: item.frameworkName,
                    controlName: control.controlName,
                    objectiveIndex: objective.objectiveIndex,
                    objectiveName: objective.objectiveName,
                    objectiveDescription: objective.objectiveDescription,
                    applicable: instanceData?.applicable || "",
                    justification: instanceData?.justification || "",
                  };
                }) || []
            ) || []
        );

        setTransformedData(result);
      } catch (error) {
        console.error("Error preparing SOA data:", error);
        // Fallback to basic data if API fails
        const fallbackData = soaData.flatMap(
          (item) =>
            item.controls?.flatMap(
              (control) =>
                control.controlObjectives?.map((objective) => ({
                  id: `${item.frameworkName}-${control.controlName}-${objective.objectiveIndex}`,
                  frameworkName: item.frameworkName,
                  controlName: control.controlName,
                  objectiveIndex: objective.objectiveIndex,
                  objectiveName: objective.objectiveName,
                  objectiveDescription: objective.objectiveDescription,
                  applicable: "",
                  justification: "",
                })) || []
            ) || []
        );
        setTransformedData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    prepareData();
  }, [soaData]);

  const columns: DTColumnsProps<SoaInstanceProps>[] = [
    {
      accessorKey: "objectiveIndex",
      header: "Objective Index",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]">
          {row.getValue("objectiveIndex")}
        </div>
      ),
    },
    {
      accessorKey: "controlName",
      header: "Control Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]">
          {row.getValue("controlName")}
        </div>
      ),
    },
    {
      accessorKey: "objectiveName",
      header: "Objective Name",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]">
          {row.getValue("objectiveName")}
        </div>
      ),
    },
    {
      accessorKey: "objectiveDescription",
      header: "Description",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]">
          {row.getValue("objectiveDescription")}
        </div>
      ),
    },
    {
      accessorKey: "applicable",
      header: "Applicable",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]">{row.original.applicable}</div>
      ),
    },
    {
      accessorKey: "justification",
      header: "Justification",
      cell: ({ row }) => (
        <div className="truncate max-w-[300px]">
          {row.original.justification}
        </div>
      ),
    },
  ];

  const extraParams: DTExtraParamsProps = {
    pagination: false,
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75">
        <Loader2Icon className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <>
      <DataTable
        data={transformedData}
        columns={columns}
        extraParams={extraParams}
      />
      <SoaEditForm
        open={openSoaForm}
        setOpen={setOpenSoaForm}
        editRiskData={selectedSoa}
      />
    </>
  );
}
