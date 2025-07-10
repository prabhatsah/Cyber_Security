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
 
}: {
  mappings: Record<string, any>[];
  onEdit: (mapping: Record<string, any>) => void;
  onDelete: (id: string) => void;
 
}) {
  // Define columns
  const columns: DTColumnsProps<Record<string, any>>[] = [
    { accessorKey: 'framework1', header: 'Framework 1', cell: ({ row }) => row.original.framework1 || 'N/A' },
    { accessorKey: 'controlPolicy1', header: 'Control Policy 1', cell: ({ row }) => row.original.controlPolicy1 || 'N/A' },
    { accessorKey: 'objective1', header: 'Objective 1', cell: ({ row }) => row.original.objective1 || 'N/A' },
    { accessorKey: 'framework2', header: 'Framework 2', cell: ({ row }) => row.original.framework2 || 'N/A' },
    { accessorKey: 'controlPolicy2', header: 'Control Policy 2', cell: ({ row }) => row.original.controlPolicy2 || 'N/A' },
    { accessorKey: 'objective2', header: 'Objective 2', cell: ({ row }) => row.original.objective2 || 'N/A' },
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