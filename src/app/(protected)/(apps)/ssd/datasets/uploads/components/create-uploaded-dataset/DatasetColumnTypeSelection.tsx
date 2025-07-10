import React from "react";

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Checkbox } from "@/shadcn/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/shadcn/ui/select";
import {
  selectedColumnObjectFields,
  DatasetFields,
} from "../../../../components/type";

export default function DatasetColumnTypeSelection({
  selectedColumnSchema,
  sheetId,
  sheetNameSheetIdMap,
}: {
  selectedColumnSchema: Record<string, selectedColumnObjectFields[]>;
  sheetId: number;
  sheetNameSheetIdMap: Record<number, string>;
}) {
  let coldata = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];

  const selectDeselectColumns = (
    id: string,
    column: string,
    sheetId: number
  ) => {
    const checkbox = document.getElementById(id);

    const displayColumn = document.getElementById(
      `displayColumn_${column}_${sheetId}`
    ) as HTMLInputElement | null;
    const datasetColumn = document.getElementById(
      `datasetColumn_${column}_${sheetId}`
    ) as HTMLInputElement | null;

    if (!checkbox || !displayColumn || !datasetColumn) return;

    if (checkbox.getAttribute("data-state") == "unchecked") {
      displayColumn.disabled = false;
      datasetColumn.disabled = false;

      const tempArr = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].dbKey === column) {
          // tempArr.splice(i, 1);
          tempArr[i].checked = true;
          break;
        }
      }
    } else {
      // When a column is deselected, disable inputs
      displayColumn.disabled = true;
      datasetColumn.disabled = true;

      const tempArr = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].dbKey === column) {
          // tempArr.splice(i, 1);
          tempArr[i].checked = false;
          break;
        }
      }
    }
  };

  const handleDataTypeChange = (
    value: string,
    dbKey: string,
    sheetId: number
  ) => {
    console.log("Selected Value:", value);
    console.log("DB Key:", dbKey);
    console.log("Sheet ID:", sheetId);
    const tempArr = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].dbKey === dbKey) {
        // tempArr.splice(i, 1);
        tempArr[i].modifiedType = value;
        break;
      }
    }
    // You can now use these values wherever needed
  };

  const handleDatasetColumnChange = (value: string, column: string) => {
    const tempArr = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].dbKey === column) {
        tempArr[i].datasetColumn = value;
        break;
      }
    }
  };

  const columnDetailsSchema: DTColumnsProps<any>[] = [
    {
      accessorKey: "originalKey",
      header: "Excel Column",
      cell: ({ row }) => (
        <>
          <Checkbox
            id={`checkBox_${row.original.dbKey}_${sheetId}`}
            className="form-check-input"
            name={`checkBox_${row.original.dbKey}_${sheetId}`}
            defaultChecked={row.original.checked}
            onClick={(e) => {
              console.log("insidew on click for originla key");
              // Replace this with the corresponding JavaScript function call
              selectDeselectColumns(
                e.currentTarget.id,
                row.original.dbKey,
                sheetId
              );
            }}
          />

          <Label
            htmlFor={`checkBox_${row.original.dbKey}_${sheetId}`}
            className="form-check-label"
          >
            {row.original.originalKey}
          </Label>
        </>
      ),
    },
    {
      accessorKey: "modifiedKey",
      header: "Dataset Column",
      cell: ({ row }) => (
        <Input
          id={`displayColumn_${row.original.dbKey}_${sheetId}`}
          className="uniqColumnName"
          type="text"
          defaultValue={row.original.datasetColumn || "n/a"}
          disabled={!row.original.checked}
          onBlur={(e) =>
            handleDatasetColumnChange(e.target.value, row.original.dbKey)
          }
        />
      ),
    },
    {
      accessorKey: "type",
      header: "Data Type",
      cell: ({ row }) => {
        const typeOptions = ["STRING", "NUMBER", "DATE"];
        const selectedType = row.original.modifiedType?.toUpperCase() || "";

        return (
          <Select
            defaultValue={selectedType}
            onValueChange={(value) =>
              handleDataTypeChange(value, row.original.dbKey, sheetId)
            }
          >
            <SelectTrigger
              id={`datasetColumn_${row.original.dbKey}_${sheetId}`}
              className="selectTag typeMatch w-full"
              disabled={!row.original.checked}
            >
              <SelectValue placeholder="Select Column" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
  ];

  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
  };
  return (
    <>
      <DataTable
        columns={columnDetailsSchema}
        data={coldata}
        extraParams={extraParams}
      />
    </>
  );
}
