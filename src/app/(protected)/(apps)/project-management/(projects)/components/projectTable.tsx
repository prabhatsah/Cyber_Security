'use client';
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import React from 'react'
import { CreateNewProject } from './createNewProject';
import {format} from "date-fns"
import Link from 'next/link';

export default function ProjectTable({projectmanager,projectTableData}:{projectmanager: Record<string,string>,projectTableData: Record<string,string>}) {

     const extraParams: DTExtraParamsProps = {
        extraTools: [
            <CreateNewProject projectmanager={projectmanager}/>
        ],
        
     }

    const ProjectDetailsColumns: DTColumnsProps<any>[] = [
        {
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => {
                // console.log(row.original.projectIdentifier);
                return (
                    <Link href={`/project-management/${row.original.projectIdentifier}`}>
                        {row.original.name}
                    </Link>
                )
            }
        },
        {
            header: "Source",
            accessorKey: "source"
        },
        {
            header: "VO Type",
            accessorKey: "voType",
            cell: ({ row }) => {
                return (
                    row.original.voType?
                    <div>
                        {row.original.voType}
                    </div>:
                    <div>
                        n/a
                    </div>
                )
            }
        },
        {
            header: "Start Date",
            accessorKey: "startDate"
        },
        {
            header: "End Date",
            accessorKey: "endDate"
        },
        {
            header: "Status",
            accessorKey: "updatedStatus"
        },
        {
            header: "Type",
            accessorKey: "type"
        },
        {
            header: "Duration (M)",
            accessorKey: "duration"
        },
        {
            header: "Country",
            accessorKey: "country",
            cell: ({ row }) => {
                return (
                    row.original.country?
                    <div>
                        {row.original.country}
                    </div>:
                    <div>
                        n/a
                    </div>
                )
            }
        },
        {
            header: "Client Name",
            accessorKey: "getClientName"
        },
        {
            header: "Project Manager",
            accessorKey: "projectManager"
        },
        {
            header: "Last Updated On",
            accessorKey: "updatedOn",
            cell: ({ row }) => {
                return (
                    row.original.updatedOn?
                    <div>
                        {format(row.original.updatedOn,"dd-MM-yyyy")}
                    </div>:
                    <div>
                        n/a
                    </div>
                )
            }
        },
    ]

    return (
        <>
            <DataTable data={projectTableData} columns={ProjectDetailsColumns} extraParams={extraParams}/>
        </>
    )
}
