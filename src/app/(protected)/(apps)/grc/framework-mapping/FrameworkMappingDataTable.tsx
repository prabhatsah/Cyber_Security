'use client';
import React, { useState } from "react";
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus } from "lucide-react";
import FrameworkMappingForm from "./FrameworkMappingForm"; // Import the FrameworkMappingForm
import MultipleFrameworkMappingInputForm from "./MultipleFrameworkMappingInputForm";
export default function FrameworkMappingDataTable({ controlsData, frameworkMappingData }: { controlsData: Record<string, any>[]; frameworkMappingData: Record<string, any>[] }) {
  const [openFrameworkForm, setOpenFrameworkForm] = useState(false); // Manage modal visibility
  const [mappingData, setMappingData] = useState<Record<string, any>[]>(() =>
    frameworkMappingData.flatMap(item => item.mapping)
  );
  const [editMappingData, setEditMappingData] = useState<Record<string, any> | null>(null);
  const [isMultipleFrameworkFormOpen, setIsMultipleFrameworkFormOpen] = useState(false); // State to handle modal visibility

  // const handleSaveMapping = (data: Record<string, any>) => {
  //   setMappingData((prev) => {
  //     // Check if the ID already exists in the previous mappings
  //     const exists = prev.some((mapping) => mapping.id === data.id);

  //     if (exists) {
  //       // Replace the existing mapping with the updated data
  //       return prev.map((mapping) =>
  //         mapping.id === data.id ? data : mapping
  //       );
  //     } else {
  //       // Append the new mapping to the data table
  //       return [...prev, data];
  //     }

  //   });
  //   setIsMultipleFrameworkFormOpen(false); // Close modal after saving
  // };

  const handleSaveMapping = (data: Record<string, any> | Record<string, any>[]) => {
    setMappingData((prev) => {
      if (Array.isArray(data)) {
        // Handle array of objects: Extract each mapping and add it separately
        return [
          ...prev,
          ...data.filter(mapping => mapping.framework1 && mapping.controlPolicy1 && mapping.objective1 && mapping.framework2 && mapping.controlPolicy2 && mapping.objective2)
        ];
      } else {
        // Handle single object: Add or update mapping
        const exists = prev.some((mapping) => mapping.id === data.id);
        return exists ? prev.map((mapping) => (mapping.id === data.id ? data : mapping)) : [...prev, data];
      }
    });
  
    setIsMultipleFrameworkFormOpen(false); // Close modal after saving
  };

  function openModal(row: Record<string, string> | null) {
    //setEditRow(row);
    setEditMappingData(null)
    setOpenFrameworkForm(true);
  }

  // Function to open the modal for MultipleFrameworkMappingInputForm
  const openModalForMultipleFrameworks = () => {
    setIsMultipleFrameworkFormOpen(true); // Show the modal
  };

  const closeModalForMultipleFrameworks = () => {
    setIsMultipleFrameworkFormOpen(false); // Hide the modal
  };



  function openEditMappingModal(row: Record<string, any>) {
    console.log(row, "Row data to be edited");

    setEditMappingData(row); // Set the row data to be edited
    setOpenFrameworkForm(true); // Open the PlanningForm
  }

  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "framework1",
      header: "Framework 1",
      cell: ({ row }) => {
        const value = row.original.framework1 || "N/A";
        const truncatedValue =
          value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>; // Add tooltip
      },
    },
    {
      accessorKey: "controlPolicy1",
      header: "Control Policy 1",
      cell: ({ row }) => {
        const value = row.original.controlPolicy1 || "N/A";
        const truncatedValue =
          value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>; // Add tooltip
      },
    },
    {
      accessorKey: "objective1",
      header: "Control Objective 1",
      cell: ({ row }) => {
        const value = row.original.objective1 || "N/A";
        const truncatedValue =
          value.length > 20 ? `${value.substring(0, 20)}...` : value;
        return <div title={value}>{truncatedValue}</div>; // Add tooltip
      },
    },
    {
      accessorKey: "framework2",
      header: "Framework 2",
      cell: ({ row }) => {
        const value = row.original.framework2 || "N/A";
        const truncatedValue =
          value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>; // Add tooltip
      },
    },
    {
      accessorKey: "controlPolicy2",
      header: "Control Policy 2",
      cell: ({ row }) => {
        const value = row.original.controlPolicy2 || "N/A";
        const truncatedValue =
          value.length > 50 ? `${value.substring(0, 50)}...` : value;
        return <div title={value}>{truncatedValue}</div>; // Add tooltip
      },
    },
    {
      accessorKey: "objective2",
      header: "Control Objective 2",
      cell: ({ row }) => {
        const value = row.original.objective2 || "N/A";
        const truncatedValue =
          value.length > 20 ? `${value.substring(0, 20)}...` : value;
        return <div title={value}>{truncatedValue}</div>; // Add tooltip
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const value = row.original.notes || "N/A";
        const truncatedValue =
          value.length > 20 ? `${value.substring(0, 20)}...` : value;
        return <div title={value}>{truncatedValue}</div>; // Add tooltip
      },
    },
  ];

  const extraParams: DTExtraParamsProps = {
    actionMenu: {
      items: [
        // {
        //   label: "Delete",
        //   // Add delete logic here
        // },
        {
          label: "Edit",
          onClick: (rowData) => {
            openEditMappingModal(rowData); // Open the PlanningForm with the row data
          }
        },
      ],
    },
    extraTools: [
      <IconButtonWithTooltip
        key="add-btn"
        tooltipContent="Add Mapping"
        //onClick={() => openModal(null)} // Open the modal on button click
        onClick={openModalForMultipleFrameworks} // Open the modal on button click
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
          onSave={handleSaveMapping} // Pass the save handler to the form
          frameworksData={controlsData} // Pass the control data to the form
          editMapping={editMappingData}
          frameworkMappingData={frameworkMappingData} // Pass the mapping data to the form
        />
      )}
      {/* Modal for MultipleFrameworkMappingInputForm */}
      {isMultipleFrameworkFormOpen && (
        <MultipleFrameworkMappingInputForm frameworksData={controlsData} onSaveMappings={handleSaveMapping} isOpen={isMultipleFrameworkFormOpen} // Pass the correct state
          setIsOpen={setIsMultipleFrameworkFormOpen} frameworkMappingData={frameworkMappingData}// Pass the state setter
        />
      )}


    </>
  );
}