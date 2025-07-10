'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { SAVE_DATE_FORMAT, SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Button } from '@/shadcn/ui/button';
import { format } from 'date-fns';
import React, { useState } from 'react'
import IncidentProgressForm from '../incidentProgressForm';

export default function IncidentProgressDataTable({ incidentProgressDatas, allUsers, userIdNameMap }: any) {

    console.log(incidentProgressDatas);
    const [openIncidentProgressForm, setOpenIncidentProgressForm] = useState<boolean>(false);
    const [editInProgressRow, setEditInProgressRow] = useState<Record<string, string> | null>(null);

    const [openProgressForm,setOpenProgressForm] = useState<boolean>(false);

    async function getOpenInProgressEditForm(row: Record<string, string>) {
        setOpenIncidentProgressForm(true);
        setEditInProgressRow(row);
    }

    function openResolveIncidentFomr(rowData: Record<string,string>){

    }

    const columnsIncidentProgressTable: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "incidentTitle",
            header: "Title",
            cell: ({ row }) => {
                const { incidentTitle, incidentStatus } = row.original;
                return incidentStatus === 'InProgress' ? (
                    <Button
                        onClick={async () => {
                            await getOpenInProgressEditForm(row.original);
                            console.log("Button Clicked");
                        }}
                        variant='link'
                        className='text-left p-0'
                    >
                        {incidentTitle}
                    </Button>
                ) : (
                    <div>{incidentTitle}</div>
                );
            }
        },
        {
            accessorKey: "incidentType",
            header: "Type",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.incidentType}</div>
            ),
        },
        {
            accessorKey: "incidentPriority",
            header: "Priority",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.incidentPriority}</div>
            ),
        },
        {
            accessorKey: "incidentStatus",
            header: "Status",
            cell: ({ row }) => {
                const formatStatus = (status: string) => status.replace(/([A-Z])/g, " $1").trim();
                return <span>{formatStatus(row.original.incidentStatus)}</span>;
            },
        },
        {
            accessorKey: "incidentDate",
            header: "Date",
            cell: ({ row }) => {
                const dateValue = row.original.incidentDate
                return dateValue ? format(dateValue, SAVE_DATE_FORMAT_GRC) : "N/A";
            },
        },
        {
            accessorKey: "estimatedDate",
            header: "Estimated Resolution Date",
            cell: ({ row }) => {
                const dateValue = row.original.estimatedResolutionDate
                return dateValue ? format(dateValue, SAVE_DATE_FORMAT_GRC) : "N/A";
            },
        },
        {
            accessorKey: "incidentOwner",
            header: "Owner",
            cell: ({ row }) => {
                const ownerNameId = row.original.incidentOwner;
                const ownerName = ownerNameId.length ? allUsers[ownerNameId].userName : '';
                return ownerName;
            },
        },
        {
            accessorKey: "incidentAssignTo",
            header: "Assignee",
            cell: ({ row }) => {
                const assigneeNameID = row.original.incidentAssignTo;
                const assigneeName = assigneeNameID.length ? allUsers[assigneeNameID].userName : '';
                return assigneeName;
            },
        }
    ];

    const extraParamsIncidentProgressTable: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "Resolve Incident",
                    onClick: (rowData) => {
                        console.log(rowData);
                        openResolveIncidentFomr(rowData);
                    }
                }
            ]
        },
    }

    return (
        <>
            <DataTable data={incidentProgressDatas} columns={columnsIncidentProgressTable} extraParams={extraParamsIncidentProgressTable} />
            {
                openIncidentProgressForm &&
                <IncidentProgressForm
                    open={openIncidentProgressForm}
                    setOpen={setOpenIncidentProgressForm}
                    userIdNameMap={userIdNameMap}
                    inProgressIncident={null}
                    editInProgressRow={editInProgressRow}
                />
            }
        </>
    )
}
