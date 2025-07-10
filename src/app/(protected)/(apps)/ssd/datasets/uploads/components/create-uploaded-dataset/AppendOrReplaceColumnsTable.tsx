import React, { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
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

export default function AppendOrReplaceColumnsTable({
  selectedColumnSchema,
  sheetId,
  sheetNameSheetIdMap,
  datasetFields,
  allColumnEntry,
}: {
  selectedColumnSchema: Record<string, selectedColumnObjectFields[]>;
  sheetId: number;
  sheetNameSheetIdMap: Record<number, string>;
  datasetFields?: DatasetFields;
  allColumnEntry: any[];
}) {
  const [count, setCount] = useState(0);

  let existingDatasetName = allColumnEntry[0]["existingDatasetName"];

  useEffect(() => {
    const updatedSchema = selectedColumnSchema[sheetNameSheetIdMap[sheetId]];

    updatedSchema.forEach((col) => {
      const matchedField = Object.values(datasetFields ?? {}).find(
        (field: any) => field.title === col.originalKey
      );

      if (matchedField) {
        col.datasetColumn = matchedField.field;
      }
    });

    setCount((prev) => prev + 1);
  }, []);

  // Handle select change
  const handleColumnChange = (datasetField: string, selectedKey: string) => {
    const updatedSchema = selectedColumnSchema[sheetNameSheetIdMap[sheetId]]; // Create a new copy
    for (let i = 0; i < updatedSchema.length; i++) {
      if (updatedSchema[i].originalKey === selectedKey) {
        updatedSchema[i].datasetColumn = datasetField;
        break;
      }
    }

    setCount((prev) => prev + 1);
  };

  const columnTypes = useMemo(() => {
    const updatedColumnTypes: {
      [key: string]: {
        key: string | undefined;
        type: string | number | undefined;
      };
    } = {};

    selectedColumnSchema[sheetNameSheetIdMap[sheetId]]?.forEach((col) => {
      if (col.datasetColumn) {
        updatedColumnTypes[col.datasetColumn] = {
          type: col.type || "Not Selected",
          key: col.originalKey,
        };
      }
    });

    return updatedColumnTypes;
  }, [count]);

  const columnDetailsSchema: DTColumnsProps<any>[] = [
    {
      accessorKey: "originalKey",
      header: `${existingDatasetName} Dataset Column`,
      cell: ({ row }) => (
        <span>
          {row.original[`${existingDatasetName} Dataset Column`] || "n/a"}
        </span>
      ),
    },
    {
      accessorKey: "datasetType",
      header: "Original Data Type",
      cell: ({ row }) => (
        <span
          id={`datasetColumnSelectType_${row.original.datasetField}_${sheetId}`}
        >
          {row.original.datasetType || "n/a"}
        </span>
      ),
    },
    {
      accessorKey: "modifiedKey",
      header: "New Excel Column",
      cell: ({ row }) => {
        const datasetField = row.original.datasetField;
        return (
          <Select
            defaultValue={
              columnTypes[row.original.datasetField]?.["key"] || "-1"
            }
            onValueChange={(value) => handleColumnChange(datasetField, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Column" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1" disabled>
                Select Column
              </SelectItem>
              {selectedColumnSchema[sheetNameSheetIdMap[sheetId]]?.map(
                (col) => (
                  <SelectItem
                    key={col.originalKey}
                    value={col?.originalKey ?? ""}
                  >
                    {col.originalKey}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "",
      header: "New Excel Type",
      cell: ({ row }) => (
        <span
          id={`excelColumnSelectType_${row.original.datasetField}_${sheetId}`}
        >
          {columnTypes[row.original.datasetField]?.["type"] || "Not Selected"}
        </span>
      ),
    },
  ];

  return <DataTable columns={columnDetailsSchema} data={allColumnEntry} />;
}

//----------------------------------backup ---------------------------------------------//

// import React from "react";

// import { DataTable } from "@/ikon/components/data-table";
// import { DTColumnsProps } from "@/ikon/components/data-table/type";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectValue,
//   SelectTrigger,
// } from "@/shadcn/ui/select";
// export default function AppendOrReplaceColumnsTable({
//   selectedColumnSchema,
//   sheetId,
//   sheetNameSheetIdMap,
//   datasetFields,
//   allColumnEntry,
// }) {
//   let existingDatasetName = allColumnEntry[0]["existingDatasetName"];

//   const columnDetailsSchema: DTColumnsProps<any>[] = [
//     {
//       accessorKey: "originalKey",
//       header: `${existingDatasetName} Dataset Column`,
//       cell: ({ row }) => (
//         <span>
//           {" "}
//           {row.original[`${existingDatasetName} Dataset Column`] || "n/a"}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "datasetType",
//       header: "Original Data Type",
//       cell: ({ row }) => (
//         <span
//           id={`datasetColumnSelectType_${row.original.datasetField}_${sheetId}`}
//         >
//           {row.original.datasetType || "n/a"}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "modifiedKey",
//       header: "New Excel Column",
//       cell: ({ row }) => {
//         return (
//           <Select
//             id={`excelColumnSelect_${row.original.datasetField}_${sheetId}`}
//             className="form-select selectTag columnMatch"
//             defaultValue="-1"
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select Column" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="-1" disabled>
//                 Select Column
//               </SelectItem>
//               {selectedColumnSchema[sheetNameSheetIdMap[sheetId]]?.map(
//                 (col) => (
//                   <SelectItem key={col.originalKey} value={col.originalKey}>
//                     {col.originalKey}
//                   </SelectItem>
//                 )
//               )}
//             </SelectContent>
//           </Select>
//         );
//       },
//     },
//     {
//       accessorKey: "datasetType",
//       header: "new Excel type",
//       cell: ({ row }) => (
//         <span
//           id={`excelColumnSelectType_${row.original.datasetField}_${sheetId}`}
//         >
//           Not Selected
//         </span>
//       ),
//     },
//   ];

//   return (
//     <>
//       <DataTable columns={columnDetailsSchema} data={allColumnEntry} />
//     </>
//   );
// }
