import React from 'react'
import { FrameworkEntryWithSubRows } from './FrameworkOverview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { DTColumnsProps } from '@/ikon/components/data-table/type';
import { Button } from '@/shadcn/ui/button';
import { ArrowDownCircle, ArrowRightCircle, Circle } from 'lucide-react';
import FrameworkDetailsTable from './frameworkDetailsTable';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';

export default function FrameworkDetails({
    openSubscribeFrameworkPage,
    setOpenSubscribeFrameworkPage,
    subScribeFrameworkDetails,
    subScribeFrameworkName
}: {
    openSubscribeFrameworkPage: boolean;
    setOpenSubscribeFrameworkPage: React.Dispatch<React.SetStateAction<boolean>>;
    subScribeFrameworkDetails: FrameworkEntryWithSubRows[];
    subScribeFrameworkName: string;
}) {
    const frameworkColumns: DTColumnsProps<FrameworkEntryWithSubRows>[] = [
        {
            accessorKey: "index",
            header: ({ table }) => (
                <div className="flex items-start gap-2">
                    <IconButtonWithTooltip
                        variant="outline"
                        size="smIcon"
                        onClick={table.getToggleAllRowsExpandedHandler()}
                        tooltipContent={table.getIsAllRowsExpanded() ? "Collapse Table": "Expand Table"}
                    >
                        {table.getIsAllRowsExpanded() ? (
                            <ArrowDownCircle className="w-4 h-4" />
                        ) : (
                            <ArrowRightCircle className="w-4 h-4" />
                        )}
                    </IconButtonWithTooltip>
                    <span className='self-center'>Index</span>
                </div>
            ),
            cell: ({ row }) => (
                <div
                    className="flex items-start gap-2"
                    style={{ paddingLeft: `${row.depth * 1.5}rem` }}
                >
                    {row.getCanExpand() ? (
                        <IconButtonWithTooltip
                            variant="outline"
                            size="smIcon"
                            onClick={row.getToggleExpandedHandler()}
                            tooltipContent={row.getIsExpanded() ? "Collapse Row": "Expand Row"}
                        >
                            {row.getIsExpanded() ? (
                                <ArrowDownCircle className="w-4 h-4" />
                            ) : (
                                <ArrowRightCircle className="w-4 h-4" />
                            )}
                        </IconButtonWithTooltip>
                    ) : (
                        <IconButtonWithTooltip variant="outline" size="smIcon" disabled tooltipContent={"No children for this entry"}>
                            <Circle className="w-3 h-3 text-muted-foreground" />
                        </IconButtonWithTooltip>
                    )}
                    <div className="self-center capitalize" title={row.original.index}>
                        {row.original.index || "-"}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className='truncate w-[250px]' title={row.original.description}>
                    {row.original.description || "-"}
                </div>
            )
        }
    ]
    return (
        <>
            <Dialog open={openSubscribeFrameworkPage} onOpenChange={setOpenSubscribeFrameworkPage}>
                <DialogContent className="!max-w-none w-[80vw] h-[82vh] p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle className='capitalize'>{subScribeFrameworkName}</DialogTitle>
                    </DialogHeader>
                    <div className="h-[80vh] overflow-y-auto">
                        <FrameworkDetailsTable frameworkColumns={frameworkColumns} subScribeFrameworkDetails={subScribeFrameworkDetails} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
