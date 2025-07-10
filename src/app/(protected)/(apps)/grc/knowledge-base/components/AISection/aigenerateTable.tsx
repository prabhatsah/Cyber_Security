"use client";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { useMemo, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useKBContext } from "../knowledgeBaseContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { useRouter } from "next/navigation";

export default function PreviewTable({ open, setOpen, previewData }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; previewData: any[] }) {
  const router = useRouter();
  const [selectedRowMap, setSelectedRowMap] = useState<Record<string, any>>({});
  const [dropdownSelections, setDropdownSelections] = useState<Record<string, Record<string, string>>>({});
  const { setPolicyControls, policyControls } = useKBContext(); // Get existing policyControls

  // Add stable _rowKey to each row
  const dataWithRowKey = useMemo(() => {
    return previewData.map((row) => ({
      ...row,
      _rowKey: uuid(), // Use uuid for unique keys
    }));
  }, [previewData]);

  // Reset selections when previewData changes (but keep when reopening same table)
  useEffect(() => {
    setSelectedRowMap({});
    setDropdownSelections({});
  }, [previewData]);

  const columns: DTColumnsProps<Record<string, any>>[] = useMemo(() => {
    if (!dataWithRowKey || dataWithRowKey.length === 0) return [];

    const firstItem = dataWithRowKey[0];
    const formatHeader = (key: string) =>
      key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase());

    const dataColumns = Object.keys(firstItem)
      .filter((key) => key !== "_rowKey") // exclude helper key
      .map((key) => {
        const isPracticeKey = /practice/i.test(key);
        const isProceduralKey = /procedural/i.test(key);

        return {
          accessorKey: key,
          header: formatHeader(key),
          cell: ({ row }: any) => {
            const value = row.getValue(key);
            const valuesArray = typeof value === "string" ? value.split(",").map((v) => v.trim()) : [];

            const rowKey = row.original._rowKey;
            const shouldDropdown = (isPracticeKey || isProceduralKey) && valuesArray.length > 1;

            return shouldDropdown ? (
              <Select
                value={dropdownSelections[rowKey]?.[key] ?? valuesArray[0]}
                onValueChange={(selectedValue) => {
                  setDropdownSelections((prev) => ({
                    ...prev,
                    [rowKey]: {
                      ...prev[rowKey],
                      [key]: selectedValue,
                    },
                  }));
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  {valuesArray.map((val, idx) => (
                    <SelectItem key={idx} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="truncate max-w-[220px]" title={value}>
                {value}
              </div>
            );
          },
        };
      });

    const checkboxColumn: DTColumnsProps<any> = {
      id: "select",
      header: ({ table }) => {
        const allSelected = table.getRowModel().rows.every((row) => selectedRowMap[row.original._rowKey]);
        const someSelected = 
          !allSelected && 
          table.getRowModel().rows.some((row) => selectedRowMap[row.original._rowKey]);
        
        return (
          <Checkbox
            checked={allSelected}
            {...(someSelected ? { 'data-state': 'indeterminate' } : {})}
            onCheckedChange={(value) => {
              const newSelected: Record<string, any> = {};
              if (value) {
                table.getRowModel().rows.forEach((row) => {
                  newSelected[row.original._rowKey] = row.original;
                });
              }
              setSelectedRowMap(newSelected);
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={!!selectedRowMap[row.original._rowKey]}
          onCheckedChange={(value) => {
            const rowKey = row.original._rowKey;
            setSelectedRowMap((prev) => {
              const updated = { ...prev };
              if (value) {
                updated[rowKey] = row.original;
              } else {
                delete updated[rowKey];
              }
              return updated;
            });
          }}
          aria-label="Select row"
        />
      ),
      size: 48,
      enableSorting: false,
      enableHiding: false,
    };

    return [checkboxColumn, ...dataColumns];
  }, [dataWithRowKey, selectedRowMap, dropdownSelections]);

  const extraParams: DTExtraParamsProps = {
    pagination: false,
    rowSelection: true,
  };

  const handleSave = () => {
    const selectedRows = Object.values(selectedRowMap);
    if (selectedRows.length === 0) return;

    const controlNameKey = findMatchingKey(selectedRows[0], /(policy|control name|control policy)/i);
    const controlObjectiveKey = findMatchingKey(selectedRows[0], /(objective|control objective)/i);
    const descriptionKey = findMatchingKey(selectedRows[0], /description/i);
    const practiceKey = findMatchingKey(selectedRows[0], /practice/i);
    const proceduralKey = findMatchingKey(selectedRows[0], /procedural/i);

    // Process new selections
    const groupedByPolicy = selectedRows.reduce((acc, row) => {
      const policyName = row[controlNameKey] || '';
      if (!acc[policyName]) acc[policyName] = [];
      acc[policyName].push(row);
      return acc;
    }, {} as Record<string, any[]>);

    const newData = Object.entries(groupedByPolicy)
      .filter(([policyName]) => policyName !== 'undefined')
      .map(([policyName, rows]) => ({
        policyId: "",
        existingControlName: "",
        controlWeight: "",
        controlSource: "new",
        newControlName: policyName,
        indexName: uuid(),
        // controlObjectives: rows.map((row: any) => {
        controlObjectives: (rows as Record<string, any>[]).map((row) => {
          const rowKey = row._rowKey;
          const rowData = row.original || row;
          return {
            objectiveSource: "new",
            existingObjectiveName: "",
            newObjectiveName: rowData[controlObjectiveKey] || '',
            objectiveWeight: "",
            objectiveType: dropdownSelections[rowKey]?.[proceduralKey] || rowData[proceduralKey] || '',
            objectiveId: "",
            objectivePracticeArea: dropdownSelections[rowKey]?.[practiceKey] || rowData[practiceKey] || '',
            objectiveDescription: rowData[descriptionKey] || '',
            objectiveIndex: uuid(),
          };
        }),
      }));

    // Merge with existing data
    const mergedData = mergePolicyControls(policyControls || [], newData);
    
    setPolicyControls(mergedData);
    setOpen(false);
    router.refresh();
  };

  // Helper function to merge policy controls
  const mergePolicyControls = (existing: any[], newItems: any[]) => {
    const merged = [...existing];
    
    newItems.forEach(newItem => {
      const existingIndex = merged.findIndex(item => 
        item.newControlName === newItem.newControlName
      );
      
      if (existingIndex >= 0) {
        // Merge objectives if policy exists
        const existingObjectives = merged[existingIndex].controlObjectives;
        const newObjectives = newItem.controlObjectives;
        
        // Filter out duplicates by objective name
        const uniqueNewObjectives = newObjectives.filter((newObj: any) => 
          !existingObjectives.some((existingObj: any) => 
            existingObj.newObjectiveName === newObj.newObjectiveName
          )
        );
        
        merged[existingIndex].controlObjectives = [
          ...existingObjectives,
          ...uniqueNewObjectives
        ];
      } else {
        // Add new policy
        merged.push(newItem);
      }
    });
    
    return merged;
  };

  const findMatchingKey = (row: Record<string, any>, pattern: RegExp): string => {
    return Object.keys(row).find((key) => pattern.test(key)) || "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-none !w-screen !h-screen p-6 pt-4 flex flex-col">
        <DialogHeader>
          <DialogTitle>Preview Table</DialogTitle>
        </DialogHeader>
        <DataTable data={dataWithRowKey} columns={columns} extraParams={extraParams} />
        <DialogFooter>
          <Button onClick={handleSave}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}