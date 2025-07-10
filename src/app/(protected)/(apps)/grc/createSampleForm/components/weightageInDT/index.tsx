import { DataTable } from '@/ikon/components/data-table'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type'
import { Input } from '@/shadcn/ui/input'
import React from 'react'
import OpenCustomObjectiveForm from '../openCustomObjectiveForm'

export default function WeightageInDT({ filterData }: { filterData: Record<string, string>[] }) {
    const columns: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "frameworkName",
            header: "Framework Name"
        },
        {
            accessorKey: "index",
            header: "Index",
            cell: ({ row }) => {
                return ''
            },
            aggregatedCell: ({ row }) => {
                const frameWorkDepth = row.depth;
                console.log(frameWorkDepth)
                if (frameWorkDepth === 1) {
                    const frameWorkLeafRows = row?.leafRows || [];
                    const frameWorkLeafRowsOriginal = frameWorkLeafRows.length && frameWorkLeafRows.map((frameWorkLeafRow: Record<string, string>) => frameWorkLeafRow.original)
                    console.log(frameWorkLeafRowsOriginal)
                    return frameWorkLeafRowsOriginal[0].index
                }
            }
        },
        {
            accessorKey: "controlName",
            header: "Control Name"
        },
        {
            id: "controlWeightage",
            header: () => {
                return "Control Weightage"
            },
            aggregatedCell: ({ row }) => {
                const frameWorkDepth = row.depth;

                if (frameWorkDepth === 1) {
                    return (
                        <Input
                            type="number"
                            placeholder="Enter Control Weightage"
                        />
                    )

                }
            }
        },
        {
            accessorKey: "controlObjectName",
            header: "Objective Name"
        },
        {
            id: "objectiveWeightage",
            header: () => {
                return "Objective Weightage"
            },
            cell: ({ row }) => {
                return (
                    <Input type="number" placeholder="Enter Objective Weightage" />
                );
            }
        },
        {
            accessorKey: "controlObjectiveType",
            header: "Objective Type"
        },
    ]
    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["frameworkName", "controlName"],
        extraTools: [<OpenCustomObjectiveForm />],
    }
    return (
        <>
            <DataTable columns={columns} data={filterData} extraParams={extraParams} />
        </>
    )
}
