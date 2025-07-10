'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { format } from 'date-fns';
import React, { useState } from 'react'
import OpenIncidentForm from '../openIncidentForm';
import { Button } from '@/shadcn/ui/button';
import IncidentForm from '../incidentForm';
import IncidentProgressForm from '../incidentProgressForm';
import { SAVE_DATE_FORMAT, SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';

export default function IncidentDataTable({ incidentCreateDatas, allUsers, userIdNameMap }: any) {

    console.log(incidentCreateDatas);

    const [openIncidentForm, setOpenIncidentForm] = useState<boolean>(false);
    const [editRow, setEditRow] = useState<Record<string, string> | null>(null);

    const [openIncidentProgressForm, setOpenIncidentProgressForm] = useState<boolean>(false);
    const [inProgressRow, setInProgressRow] = useState<Record<string, string> | null>(null);
    const [editInProgressRow, setEditInProgressRow] = useState<Record<string, string> | null>(null);

    async function getOpenEditForm(row: Record<string, string>) {
        // if (row.incidentStatus === 'Open') {
        //     setOpenIncidentForm(true);
        //     setEditRow(row);
        // } else if (row.incidentStatus === 'InProgress') {
        //     // setOpenIncidentProgressForm(true);
        //     // setEditInProgressRow(row)
        // }
        setOpenIncidentForm(true);
        setEditRow(row);
    }

    const columnsIncidentTable: DTColumnsProps<Record<string, string>>[] = [
        {
            accessorKey: "incidentTitle",
            header: "Title",
            cell: ({ row }) => {
                const { incidentTitle, incidentStatus } = row.original;
                return incidentStatus === 'Open' ? (
                    <Button
                        onClick={async () => {
                            await getOpenEditForm(row.original);
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
                return dateValue ? format(new Date(dateValue), SAVE_DATE_FORMAT_GRC) : "N/A";
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
        }
    ];

    const extraParamsIncidentTable: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "Assign Incident",
                    onClick: (rowData) => {
                        console.log(rowData);
                        setInProgressRow(rowData);
                        setOpenIncidentProgressForm(true);
                    },
                    visibility: (rowData) => {
                        return rowData.incidentStatus === 'Open' ? true : false;
                    }
                }
            ]
        },
        extraTools: [
            <OpenIncidentForm userIdNameMap={userIdNameMap} />
        ]
    }
    return (
        <>
            <DataTable data={incidentCreateDatas} columns={columnsIncidentTable} extraParams={extraParamsIncidentTable} />
            {
                openIncidentForm &&
                <IncidentForm open={openIncidentForm} setOpen={setOpenIncidentForm} userIdNameMap={userIdNameMap} editIncident={editRow} />
            }
            {
                openIncidentProgressForm &&
                <IncidentProgressForm
                    open={openIncidentProgressForm}
                    setOpen={setOpenIncidentProgressForm}
                    userIdNameMap={userIdNameMap}
                    inProgressIncident={inProgressRow}
                    editInProgressRow={null}
                />
            }
        </>
    )
}
