"use client"
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { format } from 'date-fns';
import React, { useState } from 'react'
import AuditEvaluationForm from '../auditEvaluationForm';
import { userMapSchema } from '../../../../components/createUserMap';

export default function EvaluationDT({ controlDatas,userMap }: { controlDatas: Record<string, string>[],userMap:userMapSchema }) {

    const [openAuditReportForm, setOpenAuditReportForm] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<Record<string, string> | null>(null);

    const columnsEvaluationTable: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "auditName",
            header: "Audit Name"
        },
        {
            accessorKey: "frameworkName",
            header: "Framework Name"
        },
        {
            accessorKey: "controlName",
            header: "Control Name"
        },
        {
            accessorKey: "controlWeightage",
            header: "Control Weightage",
            aggregationFn: undefined,
        },
        {
            accessorKey: "controlObjectiveName",
            header: "Control Objective"
        },
        {
            accessorKey: "objectiveWeightage",
            header: "Objective Weightage",
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
            accessorKey: "auditStatus",
            header: "Audit Status",
            cell: ({ row }) => {
                const formatStatus = (status: string) => status.replace(/([A-Z])/g, " $1").trim();
                return <span className='capitalize'>{row.original.auditStatus}</span>;
            },
            aggregatedCell: ({ row }) => {
                const frameWorkDepth = row.depth;
                if (frameWorkDepth === 0) {
                    const frameWorkLeafRows = row?.leafRows || [];
                    const frameWorkLeafRowsOriginal = frameWorkLeafRows.length && frameWorkLeafRows.map((frameWorkLeafRow: Record<string, string>) => frameWorkLeafRow.original)
                    console.log(frameWorkLeafRowsOriginal);
                    const alreadyOpen = frameWorkLeafRowsOriginal.length && frameWorkLeafRowsOriginal.some((frameWorkLeafRowsOriginalData: Record<string, string>) => frameWorkLeafRowsOriginalData.auditStatus === 'open' || frameWorkLeafRowsOriginalData.auditStatus === 'upcoming');
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
                    const alreadyClosed = frameWorkLeafRowsOriginal.length && frameWorkLeafRowsOriginal.filter((frameWorkLeafRowsOriginalData: Record<string, string>) => frameWorkLeafRowsOriginalData.auditStatus === 'closed');
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
            accessorKey: "frameworkType",
            header: "Framework Type",
            cell: ({ row }) => {
                const value = row.original.frameworkType;
                return value === "regulation" ? "Rules and Regulation" : value === 'bestPractice' ? "Best Practice" : value === 'standard' ? "Standard" : value;
            },
        },
    ];
    const extraParamsEvaluationTable: DTExtraParamsProps = {
        defaultGroups: ["auditName"],
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
                        const status = rowData.auditStatus === 'closed' ? false : true
                        return status
                    }
                }
            ]
        },
    }
    return (
        <>
            <DataTable columns={columnsEvaluationTable} data={controlDatas} extraParams={extraParamsEvaluationTable} />
            {
                openAuditReportForm &&
                <AuditEvaluationForm open={openAuditReportForm} setOpen={setOpenAuditReportForm} editRow={editRow} updateRow={null} userMap={userMap} />
            }
        </>
    )
}
