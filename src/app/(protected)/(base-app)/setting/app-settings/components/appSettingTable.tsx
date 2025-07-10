'use client'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type'
import React, { useEffect, useState } from 'react'
import { AppSettingTableProps } from './type'
import { DataTable } from '@/ikon/components/data-table';
import ManageUserTable from './manageUserTable';
import ManageRolesTable from './manageRolesTable';
import { getAllRoleForSoftwaresV2 } from '@/ikon/utils/api/roleService';

export default function AppSettingTable({ data, allUserDetails }: any) {
    const [openUsersTable, setOpenUserTable] = useState<boolean>(false);
    const [openRolesTable,setOpenRolesTable] = useState<boolean>(false);
    const [roleId, setRoleId] = useState<string>("");
    const [softwareId, setSoftwareId] = useState<string>("");    
    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["displayAppName"],
        grouping: false,
        actionMenu: {
            items: [
                {
                    label: "Manage Users",
                    onClick: (rowData) => {
                        setRoleId(rowData.ROLE_ID);
                        setOpenUserTable(true)
                    },
                }
            ]
        },
        groupActionMenu: {
            items: [
                {
                    label: "Role Access",
                    onClick: (rowData) => {
                        console.log(rowData);
                        setSoftwareId(rowData.SOFTWARE_ID)
                        setOpenRolesTable(true);
                    },
                },
            ]
        }
    };

    const AppSettingColumns: DTColumnsProps<AppSettingTableProps>[] = [
        {
            accessorKey: "displayAppName",
            header: "Software Name",
        },
        {
            accessorKey: "ROLE_NAME",
            header: "Role Name",
        }
    ]
    return (
        <>
            <ManageRolesTable open={openRolesTable} setOpen={setOpenRolesTable} softwareId={softwareId} />
            <ManageUserTable open={openUsersTable} setOpen={setOpenUserTable} roleId={roleId} softwareId={softwareId} activeUserDetails={allUserDetails} />
            <DataTable columns={AppSettingColumns} data={data} extraParams={extraParams} />
        </>
    )
}
