'use client';
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import React from 'react'
//import { CreateNewProject } from './createNewProject';
import {format} from "date-fns"
import Link from 'next/link';
import { getDateFormat } from '@/ikon/utils/actions/format';
import { CreateNewProject } from '../create-project';


export default function ProjectTable({projectTableData,userIdWiseUserDetailsMap,projectmanager}:{projectTableData: any[], userIdWiseUserDetailsMap: Record<string,any>,projectmanager: any}) {

     const extraParams: DTExtraParamsProps = {
        extraTools: [
            <CreateNewProject projectmanager={projectmanager}/>
        ],
        
     }

    const ProjectDetailsColumns: DTColumnsProps<any>[] = [
        {
            header: "Project Name",
            accessorKey: "projectName",
            cell: ({ row }) => {
                // console.log(row.original.projectIdentifier);
                return (
                    <Link href={`/task-management/${row.original.projectIdentifier}`}>
                        {row.original.projectName}
                    </Link>
                )
            }
        },
        {
            header: "Type",
            accessorKey: "type",
            cell: ({ row }) => {
                return (
                    row.original.type?
                    <div>
                        {row.original.type}
                    </div>:
                    <div>
                        Project
                    </div>
                )
            }
        },
       
        {
            header: "Start Date",
            accessorKey: "projectStartDate",
            cell: ({ row }) => {
                return (
                    row.original.projectStartDate?
                    <div>
                        {getDateFormat(row.original.projectStartDate)}
                    </div>:
                    <div>
                        n/a
                    </div>
                )
            }
        },
        
        {
            header: "Status",
            accessorKey: "projectStatus",
            cell: ({ row }) => {
                return (
                    row.original.projectStatus?
                    <div>
                        {row.original.projectStatus}
                    </div>:
                    <div>
                        n/a
                    </div>
                )
            }
        
        },
        // {
        //     header: "Type",
        //     accessorKey: "type"
        // },
        
        
        {
            header: "Client Name",
            accessorKey: "projectClient"
        },
        {
            header: "Project Manager",
            accessorKey: "projectManager",
            cell: ({ row }) => {
                return (
                    row.original.projectManager?
                    <div>
                        {userIdWiseUserDetailsMap[row.original.projectManager]?.userName}
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
