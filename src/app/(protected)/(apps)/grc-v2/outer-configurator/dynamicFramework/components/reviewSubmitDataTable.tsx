import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react'
import { DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext';
import { Button } from '@/shadcn/ui/button';
import { ArrowDownCircle, ArrowRightCircle, Circle, Pencil, Trash2 } from 'lucide-react';
import { nestedData } from './frameworkStructure';
import SearchInput from '@/ikon/components/search-input';
import DataTableFrameworkColumnFilter from './columnFilter';
import { Card } from '@/shadcn/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';
const columnHelper = createColumnHelper<any>();

export default function ReviewSubmitDataTable() {
    const { frameworkFieldConfigData, frameworkStructureData } = DynamicFieldFrameworkContext();
    const [expanded, setExpanded] = useState({});
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const nesteddata = useMemo(() => nestedData(frameworkStructureData), [frameworkStructureData]);
    console.log(frameworkStructureData);
    console.log(nesteddata);
    const columns: ColumnDef<any>[] = frameworkFieldConfigData.map((field, index) => {
        const accessorKey = field.id;

        return columnHelper.accessor(accessorKey, {
            id: accessorKey,
            header: ({ table }) =>
                index === 0 ? (
                    <div className="flex items-start gap-2">
                        <Button
                            variant="outline"
                            size="smIcon"
                            onClick={table.getToggleAllRowsExpandedHandler()}
                        >
                            {table.getIsAllRowsExpanded() ? (
                                <ArrowDownCircle className="w-4 h-4" />
                            ) : (
                                <ArrowRightCircle className="w-4 h-4" />
                            )}
                        </Button>
                        <span className='self-center'>{field.name}</span>
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
                                    size="smIcon"
                                    onClick={row.getToggleExpandedHandler()}
                                >
                                    {row.getIsExpanded() ? (
                                        <ArrowDownCircle className="w-4 h-4" />
                                    ) : (
                                        <ArrowRightCircle className="w-4 h-4" />
                                    )}
                                </Button>
                            ) : (
                                <Button variant="outline" size="smIcon" disabled>
                                    <Circle className="w-3 h-3 text-muted-foreground" />
                                </Button>
                            )}
                            <div className='self-center truncate w-[150px]' title={value !== null && value !== undefined && value !== '' ? String(value) : '-'}>
                                {value !== null && value !== undefined && value !== '' ? String(value) : '-'}
                            </div>
                        </div>
                    );
                }

                // Dropdown display
                if (field.type === 'dropdown') {
                    const label =
                        field.extraInfo?.find((opt) => opt.value === value)?.label || '-';
                    return <span>{label}</span>;
                }

                return <div className='truncate w-[150px]' title={value !== null && value !== undefined && value !== '' ? String(value) : '-'}>
                    {value !== null && value !== undefined && value !== '' ? String(value) : '-'}
                </div>;
            },
        });
    });
    // columns.push(
    //     columnHelper.display({
    //         id: 'actions',
    //         header: () => <div className="text-center">Actions</div>,
    //         cell: ({ row }) => (
    //             <div className="flex gap-2 justify-center">
    //                 <Button variant="ghost" size="icon" onClick={() => { setUpdateRow(row.original), setOpenUpdateDynamicForm(true) }}>
    //                     <Pencil className="w-4 h-4 text-green-500" />
    //                 </Button>
    //                 <Button variant="ghost" size="icon" onClick={() => { deleteRows(row.original) }}>
    //                     <Trash2 className="w-4 h-4 text-red-500" />
    //                 </Button>
    //             </div>
    //         ),
    //     })
    // );
    const table = useReactTable({
        data: nesteddata,
        columns,
        state: {
            expanded,
            globalFilter,
        },
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    return (
        <>
            <div className="flex items-center justify-between gap-3 mb-3">
                <SearchInput
                    placeholder="Search ..."
                    onChange={(event: any) => table.setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-3">
                    <DataTableFrameworkColumnFilter table={table} />
                </div>
            </div>
            <Card className="rounded-xl shadow p-4 h-[35vh] overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                    <Table className="min-w-full border-t whitespace-nowrap bg-card-new">
                        <TableHeader className="sticky top-0 z-10 border-t bg-card-new">
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
                                        colSpan={frameworkFieldConfigData.length + 1}
                                        className="text-center py-6 text-muted-foreground"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </>
    )
}
