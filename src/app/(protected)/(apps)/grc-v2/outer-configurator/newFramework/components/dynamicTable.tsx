'use client';

import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  createColumnHelper,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/ui/table';
import { Button } from '@/shadcn/ui/button';
import { Card } from '@/shadcn/ui/card';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowDownCircle,
  ArrowRightCircle,
  Circle,
} from 'lucide-react';
import { Field } from './fieldConfigurationForm';

const columnHelper = createColumnHelper<any>();


type Props = {
  data: Record<string, string>[];
  fields: Field[];
};

export const DynamicTable = ({ data, fields }: Props) => {
  const [expanded, setExpanded] = useState({});

  const columns: ColumnDef<any>[] = fields.map((field, index) => {
    const accessorKey = field.name;

    return columnHelper.accessor(accessorKey, {
      id: accessorKey,
      header: ({ table }) =>
        index === 0 ? (
          <div className="flex items-start gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={table.getToggleAllRowsExpandedHandler()}
            >
              {table.getIsAllRowsExpanded() ? (
                <ArrowDownCircle className="w-4 h-4" />
              ) : (
                <ArrowRightCircle className="w-4 h-4" />
              )}
            </Button>
            <span>{field.name}</span>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            {field.name}
          </div>
        ),
      cell: ({ row, getValue }) => {
        const value = getValue();
        // Expandable logic for first column
        if (index === 0) {
          return (
            <div
              className="flex items-start gap-2"
              style={{ paddingLeft: `${row.depth * 1.5}rem` }}
            >
              {row.getCanExpand() ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={row.getToggleExpandedHandler()}
                >
                  {row.getIsExpanded() ? (
                    <ArrowDownCircle className="w-4 h-4" />
                  ) : (
                    <ArrowRightCircle className="w-4 h-4" />
                  )}
                </Button>
              ) : (
                <Button variant="outline" size="icon" disabled>
                  <Circle className="w-3 h-3 text-muted-foreground" />
                </Button>
              )}
              <div>{value}</div>
            </div>
          );
        }

        // Dropdown display
        if (field.type === 'dropdown') {
          const label =
            field.extraInfo?.find((opt) => opt.value === value)?.label || '-';
          return <span>{label}</span>;
        }

        return <span>{value}</span>;
      },
    });
  });

  // Add actions column (no accessorKey)
  columns.push(
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4 text-green-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    })
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (

    <>
      <Card className="rounded-xl shadow p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={fields.length + 1}
                  className="text-center py-6 text-muted-foreground"
                >
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};
