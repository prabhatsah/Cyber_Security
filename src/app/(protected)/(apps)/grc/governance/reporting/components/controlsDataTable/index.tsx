'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import React, { useState } from 'react'
import AuditReportForm from '../auditReportForm';
import { userMapSchema } from '../../../../components/createUserMap';
import { format } from 'date-fns';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';

export default function ControlsDataTable({ controlsDatas, userMap, complianceReportDatas }: { controlsDatas: Record<string, string>[], userMap: userMapSchema, complianceReportDatas: Record<string, string>[], }) {

    console.log(controlsDatas);

    const [openAuditReportForm, setOpenAuditReportForm] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<Record<string, string> | null>(null);

    const columnsReportingTable: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "frameworkName",
            header: "Framework Name"
        },
        {
            accessorKey: "controlName",
            header: "Control Name"
        },
        {
            accessorKey: "objectiveName",
            header: "Control Objective"
        },
        {
            accessorKey: "objectiveWeight",
            header: "Control Weightage",
            aggregationFn: undefined
        },
        {
            accessorKey: "auditStartDate",
            header: "Audit Start Date",
            cell: ({ row }) => {
                const datevalue = row.original.auditStartDate;
                return format(datevalue, SAVE_DATE_FORMAT_GRC);
            }
        },
        {
            accessorKey: "status",
            header: "Audit Status",
            cell: ({ row }) => {
                const formatStatus = (status: string) => status.replace(/([A-Z])/g, " $1").trim();
                return <span>{formatStatus(row.original.status)}</span>;
            },
            aggregatedCell: ({ row }) => {
                const frameWorkDepth = row.depth;
                if (frameWorkDepth === 0) {
                    const frameWorkLeafRows = row?.leafRows || [];
                    const frameWorkLeafRowsOriginal = frameWorkLeafRows.length && frameWorkLeafRows.map((frameWorkLeafRow: Record<string, string>) => frameWorkLeafRow.original)
                    console.log(frameWorkLeafRowsOriginal);
                    const alreadyOpen = frameWorkLeafRowsOriginal.length && frameWorkLeafRowsOriginal.some((frameWorkLeafRowsOriginalData: Record<string, string>) => frameWorkLeafRowsOriginalData.status === 'Open' || frameWorkLeafRowsOriginalData.status === 'InProgress' || frameWorkLeafRowsOriginalData.status === 'Upcoming');
                    if (alreadyOpen) {
                        return "Open";
                    } else {
                        return "Closed";
                    }
                }
            },
        },
        {
            id: "Audit Progress",
            header: () => {
                return "Audit Progress"
            },
            // accessorFn: () => "Audit Progress",
            aggregatedCell: ({ row }) => {
                const frameWorkDepth = row.depth;
                if (frameWorkDepth === 0) {
                    const frameWorkLeafRows = row?.leafRows || [];
                    const frameWorkLeafRowsOriginal = frameWorkLeafRows.length && frameWorkLeafRows.map((frameWorkLeafRow: Record<string, string>) => frameWorkLeafRow.original)
                    console.log(frameWorkLeafRowsOriginal);
                    const alreadyClosed = frameWorkLeafRowsOriginal.length && frameWorkLeafRowsOriginal.filter((frameWorkLeafRowsOriginalData: Record<string, string>) => frameWorkLeafRowsOriginalData.status === 'Closed');
                    const alreadyClosedPercent = (alreadyClosed.length / frameWorkLeafRowsOriginal.length) * 100;
                    return (
                        <div className='text-center'>
                            {alreadyClosedPercent.toFixed(2) + " %"}
                        </div>
                    )
                }
            },
        },
        {
            accessorKey: "auditType",
            header: "Audit Type",
            cell: ({ row }) => {
                const value = row.original.auditType;
                return value === "rulesAndRegulation" ? "Regulation" : value === 'best-practice' ? "Best Practice" : value === 'standard' ? "Standard Practice" : value;
            },
        },
    ];
    const extraParamsReportingTable: DTExtraParamsProps = {
        defaultGroups: ["frameworkName", "controlName"],
        actionMenu: {
            items: [
                {
                    label: "Update Audit Status",
                    onClick: (rowData) => {
                        console.log(rowData);
                        setOpenAuditReportForm(true);

                        setEditRow(rowData);
                    },
                    visibility: (rowData) => {
                        // const alreadyExists = complianceReportDatas.some(item =>
                        //     item.objectiveName === rowData.objectiveName &&
                        //     item.objectiveWeight === rowData.objectiveWeight
                        // );
                        // return !alreadyExists;
                        const status = rowData.status === 'InProgress' ? false : true
                        return status
                    }
                }
            ]
        },
    }
    return (
        <>
            <div className='h-full overflow-y-auto'>
                <DataTable data={controlsDatas} columns={columnsReportingTable} extraParams={extraParamsReportingTable} />
            </div>
            {
                openAuditReportForm &&
                <AuditReportForm open={openAuditReportForm} setOpen={setOpenAuditReportForm} editRow={editRow} updateRow={null} userMap={userMap} />
            }
        </>
    )
}
