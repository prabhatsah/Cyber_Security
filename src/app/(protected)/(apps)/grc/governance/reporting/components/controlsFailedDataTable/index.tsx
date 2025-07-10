'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { downloadResource } from '@/ikon/utils/actions/common/utils';
import { FileinfoProps } from '@/ikon/utils/api/file-upload/type';
import React, { useState } from 'react'
import AuditReportForm from '../auditReportForm';
import { userMapSchema } from '../../../../components/createUserMap';

export default function ControlsFailedDataTable({ complianceReportDatas, allUsers, userMap }: { complianceReportDatas: Record<string, string>[], allUsers: any, userMap: userMapSchema }) {
    const [openAuditReportForm, setOpenAuditReportForm] = useState<boolean>(false);
    const [updateRow, setUpdateRow] = useState<Record<string, string> | null>(null);
    const donwloadFile = async function (fileInfo: FileinfoProps) {
        try {
            await downloadResource({
                resourceId: fileInfo.resourceId,
                resourceName: fileInfo.resourceName,
                resourceType: fileInfo.resourceType,
                resourceSize: fileInfo.resourceSize
            })
        }
        catch (err) {
            console.error('Error in donwloadTemplateFile: ', err);
        }
    }


    const columnsFailedReportingTable: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "frameworkName",
            header: "Framework Name"
        },
        {
            accessorKey: "objectiveName",
            header: "Control Objective"
        },
        {
            accessorKey: "controlName",
            header: "Control Name"
        },
        {
            accessorKey: "objectiveWeight",
            header: "Control Weightage",
            aggregationFn: undefined
        },
        {
            accessorKey: "auditType",
            header: "Audit Type",
            cell: ({ row }) => {
                const value = row.original.auditType;
                console.log(value)
                return value === "rulesAndRegulation" ? "Regulation" : value === 'best-practice' ? "Best Practice" : value === 'standard' ? "Standard Practice" : value;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.complianceStatus}</div>
            ),
        },
        {
            accessorKey: "assignee",
            header: "Assignee",
            cell: ({ row }) => {
                const assigneeNameID = row.original.assignee;
                const assigneeName = assigneeNameID.length ? allUsers[assigneeNameID].userName : '';
                return assigneeName;
            },
        },
    ];
    const extraParamsFailedReportingTable: DTExtraParamsProps = {
        defaultGroups: ["controlName"],
        actionMenu: {
            items: [
                {
                    label: "Download Report",
                    onClick: async (rowData) => {
                        console.log(rowData);
                        await donwloadFile(rowData.reportDocument)
                    },
                    visibility: (rowData) => {
                        return rowData.reportDocument?.resourceId ? true : false
                    }
                },
                {
                    label: "Edit Details",
                    onClick: (rowData) => {
                        setUpdateRow(rowData);
                        setOpenAuditReportForm(true);
                    },
                    visibility: (rowData) => {
                        return rowData.assignee.length !== 0 || rowData.complianceStatus === 'passed' ? false : true
                    }
                }
            ]
        }
    }
    return (
        <>
            <div className='h-[82vh] overflow-y-auto'>
                <DataTable data={complianceReportDatas} columns={columnsFailedReportingTable} extraParams={extraParamsFailedReportingTable} />
            </div>

            {
                openAuditReportForm &&
                <AuditReportForm open={openAuditReportForm} setOpen={setOpenAuditReportForm} editRow={null} updateRow={updateRow} userMap={userMap} />
            }
        </>

    )
}
