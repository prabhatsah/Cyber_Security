'use client'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import React from 'react'
import { SupplierRegistrySchema } from '../page';
import SupplierRegistryOpenForm from './supplierRegistryOpenForm';
import { DataTable } from '@/ikon/components/data-table';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { format } from 'date-fns';

export default function SupplierRegistryTable({
    allUsers,
    supllierRegistryDatas
}: {
    allUsers: { label: string, value: string }[];
    supllierRegistryDatas: SupplierRegistrySchema[];
}) {


    const columnsSupplierRegistryTable: DTColumnsProps<SupplierRegistrySchema>[] = [
        {
            accessorKey: "supplierName",
            header: "Supplier Name",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.supplierName}>{row.original.supplierName}</div>
            )
        },
        {
            accessorKey: "contactPerson",
            header: "Contact Person",
            cell: ({ row }) => {
                const contactPersonId = row.original.contactPerson;
                const contactPerson = contactPersonId.length ? allUsers.find(u => u.value === contactPersonId)?.label || contactPersonId : '';
                return (
                    <div className="capitalize truncate w-[100px]" title={contactPerson} >{contactPerson}</div>
                );
            }
        },
        {
            accessorKey: "contactPhone",
            header: "Contact Phone No.",
            cell: ({ row }) => (
                <div className="truncate w-[100px]" title={row.original.contactPhone}>{row.original.contactPhone}</div>
            )
        },
        {
            accessorKey: "contactEmail",
            header: "Contact Email",
            cell: ({ row }) => (
                <div className="truncate w-[100px]" title={row.original.contactEmail}>{row.original.contactEmail}</div>
            )
        },
        {
            accessorKey: "serviceProvided",
            header: "Service Provided",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.serviceProvided}>{row.original.serviceProvided}</div>
            )
        },
        {
            accessorKey: "contractStartDate",
            header: "Contract Start Date",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px] ml-8">{format(row.original.contractStartDate,SAVE_DATE_FORMAT_GRC)}</div>
            )
        },
        {
            accessorKey: "contractEndDate",
            header: "Contract End Date",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px] ml-8">{format(row.original.contractEndDate,SAVE_DATE_FORMAT_GRC)}</div>
            )
        },
        {
            accessorKey: "complianceStatus",
            header: "Compliance Status",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.complianceStatus}>{row.original.complianceStatus}</div>
            )
        },
        {
            accessorKey: "compliance",
            header: "Compliance",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.compliance}>{row.original.compliance}</div>
            )
        },
        {
            accessorKey: "riskAssessmentDate",
            header: "Risk Assessment Date",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px] ml-8">{format(row.original.riskAssessmentDate,SAVE_DATE_FORMAT_GRC)}</div>
            )
        },
        {
            accessorKey: "riskLevel",
            header: "Risk Level",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.riskLevel}>{row.original.riskLevel}</div>
            )
        },
        {
            accessorKey: "mitigationMeasure",
            header: "Mitigation Measure",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]" title={row.original.mitigationMeasure}>{row.original.mitigationMeasure}</div>
            )
        },
        {
            accessorKey: "reviewDate",
            header: "Review Date",
            cell: ({ row }) => (
                <div className="capitalize truncate w-[100px]">{format(row.original.reviewDate,SAVE_DATE_FORMAT_GRC)}</div>
            )
        },
    ];

    const extraParamsSupplierRegistryTable: DTExtraParamsProps = {
        extraTools: [
            <SupplierRegistryOpenForm allUsers={allUsers} />
        ]
    }

    return (
        <>
            <DataTable columns={columnsSupplierRegistryTable} data={supllierRegistryDatas} extraParams={extraParamsSupplierRegistryTable} />
        </>
    )
}
