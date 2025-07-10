// 'use client';
// import React, { useEffect, useState } from "react";
// import { DataTable } from "@/ikon/components/data-table";
// import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
// import { IconButtonWithTooltip } from "@/ikon/components/buttons";
// import { Plus } from "lucide-react";
// import FrameworkMappingForm from "./FrameworkMappingForm"; // Import the FrameworkMappingForm
// import MultipleFrameworkMappingInputForm from "./MultipleFrameworkMappingInputForm";
// export default function FrameworkMappingDataTable({ frameworkMappingData, frameworkDetailsData }: { frameworkMappingData: Record<string, any>[]; frameworkDetailsData: Record<string, any>[] }) {
//   const [openFrameworkForm, setOpenFrameworkForm] = useState(false); 
//   const [mappingData, setMappingData] = useState<Record<string, any>[]>([])
//   const [editMappingData, setEditMappingData] = useState<Record<string, any> | null>(null);
//   const [isMultipleFrameworkFormOpen, setIsMultipleFrameworkFormOpen] = useState(false); // State to handle modal visibility;
//   console.log("frameworkDetailsData --- ",frameworkDetailsData)
//   console.log("mappingData --- ",mappingData)

//   useEffect(() => {
//     setMappingData(
//       frameworkMappingData.flatMap(item => item.mapping)
//     )
//   }, [frameworkMappingData])
  

//   const handleSaveMapping = (data: Record<string, any> | Record<string, any>[]) => {
//     setMappingData((prev) => {
//       if (Array.isArray(data)) {
//         return [
//           ...prev,
//           ...data.filter(mapping => mapping.framework1 && mapping.controlPolicy1 && mapping.objective1 && mapping.framework2 && mapping.controlPolicy2 && mapping.objective2)
//         ];
//       } else {
//         // Handle single object: Add or update mapping
//         const exists = prev.some((mapping) => mapping.id === data.id);
//         return exists ? prev.map((mapping) => (mapping.id === data.id ? data : mapping)) : [...prev, data];
//       }
//     });

//     setIsMultipleFrameworkFormOpen(false); // Close modal after saving
//   };

//   function openModal(row: Record<string, string> | null) {
//     //setEditRow(row);
//     setEditMappingData(null)
//     setOpenFrameworkForm(true);
//   }

//   // Function to open the modal for MultipleFrameworkMappingInputForm
//   const openModalForMultipleFrameworks = () => {
//     setIsMultipleFrameworkFormOpen(true); // Show the modal
//   };

//   const closeModalForMultipleFrameworks = () => {
//     setIsMultipleFrameworkFormOpen(false); // Hide the modal
//   };



//   function openEditMappingModal(row: Record<string, any>) {
//     console.log(row, "Row data to be edited");

//     setEditMappingData(row); // Set the row data to be edited
//     setOpenFrameworkForm(true); // Open the PlanningForm
//   }

//   const columns: DTColumnsProps<Record<string, any>>[] = [
//     {
//       accessorKey: "framework1",
//       header: "Framework 1",
//       cell: ({ row }) => {
//         const value = row.original.framework1 || "N/A";
//         const truncatedValue =
//           value.length > 50 ? `${value.substring(0, 50)}...` : value;
//         return <div title={value}>{truncatedValue}</div>; // Add tooltip
//       },
//     },
//     {
//       accessorKey: "controlPolicy1",
//       header: "Control Policy 1",
//       cell: ({ row }) => {
//         const value = row.original.controlPolicy1 || "N/A";
//         const truncatedValue =
//           value.length > 50 ? `${value.substring(0, 50)}...` : value;
//         return <div title={value}>{truncatedValue}</div>; // Add tooltip
//       },
//     },
//     {
//       accessorKey: "framework2",
//       header: "Framework 2",
//       cell: ({ row }) => {
//         const value = row.original.framework2 || "N/A";
//         const truncatedValue =
//           value.length > 50 ? `${value.substring(0, 50)}...` : value;
//         return <div title={value}>{truncatedValue}</div>; // Add tooltip
//       },
//     },
//     {
//       accessorKey: "controlPolicy2",
//       header: "Control Policy 2",
//       cell: ({ row }) => {
//         const value = row.original.controlPolicy2 || "N/A";
//         const truncatedValue =
//           value.length > 50 ? `${value.substring(0, 50)}...` : value;
//         return <div title={value}>{truncatedValue}</div>; // Add tooltip
//       },
//     },
//     {
//       accessorKey: "notes",
//       header: "Notes",
//       cell: ({ row }) => {
//         const value = row.original.notes || "N/A";
//         const truncatedValue =
//           value.length > 20 ? `${value.substring(0, 20)}...` : value;
//         return <div title={value}>{truncatedValue}</div>; // Add tooltip
//       },
//     },
//   ];

//   const extraParams: DTExtraParamsProps = {
//     actionMenu: {
//       items: [
//         // {
//         //   label: "Delete",
//         //   // Add delete logic here
//         // },
//         {
//           label: "Edit",
//           onClick: (rowData) => {
//             openEditMappingModal(rowData); // Open the PlanningForm with the row data
//           }
//         },
//       ],
//     },
//     extraTools: [
//       <IconButtonWithTooltip
//         key="add-btn"
//         tooltipContent="Add Mapping"
//         //onClick={() => openModal(null)} // Open the modal on button click
//         onClick={openModalForMultipleFrameworks} // Open the modal on button click
//       >
//         <Plus />
//       </IconButtonWithTooltip>,
//     ],
//   };

//   return (
//     <>
//       <DataTable data={mappingData} columns={columns} extraParams={extraParams} />
//       {openFrameworkForm && (
//         <FrameworkMappingForm
//           open={openFrameworkForm}
//           setOpen={setOpenFrameworkForm}
//           onSave={handleSaveMapping}

//           editMapping={editMappingData}
//           frameworkMappingData={frameworkMappingData}
//           frameworkDetailsData={frameworkDetailsData}
//         />
//       )}
//       {/* Modal for MultipleFrameworkMappingInputForm */}
//       {isMultipleFrameworkFormOpen && (
//         <MultipleFrameworkMappingInputForm
//           onSaveMappings={handleSaveMapping}
//           isOpen={isMultipleFrameworkFormOpen}
//           setIsOpen={setIsMultipleFrameworkFormOpen}
//           frameworkMappingData={frameworkMappingData}
//           frameworkDetailsData={frameworkDetailsData}
//         />
//       )}


//     </>
//   );
// }

'use client';
import React, { useEffect, useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import FrameworkMappingForm from "./FrameworkMappingForm"; // Import the FrameworkMappingForm
import MultipleFrameworkMappingInputForm from "./MultipleFrameworkMappingInputForm";

export default function FrameworkMappingDataTable({ frameworkMappingData, frameworkDetailsData }: { frameworkMappingData: Record<string, any>[]; frameworkDetailsData: Record<string, any>[] }) {
  const [openFrameworkForm, setOpenFrameworkForm] = useState(false);
  const [mappingData, setMappingData] = useState<Record<string, any>[]>([]);
  const [editMappingData, setEditMappingData] = useState<Record<string, any> | null>(null);
  const [isMultipleFrameworkFormOpen, setIsMultipleFrameworkFormOpen] = useState(false); // State to handle modal visibility;

  useEffect(() => {
    setMappingData(
      frameworkMappingData.flatMap(item => item.mapping)
    );
  }, [frameworkMappingData]);

  const handleSaveMapping = (data: Record<string, any> | Record<string, any>[]) => {
    setMappingData((prev) => {
      if (Array.isArray(data)) {
        return [
          ...prev,
          ...data.filter(mapping => mapping.framework1 && mapping.controlPolicy1 && mapping.framework2 && mapping.controlPolicy2)
        ];
      } else {
        const exists = prev.some((mapping) => mapping.id === data.id);
        return exists ? prev.map((mapping) => (mapping.id === data.id ? data : mapping)) : [...prev, data];
      }
    });
    setIsMultipleFrameworkFormOpen(false);
  };

  function openModal(row: Record<string, string> | null) {
    setEditMappingData(null);
    setOpenFrameworkForm(true);
  }

  const openModalForMultipleFrameworks = () => {
    setIsMultipleFrameworkFormOpen(true);
  };

  const closeModalForMultipleFrameworks = () => {
    setIsMultipleFrameworkFormOpen(false);
  };

  function openEditMappingModal(row: Record<string, any>) {
    setEditMappingData(row);
    setOpenFrameworkForm(true);
  }

  // Helper function to get framework name by ID
  const getFrameworkName = (id: string) => {
    const framework = frameworkDetailsData.find(fd => fd.id === id);
    return framework ? framework.name : "N/A";
  };

  // Helper function to get control policy details by ID
  const getControlPolicyDetails = (frameworkId: string, controlPolicyId: string) => {
    const framework = frameworkDetailsData.find(fd => fd.id === frameworkId);
    if (framework && framework.entries) {
      const entry = framework.entries[controlPolicyId];
      if (entry) {
        if (entry.title) {
          return `${entry.index} - ${entry.title}`;
        } else if (entry.description) {
          return `${entry.index} - ${entry.description}`;
        }
      }
    }
    return "N/A";
  };

  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "framework1",
      header: "Framework 1",
      cell: ({ row }) => {
        const value = getFrameworkName(row.original.framework1);
        const truncatedValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>;
      },
    },
    {
      accessorKey: "controlPolicy1",
      header: "Control Policy 1",
      cell: ({ row }) => {
        const value = getControlPolicyDetails(row.original.framework1, row.original.controlPolicy1);
        const truncatedValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>;
      },
    },
    {
      accessorKey: "framework2",
      header: "Framework 2",
      cell: ({ row }) => {
        const value = getFrameworkName(row.original.framework2);
        const truncatedValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>;
      },
    },
    {
      accessorKey: "controlPolicy2",
      header: "Control Policy 2",
      cell: ({ row }) => {
        const value = getControlPolicyDetails(row.original.framework2, row.original.controlPolicy2);
        const truncatedValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>;
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const value = row.original.notes || "N/A";
        const truncatedValue = value.length > 20 ? `${value.substring(0, 20)}...` : value;
        return <div title={value}>{truncatedValue}</div>;
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    actionMenu: {
      items: [
        {
          label: "Edit",
          onClick: (rowData) => {
            openEditMappingModal(rowData);
          }
        },
      ],
    },
    extraTools: [
      <IconButtonWithTooltip
        key="add-btn"
        tooltipContent="Add Mapping"
        onClick={openModalForMultipleFrameworks}
      >
        <Plus />
      </IconButtonWithTooltip>,
    ],
  };

  return (
    <>
      <DataTable data={mappingData} columns={columns} extraParams={extraParams} />
      {openFrameworkForm && (
        <FrameworkMappingForm
          open={openFrameworkForm}
          setOpen={setOpenFrameworkForm}
          onSave={handleSaveMapping}
          editMapping={editMappingData}
          frameworkMappingData={frameworkMappingData}
          frameworkDetailsData={frameworkDetailsData}
        />
      )}
      {isMultipleFrameworkFormOpen && (
        <MultipleFrameworkMappingInputForm
          onSaveMappings={handleSaveMapping}
          isOpen={isMultipleFrameworkFormOpen}
          setIsOpen={setIsMultipleFrameworkFormOpen}
          frameworkMappingData={frameworkMappingData}
          frameworkDetailsData={frameworkDetailsData}
        />
      )}
    </>
  );
}