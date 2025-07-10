import React, { useState, useRef } from "react";
import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Button } from "@/shadcn/ui/button";
import AddPolicyTable from "./components/addPolicy";
import { useKBContext } from "./components/knowledgeBaseContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";
import FrameworkCreationForm from "./components/frameworkCreationForm";

export default function ControlDetailsTable({
  tableData,
}: {
  tableData: Record<string, any>[];
}) {
  const [openCustomePolicy, setOpenCustomPolicy] = useState<boolean>(false);
  const [selectedControls, setSelectedControls] = useState<
    Record<string, Set<string>>
  >({});
  const [openAlert, setOpenAlert] = useState(false);
  const { setSelectedControlsObj, setaddExistingControl } = useKBContext();

  // Ref to store the DataTable instance
  const tableRef = useRef<any>(null);

  const extractSelectedControlName = (selected: Record<string, string>[]) => {
    console.log(selected);
    if (selected) {
      const groupedObj = selected.reduce((acc: Record<string, any>, item) => {
        if (!acc[item.controlName]) {
          acc[item.controlName] = {
            policyId: item.policyId.toString(),
            existingControlName: item.controlName,
            controlWeight: item.controlWeight.toString(),
            controlSource: "existing",
            newControlName: "",
            indexName: crypto.randomUUID(),
            controlObjectives: [],
          };
        }
        acc[item.controlName].controlObjectives.push({
          objectiveSource: "existing",
          existingObjectiveName: item.name,
          newObjectiveName: "",
          objectiveWeight: item.controlObjWeight.toString(),
          objectiveType: item.controlObjType,
          objectiveId: item.controlObjId.toString(),
          objectivePracticeArea: item.practiceAreas,
          objectiveDescription: item.description,
          objectiveIndex: crypto.randomUUID(),
        });
        return acc;
      }, {});
      console.log(groupedObj);
      const groupedArray: any = Object.values(groupedObj);
      console.log(groupedArray);
      setaddExistingControl(groupedArray);
      const controlNameGroups: Record<string, any> = Object.groupBy(
        selected,
        ({ controlName }) => controlName
      );
      console.log(controlNameGroups);
      if (controlNameGroups) {
        setSelectedControlsObj(controlNameGroups);
      }
    }
  };

  const handleParentCheck = (
    parentKey: string,
    checked: boolean,
    objectiveIds: string[]
  ) => {
    setSelectedControls((prev) => ({
      ...prev,
      [parentKey]: checked ? new Set(objectiveIds) : new Set(),
    }));
  };

  const handleChildCheck = (
    parentKey: string,
    objId: string,
    checked: boolean
  ) => {
    setSelectedControls((prev) => {
      const updated = new Set(prev[parentKey] || []);
      checked ? updated.add(objId) : updated.delete(objId);
      return { ...prev, [parentKey]: updated };
    });
  };

  const isParentChecked = (parentKey: string, objectives: string[]) =>
    selectedControls[parentKey]?.size === objectives.length;

  const isChildChecked = (parentKey: string, objId: string) =>
    selectedControls[parentKey]?.has(objId);

  const getSelectedControlObjectives = () => {
    const selected: Record<string, any>[] = [];
    tableData.forEach((row) => {
      const parentKey = `${row.policyId}_${row.controlName}`;
      const isSelected = selectedControls[parentKey]?.has(row.controlObjId);
      if (isSelected) {
        selected.push({
          policyName: row.policyName,
          framework: row.framework,
          frameworkId: row.frameworkId,
          policyId: row.policyId,
          controlName: row.controlName,
          name: row.name,
          description: row.description,
          controlWeight: row.controlWeight,
          controlObjWeight: row.controlObjWeight,
          practiceAreas: row.practiceAreas,
          controlObjType: row.controlObjType,
          controlObjId: row.controlObjId,
        });
      }
    });
    return selected;
  };

  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "policyName",
    },
    {
      accessorKey: "policyId",
    },
    {
      accessorKey: "controlName",
      header: "Control Name",
      cell: () => {
        return <div></div>; // Empty cell for child rows
      },
      aggregatedCell: ({ row }) => {
        if (row.depth === 1) {
          const controlName = row.original.controlName;
          const policyId = row.original.policyId;
          const parentKey = `${policyId}_${controlName}`;
          const objectives = row.subRows.map((r) => r.original.controlObjId);
          const checked = isParentChecked(parentKey, objectives);
          return (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={checked}
                onCheckedChange={(val) =>
                  handleParentCheck(parentKey, Boolean(val), objectives)
                }
              />
              <span>{controlName}</span>
            </div>
          );
        }
        return null;
      },
    },
    {
      accessorKey: "name",
      header: "Control Objective",
      cell: ({ row }) => {
        const controlName = row.original.controlName;
        const policyId = row.original.policyId;
        const parentKey = `${policyId}_${controlName}`;
        const objId = row.original.controlObjId;
        const checked = isChildChecked(parentKey, objId);
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={checked}
              onCheckedChange={(val) =>
                handleChildCheck(parentKey, objId, Boolean(val))
              }
            />
            <span>{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "controlWeight",
      header: "Control Weight",
      cell: ({ row }) => {
        return <div>{row.original.controlObjWeight}</div>;
      },
      aggregatedCell: ({ row }) => {
        if (row.depth === 1) {
          return <div>{row.original.controlWeight}</div>;
        }
        return null;
      },
    },
    {
      accessorKey: "practiceAreas",
      header: "Practice Area",
    },
    {
      accessorKey: "controlObjType",
      header: "Procedural Type",
    },
    {
      accessorKey: "crossReference",
      header: "Cross Reference",
      cell: ({ row }) => {
        return row.original.crossReference ? (
          <div>{row.original.crossReference}</div>
        ) : (
          "N/A"
        );
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    grouping: false,
    pagination: false,
    extraTools: [
      <div key="expand-collapse-buttons" className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            if (tableRef.current) {
              tableRef.current.toggleAllRowsExpanded(true); // Expand all rows
            }
          }}
        >
          Expand All
        </Button>
        <Button
          size="sm"
          onClick={() => {
            if (tableRef.current) {
              tableRef.current.toggleAllRowsExpanded(false); // Collapse all rows
            }
          }}
        >
          Collapse All
        </Button>
      </div>,
    ],
    defaultGroups: ["policyName", "policyId"],
  };

  return (
    <>
      <div className="max-h-[450px] overflow-y-auto">
        {/* Pass the ref to the DataTable component */}
        <DataTable
          ref={tableRef}
          data={tableData}
          columns={columns}
          extraParams={extraParams}
        />
      </div>
      {openCustomePolicy && (
        <FrameworkCreationForm
          open={openCustomePolicy}
          setOpen={setOpenCustomPolicy}
        />
      )}
      <div className="flex justify-end pt-6">
        <Button
          size="sm"
          key="create-btn"
          onClick={() => {
            const selected = getSelectedControlObjectives();
            console.log("Selected Objectives:", selected);
            extractSelectedControlName(selected);
            setOpenCustomPolicy(true);
          }}
        >
          Proceed
        </Button>
      </div>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Selection Found</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenAlert(false), setOpenCustomPolicy(true);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
