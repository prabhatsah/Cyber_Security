import { flexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react'
import { FrameworkEntryWithSubRows } from './FrameworkOverview';
import { DTColumnsProps } from '@/ikon/components/data-table/type';
import SearchInput from '@/ikon/components/search-input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/ui/table';

export default function FrameworkDetailsTable({
    subScribeFrameworkDetails,
    frameworkColumns
}: {
    subScribeFrameworkDetails: FrameworkEntryWithSubRows[];
    frameworkColumns: DTColumnsProps<FrameworkEntryWithSubRows>[]
}) {
    const [expanded, setExpanded] = useState({});
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const table = useReactTable({
        data: subScribeFrameworkDetails,
        columns: frameworkColumns,
        state: {
            expanded,
            globalFilter,
        },
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        getSubRows: (row) => row.subRows ?? [],
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    return (
        <>
            <div className='w-full h-full flex flex-col gap-3'>
                <div className="flex items-center justify-between gap-3">
                    <div className="flex-grow flex items-center justify-between gap-3 overflow-hidden">
                        <SearchInput
                            placeholder="Search ..."
                            onChange={(event: any) => table.setGlobalFilter(event.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-hidden">
                    <Table className="border-t whitespace-nowrap bg-card-new">
                        <TableHeader className="sticky top-0 z-10 border-t bg-card-new">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className='text-left'>
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
                                        colSpan={frameworkColumns.length + 1}
                                        className="text-center py-6 text-muted-foreground"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}
