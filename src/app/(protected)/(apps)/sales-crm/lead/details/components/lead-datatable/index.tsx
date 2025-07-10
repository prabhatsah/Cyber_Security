"use client"
import { DataTable } from '@/ikon/components/data-table'
import { DTColumnsProps } from '@/ikon/components/data-table/type';
import React from 'react'
import { LeadData } from '../../../../components/type';
import { Button } from '@/shadcn/ui/button';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import CreateLeadButtonWithModal from '../create-lead';
import { format } from 'date-fns';
import { VIEW_DATE_TIME_FORMAT } from '@/ikon/utils/config/const';
import { UserIdWiseUserDetailsMapProps } from '@/ikon/utils/actions/users/type';
import { getDateTimeFormat } from '@/ikon/utils/actions/format';

function LeadDataTable({ leadsData, userIdWiseUserDetailsMap }: { leadsData: LeadData[], userIdWiseUserDetailsMap: UserIdWiseUserDetailsMapProps }) {

    // Column Schema
    const columns: DTColumnsProps<LeadData>[] = [
        {
            accessorKey: "organisationDetails.organisationName",
            header: ({ column }) => (
                <div style={{ textAlign: 'center' }}>
                    Organization Name
                    {/* <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Organization Name
                        <ArrowUpDown />
                    </Button> */}
                </div>
            ),
            cell: (info: any) => (
                <Link className="underline" href={"../lead/details/" + info.row.original.leadIdentifier + "/event"}>
                    {info.getValue()}
                </Link>
            ),
            getGroupingValue: (row) => `${row.organisationDetails.organisationName}`,
        },
        {
            accessorKey: "organisationDetails.noOfEmployees",
            header: () => (
                <div style={{ textAlign: 'center' }}>
                    Number of Employees
                </div>
            ),
            cell: ({ row }) => <span>{row.original.organisationDetails?.noOfEmployees || "n/a"}</span>,
        },
        {
            accessorKey: "organisationDetails.email",
            header: "Email",
            cell: ({ row }) => <span>{row.original.organisationDetails?.email || "n/a"}</span>,
        },
        {
            accessorKey: "organisationDetails.orgContactNo",
            header: "Contact Number",
            cell: ({ row }) => <span>{row.original.organisationDetails?.orgContactNo || "n/a"}</span>,
        },
        {
            accessorKey: "organisationDetails.sector",
            header: "Sector",
            cell: ({ row }) => <span>{row.original.organisationDetails?.sector || "n/a"}</span>,
        },
        {
            accessorKey: "leadStatus",
            header: "Status",
            cell: ({ row }) => <span>{row.original?.leadStatus || "n/a"}</span>,
        },
        {
            accessorKey: "salesManager",
            header: "Manager",
            cell: ({ row }) => (<span>{userIdWiseUserDetailsMap[row?.original?.salesManager]?.userName || 'n/a'}</span>
            ),
        },
        {
            accessorKey: "updatedOn",
            header: "Updated On",
            cell: ({ row }) => {
                return <span>{getDateTimeFormat(row?.original?.updatedOn)}</span>;
            },
        },
    ];
    const extraParams: any = {
        searching: true,
        filtering: true,
        grouping: true,
        extraTools: [
            <CreateLeadButtonWithModal />
        ],
    };

    return (
        <DataTable columns={columns} data={leadsData} extraParams={extraParams} />
    )
}

export default LeadDataTable