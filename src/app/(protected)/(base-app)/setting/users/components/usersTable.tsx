'use client'
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import React, { useEffect, useState, useTransition } from 'react'
import { activateUser, deactivateUser } from '@/ikon/utils/api/userService';
import { CreateNewUserButton } from './createNewUsersButton';
import UsersFormRoleModal from './usersFormRoleModal';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';

export default function UsersTable({ usersDetails, membershipDetails }: { usersDetails: Record<string, any>, membershipDetails: Record<string, any> }) {
    console.log(usersDetails);
    const [activeUsers, setActiveUser] = useState<Record<string, any>[]>([]);
    const [deactiveUsers, setDeactiveUser] = useState<Record<string, any>[]>([]);
    const [viewActiveUsers, setViewActiveUsers] = useState<boolean>(true);
    const [deactiveUserId, setDeactiveUserId] = useState<Record<string, any>>({});
    const [activeUserId, serActiveUserId] = useState<Record<string, any>>({});
    const [userDetailsLoading, setUserDetailsLoading] = useState<boolean>(false);
    const [openExistingUsersForm, setOpenExistingUsersForm] = useState<boolean>(false);
    const [editUserDetails, setEditUserDetails] = useState<Record<string, string | boolean>>({});
    const [updateUserDetails, setUpdateUserDetails] = useState<any>(null);

    useEffect(() => {
        setActiveUser([]);
        setDeactiveUser([]);
        if (updateUserDetails) {
            Object.values(updateUserDetails).map((userDetails) => {
                if (userDetails?.userActive) {
                    setActiveUser((prev) => (
                        [...prev, userDetails]
                    ));
                } else {
                    setDeactiveUser((prev: any) => (
                        [...prev, userDetails]
                    ));
                }
            });
        } else {
            Object.values(usersDetails).map((userDetails) => {
                if (userDetails.userActive) {
                    setActiveUser((prev) => (
                        [...prev, userDetails]
                    ));
                } else {
                    setDeactiveUser((prev) => (
                        [...prev, userDetails]
                    ));
                }
            });
        }
    }, [updateUserDetails])


    useEffect(() => {
        const deactivateUsersById = async () => {
            setUserDetailsLoading(true);
            try {
                console.log("User Id To Be deactivated: ");
                console.dir(deactiveUserId);
                await deactivateUser({
                    userId: deactiveUserId.userId
                })

                setActiveUser((prevActive) => {
                    return prevActive.filter((user) => user.userId !== deactiveUserId.userId);
                })

                setDeactiveUser((prevDeactive) => [...prevDeactive, deactiveUserId]);

                setDeactiveUserId({});
            } catch (error) {
                console.log('Error In Deactivating User: ' + error);
            } finally {
                setUserDetailsLoading(false);
            }
        }

        const activateUsersById = async () => {
            setUserDetailsLoading(true);
            try {
                console.log("User Id To Be Activated: ");
                console.dir(activeUserId);
                await activateUser({
                    userId: activeUserId.userId
                })

                setDeactiveUser((prevDeactive) => {
                    return prevDeactive.filter((user) => user.userId !== activeUserId.userId);
                })

                setActiveUser((prevActive) => [...prevActive, activeUserId]);

                serActiveUserId({});
            } catch (error) {
                console.log('Error In Activating User: ' + error);
            } finally {
                setUserDetailsLoading(false);
            }
        }

        if (viewActiveUsers && Object.keys(deactiveUserId).length !== 0) {
            deactivateUsersById();
        }
        if (!viewActiveUsers && Object.keys(activeUserId).length !== 0) {
            activateUsersById();
        }
    }, [deactiveUserId, activeUserId])

    const rowsToDisplay = viewActiveUsers ? activeUsers.sort((a, b) => a.userName.localeCompare(b.userName)) : deactiveUsers.sort((a, b) => a.userName.localeCompare(b.userName));

    const extraParams: DTExtraParamsProps = {
        actionMenu: {
            items: [
                ...viewActiveUsers ? [
                    {
                        label: "Edit Users",
                        onClick: (rowData: Record<string, string>) => {
                            setEditUserDetails(rowData);
                            setOpenExistingUsersForm(true);
                        },
                    }] : [],
                {
                    label: viewActiveUsers ? "Deactivate Users" : "Activate Users",
                    onClick: (rowData: Record<string, string>) => {
                        console.log(rowData);
                        if (viewActiveUsers) {
                            setDeactiveUserId(rowData);
                        } else {
                            serActiveUserId(rowData);
                        }
                    },
                },

            ]
        },
        extraTools: [
            <ToggleGroup type="single" variant='outline' value={"" + viewActiveUsers} onValueChange={(value: string) => {
                setViewActiveUsers(value == "true")
            }}>
                <ToggleGroupItem className="rounded-e-none" value="true">
                    Active
                </ToggleGroupItem>
                <ToggleGroupItem className='rounded-s-none border-s-0' value="false">
                    Inactive
                </ToggleGroupItem>
            </ToggleGroup>,
            <CreateNewUserButton membershipDetails={membershipDetails} setUpdateUserDetails={setUpdateUserDetails} />

        ],
        header: false,
        grouping: false,

    };

    const UsersColumns: DTColumnsProps<Record<string, any>>[] = [
        {
             accessorKey: "userName",
            id: "userDetails",
            accessorFn: (row) => `${row.userEmail} ${row.userName}`,
            cell: ({ row }) => {
                return (
                    <div className="flex items-center space-x-4">
                        <span
                            className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 sm:flex dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                            aria-hidden="true"
                        >

                            {row.original.userName?.match(/\b([A-Za-z])/g)?.join("").toUpperCase()}

                        </span>
                        <div className="truncate">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                                {row.original.userName}
                            </p>
                            <p className="truncate text-xs text-gray-500">{row.original.userEmail}</p>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "userLogin",
            cell: ({ row }) => {
                return (
                    <div>
                        {
                            row.original.userActive ?
                                <span className="inline-flex items-center gap-x-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold ring-1 bg-emerald-50 text-emerald-800 ring-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20">
                                    {row.getValue("userLogin")}
                                </span> :
                                <span className="inline-flex items-center gap-x-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold ring-1 bg-red-50 text-red-800 ring-red-600/30 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20">
                                    {row.getValue("userLogin")}
                                </span>
                        }
                    </div>
                )
            }
        },
        {
            accessorKey: "userPhone",
        }
    ]

    return (
        <>
            {
                openExistingUsersForm &&
                <UsersFormRoleModal open={openExistingUsersForm} setOpen={setOpenExistingUsersForm} editUserDetails={editUserDetails} membershipDetails={membershipDetails} setUpdateUserDetails={setUpdateUserDetails} />
            }
            <DataTable
                columns={UsersColumns}
                data={rowsToDisplay}
                extraParams={extraParams}
            />

        </>
    )
}
