'use client';

import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    createColumnHelper,
    flexRender,
    type ColumnDef,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { Fragment, useState } from 'react';
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
    PlusSquare,
} from 'lucide-react';
import { DynamicFieldConfigFormDataWithId, DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext';
import FrameworkStructureForm from './frameworkStructureForm';
import DataTableFrameworkColumnFilter from './columnFilter';
import SearchInput from '@/ikon/components/search-input';
import { Checkbox } from '@/shadcn/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';

const columnHelper = createColumnHelper<any>();


type TaskEntry = {
    id: string;
    parentId: string | null;
    treatAsParent: boolean;
    subRows?: TaskEntry[];
} & Record<string, string>;

type Props = {
    nesteddata: Record<string, string>[];
    data: Record<string, string>[]
    fields: DynamicFieldConfigFormDataWithId[];
    setData: React.Dispatch<React.SetStateAction<Record<string, string>[]>>;
    parentEntries: { value: string, label: string }[];
    setParentEntries: React.Dispatch<React.SetStateAction<{ value: string, label: string }[]>>;
    extraParams: any;
};


export const FrameworkStructureDataTable = ({ nesteddata, data, fields, setData, parentEntries, setParentEntries, extraParams }: Props) => {
    const [expanded, setExpanded] = useState({});
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [updateRows, setUpdateRow] = useState<Record<string, string> | null>(null);
    const [openUpdateDynamicForm, setOpenUpdateDynamicForm] = useState<boolean>(false);

    const [addRows, setAddRows] = useState<Record<string, string> | null>(null);
    const [openAddDynamicForm, setOpenAddDynamicForm] = useState<boolean>(false);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [deleteEntryRow, setDeleteEntryRow] = useState<TaskEntry | null>(null);

    const { selectedEntries, setSelectedEntries } = DynamicFieldFrameworkContext();

    const deleteRows = () => {

        const getChildIds = (parentId: string): string[] => {
            const childEntries = data.filter((entry) => entry.parentId === parentId);
            const childIds = childEntries.map((entry) => entry.id);

            return [
                ...childIds,
                ...childIds.flatMap((childId) => getChildIds(childId)),
            ];
        };

        const childIds = getChildIds(deleteEntryRow.id);
        const idsToDelete = [deleteEntryRow.id, ...childIds];
        // setData(data.filter((entry) => !idsToDelete.includes(entry.id)));
        const newData = data.filter((entry) => !idsToDelete.includes(entry.id));
        setParentEntries(parentEntries.filter((parentEntry) => !idsToDelete.includes(parentEntry.value)));

        if (deleteEntryRow.parentId) {
            const parentStillExists = newData.some((entry) => entry.id === deleteEntryRow.parentId);
            const parentHasChildren = newData.some((entry) => entry.parentId === deleteEntryRow.parentId);

            if (parentStillExists && !parentHasChildren) {
                // Do NOT demote top-level entry (parentId === null)
                const parentEntry = newData.find((entry) => entry.id === deleteEntryRow.parentId);
                if (parentEntry && parentEntry.parentId !== null) {
                    //Demote from parentEntries
                    setParentEntries((prev) =>
                        prev.filter((p) => p.value !== parentEntry.id)
                    );

                    // ✅ Mark treatAsParent: false
                    setData(
                        newData.map((entry) =>
                            entry.id === parentEntry.id
                                ? { ...entry, treatAsParent: false }
                                : entry
                        )
                    );
                    return;
                }
            }
        }

        // Update data if no demotion occurred
        setData(newData);
        setIsAlertDialogOpen(false);
    };

    const columns: ColumnDef<any>[] = fields.map((field, index) => {
        const accessorKey = field.id;

        return columnHelper.accessor(accessorKey, {
            id: accessorKey,
            header: ({ table }) =>
            // index === 0 ? (
            //     <div className="flex items-start gap-2">
            //         <Button
            //             variant="outline"
            //             size="smIcon"
            //             onClick={table.getToggleAllRowsExpandedHandler()}
            //         >
            //             {table.getIsAllRowsExpanded() ? (
            //                 <ArrowDownCircle className="w-4 h-4" />
            //             ) : (
            //                 <ArrowRightCircle className="w-4 h-4" />
            //             )}
            //         </Button>
            //         <span className='self-center'>{field.name}</span>
            //     </div>
            // ) : 
            (
                <div className="flex items-start gap-2 capitalize">
                    {field.name}
                </div>
            ),

            cell: ({ row, getValue }) => {
                const value = getValue();
                // Expandable logic for first column
                // if (index === 0) {
                //     return (
                //         <div
                //             className="flex items-start gap-2 capitalize"
                //             style={{ paddingLeft: `${row.depth * 1.5}rem` }}
                //         >
                //             {row.getCanExpand() ? (
                //                 <Button
                //                     variant="outline"
                //                     size="smIcon"
                //                     onClick={row.getToggleExpandedHandler()}
                //                 >
                //                     {row.getIsExpanded() ? (
                //                         <ArrowDownCircle className="w-4 h-4" />
                //                     ) : (
                //                         <ArrowRightCircle className="w-4 h-4" />
                //                     )}
                //                 </Button>
                //             ) : (
                //                 <Button variant="outline" size="smIcon" disabled>
                //                     <Circle className="w-3 h-3 text-muted-foreground" />
                //                 </Button>
                //             )}
                //             <div className='self-center truncate w-[100px]' title={value !== null && value !== undefined && value !== '' ? String(value) : '-'}>
                //                 {value !== null && value !== undefined && value !== '' ? String(value) : '-'}
                //             </div>
                //         </div>
                //     );
                // }

                // Dropdown display
                if (field.type === 'dropdown') {
                    const label =
                        field.extraInfo?.find((opt) => opt.value === value)?.label || '-';
                    return <span>{label}</span>;
                }

                return <div className='truncate w-[100px]' title={value !== null && value !== undefined && value !== '' ? String(value) : '-'}>
                    {value !== null && value !== undefined && value !== '' ? String(value) : '-'}
                </div>;
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
                    <IconButtonWithTooltip tooltipContent={"Add Entries"} variant='ghost' size="icon" onClick={() => { setAddRows(row.original), setOpenAddDynamicForm(true) }}>
                        <PlusSquare className="w-4 h-4 text-blue-500" />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip tooltipContent={"Edit Entries"} variant='ghost' size="icon" onClick={() => { setUpdateRow(row.original), setOpenUpdateDynamicForm(true) }}>
                        <Pencil className="w-4 h-4 text-green-500" />
                    </IconButtonWithTooltip>
                    <IconButtonWithTooltip tooltipContent={"Delete Entries"} variant='ghost' size="icon" onClick={() => { setDeleteEntryRow(row.original), setIsAlertDialogOpen(true); }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </IconButtonWithTooltip>
                </div>
            ),
        })
    );

    columns.unshift(
        columnHelper.display({
            id: "select",
            header: () => (
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
                    <span className='self-center'>Select</span>
                </div>
            ),
            cell: ({ row }) => {
                const id = row.original.id;
                const isChecked = selectedEntries.includes(id);

                return (
                    <div
                        className="flex items-start gap-2 capitalize"
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
                        <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                                setSelectedEntries((prev) =>
                                    checked
                                        ? [...prev, id]
                                        : prev.filter((selectedId) => selectedId !== id)
                                );
                            }}
                            className="self-center"
                        />
                    </div>
                );
            },
        })
    );

    console.log(selectedEntries);

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
            <div className="flex items-center justify-between gap-3">
                <SearchInput
                    placeholder="Search ..."
                    onChange={(event: any) => table.setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                <div className="flex gap-3">
                    {extraParams?.map((tool: any, index: number) => (
                        <Fragment key={index}>{tool}</Fragment>
                    ))}
                    <DataTableFrameworkColumnFilter table={table} />
                </div>
            </div>
            <div className="h-[60vh] overflow-hidden flex flex-col">
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
                                        colSpan={fields.length + 1}
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
            {
                openUpdateDynamicForm && (
                    <FrameworkStructureForm
                        openDynamicForm={openUpdateDynamicForm}
                        setOpenDynamicForm={setOpenUpdateDynamicForm}
                        fields={fields}
                        data={data}
                        setData={setData}
                        parentEntries={parentEntries}
                        setParentEntries={setParentEntries}
                        updateRows={updateRows}
                    />
                )
            }
            {
                openAddDynamicForm && (
                    <FrameworkStructureForm
                        openDynamicForm={openAddDynamicForm}
                        setOpenDynamicForm={setOpenAddDynamicForm}
                        fields={fields}
                        data={data}
                        setData={setData}
                        parentEntries={parentEntries}
                        setParentEntries={setParentEntries}
                        addRows={addRows}
                    />
                )
            }

            {isAlertDialogOpen && (
                <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will delete the entry and all its children. This action
                                cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setDeleteEntryRow(null), setIsAlertDialogOpen(false) }}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={deleteRows}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
            }
        </>
    );
};
