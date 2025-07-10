'use client';

import React from 'react';
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps } from '@/ikon/components/data-table/type';
import { Button } from '@/shadcn/ui/button';
import { Trash2, Edit } from 'lucide-react';

export default function MultipleFrameworkMappingDataTable({
  mappings,
  onEdit,
  onDelete,
  frameworkDetailsData,
  

}: {
  mappings: Record<string, any>[];
  onEdit: (mapping: Record<string, any>) => void;
  onDelete: (id: string) => void;
  frameworkDetailsData:Record<string, any>[];
  

}) {

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

  // Define columns
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
    { accessorKey: 'notes', header: 'Notes', cell: ({ row }) => row.original.notes || 'N/A' },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} className="text-blue-400 hover:text-blue-300">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(row.original.id)} className="text-red-400 hover:text-red-300">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-md border border-gray-800 bg-gray-900">
      <DataTable data={mappings} columns={columns} />
    </div>
  );
}