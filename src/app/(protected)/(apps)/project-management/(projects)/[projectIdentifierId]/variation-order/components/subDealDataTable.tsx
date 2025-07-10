import { DataTable } from '@/ikon/components/data-table'
import { DTColumnsProps } from '@/ikon/components/data-table/type'
import React, { useEffect, useState } from 'react'

export default function SubDealDataTable({ subDealData,accountDataSubDeal }: { subDealData: Record<string, any>[] ,accountDataSubDeal:Record<string,any>|null}) {

    console.log(accountDataSubDeal);

    
    const subDealColumn: DTColumnsProps<Record<string, any>>[] = [

        {
            accessorKey: "dealName",
            header: "Deal Name"
        },
        {
            accessorKey: "approvedBy",
            header: "Approved By"
        },
        {
            accessorKey: "dealStatus",
            header: "Status",
            cell: ({ row }) => {
                return (
                    row.original.dealStatus === "Deal Created" ? "VO Initiated" : row.original.dealStatus
                )
            },
        },
        {
            accessorKey: 'voType',
            header: "VO Type",
            cell: ({ row }) => {
                return (
                    row.original.voType[0]
                )
            },
        },
        {
            accessorKey: "dealWonDate",
            header: "Won Date",
            cell: ({ row }) => {
                return (
                    row.original.dealWonDate ? row.original.dealWonDate : "n/a"
                )
            },
        },
        {
            accessorKey: "accountDetails",
            header: "Account Name",
            cell: ({ row }) => {
                return (
                    accountDataSubDeal ? accountDataSubDeal[row.original.accountDetails?.accountName] : 'n/a'
                )
            },
        },
        {
            accessorKey: "expectedRevenue",
            header: "Expected Revenue",
        }
    ]
    return (
        <>
            <DataTable data={subDealData} columns={subDealColumn} />
        </>
    )
}
