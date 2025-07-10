'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { LoadingSpinner } from '@/ikon/components/loading-spinner'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { getAllRoleForSoftwaresV2 } from '@/ikon/utils/api/roleService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React, { useEffect, useState } from 'react'

export default function ManageRolesTable({ open, setOpen, softwareId }: any) {
    const [roleAccessForApp, setRoleAcessForApp] = useState<Record<any, any>>([]);
    const [roleName, setRoleName] = useState<string[]>([]);
    const [roleLoading, setRoleLoading] = useState(false); // Track loading state

    useEffect(() => {
        const fetchData = async () => {
            setRoleLoading(true);
            try {
                setRoleName([])
                const getParticularRoleForSoftwareId = await getAllRoleForSoftwaresV2({ softwareIds: [softwareId] });
                //Role Map
                const roleMap: Record<string, any> = {};
                console.log(getParticularRoleForSoftwareId);
                getParticularRoleForSoftwareId.map((e: any) => {
                    roleMap[e.ROLE_ID] = e
                    setRoleName((prev: string[]) => (
                        [...prev, e.ROLE_NAME]
                    ));
                })
                // console.log('Role Id Wise Map : (roleMap): ');
                // console.dir(roleMap);


                //Role Wise Access
                const roleWiseAccess = await getMyInstancesV2({
                    processName: "Role Wise Access",
                    predefinedFilters: { "taskName": "View Access" },
                    processVariableFilters: { "appId": softwareId },
                })
                // console.log('Role Wise Access : (roleWiseAccess): ');
                // console.dir(roleWiseAccess);


                //Module Id Wise Details
                const moduleIdWiseDetails: Record<string, any> = roleWiseAccess[0] && roleWiseAccess[0].data && roleWiseAccess[0].data?.moduleIdWiseDetails || {};
                // console.log('Module Id Wise Details');
                // console.dir(moduleIdWiseDetails);


                //GetDataObjForAccessV2
                // console.log('getDataObjForAccessV2');
                let roleAccessForAppData: Record<string, any> = {};
                let roleAccessDataObject: Record<any, any>[] = [];
                Object.values(moduleIdWiseDetails).map((moduleIdWiseDetail) => {
                    // console.log(moduleIdWiseDetail?.name);
                    Object.values(moduleIdWiseDetail?.subModules).map((subModule: any) => {
                        roleAccessForAppData = JSON.parse(JSON.stringify({}));
                        roleAccessForAppData['module'] = moduleIdWiseDetail?.name;
                        roleAccessForAppData['subModule'] = subModule.name;
                        for (const [roleId, roleAcess] of Object.entries(subModule.roleWiseAccess)) {
                            // console.log(`${roleId}: ${roleAcess}`);
                            let roleNameForApp = roleMap[roleId].ROLE_NAME
                            roleAccessForAppData[roleNameForApp] = roleAcess
                        }
                        roleAccessDataObject.push(roleAccessForAppData);
                    })
                })
                // console.log(roleAccessDataObject);
                setRoleAcessForApp(roleAccessDataObject);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setRoleLoading(false); // Stop loading after fetching is done
            }
        };

        if (softwareId) {
            fetchData();
        }
    }, [softwareId]);
    console.log(roleAccessForApp);
    console.log(roleName);

    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["module"],
        grouping: false,
    }

    const AppSettingColumns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "module",
            header: "Modules",
        },
        {
            accessorKey: "subModule",
            header: "Sub Modules",
        },
        ...roleName.map((key) => ({
            accessorKey: key,
            // header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1").trim(),
            header: key,
            cell: ({ row }: { row: Record<any, any> }) => {
                console.log(row.original[key]);
                console.log(key);
                const value = row.original[key]; // Get the value dynamically
                return (
                    <div>
                        {
                            value === 'noaccess' ? 'N/A' : value === 'edit' ? 'Editor' : value === 'view' ? 'Viewer' : value
                        }
                    </div>
                )
            },
        }))

    ]
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="md:max-w-[90%] md:max-h-[90%] sm:max-w-[445px] sm:max-h-[100vh]">
                    <DialogHeader>
                        <DialogTitle className='pl-4'>Manage Users Roles</DialogTitle>
                    </DialogHeader>
                    {
                        roleLoading ?
                            <div className='h-[50vh] overflow-y-auto p-4'>
                                <LoadingSpinner size={60} />
                            </div> :
                            <div className='max-h-[90vh] p-4' >
                                <DataTable columns={AppSettingColumns} data={roleAccessForApp} extraParams={extraParams}/>
                            </div>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}
