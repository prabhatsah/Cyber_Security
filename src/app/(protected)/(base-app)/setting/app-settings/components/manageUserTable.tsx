'use client'

import { DTColumnsProps } from '@/ikon/components/data-table/type';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import React, { useEffect, useState } from 'react'
import { AppSettingUsersTable } from './type';
import { DataTable } from '@/ikon/components/data-table';
import { getAllUsersForRoleMembership, getGroupForRole, saveMembershipForUsers } from '@/ikon/utils/api/roleService';
import { getAccount } from '@/ikon/utils/actions/account';
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
import { FailureToast, SuccessToast } from './toasterSettingTable';
import { GetUserMembershipForApp } from './getUserMembershipForApp';
import { Checkbox } from '@/shadcn/ui/checkbox';



export default function ManageUserTable({ open, setOpen, roleId, softwareId, activeUserDetails }: any) {
    console.log(roleId)
    const [groupResponse, setGroupResponse] = useState(null);
    const [usersResponse, setUserResponse] = useState(null);
    const [userMemberForApp, setUserMemberForApp] = useState<string[]>([]);
    const [checkedRows, setCheckeRows] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [isSaved, setIsSaved] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true); // Start loading
    //         setUserMemberForApp([])
    //         try {
    //             const groupForRole = await getGroupForRole({ roleId });
    //             setGroupResponse(groupForRole);

    //             if (groupForRole.length > 0) {
    //                 const { ACCOUNT_ID } = await getAccount();
    //                 const userRoleFormMembership = await getAllUsersForRoleMembership({
    //                     roleId: roleId,
    //                     accountId: ACCOUNT_ID,
    //                 });
    //                 setUserResponse(userRoleFormMembership);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         } finally {
    //             setLoading(false); // Stop loading after fetching is done
    //         }
    //     };

    //     if (roleId) {
    //         fetchData();
    //     }
    // }, [roleId]);


    // useEffect(() => {
    //     const userMember = usersResponse?.filter((userMember: Record<any, any>) => (
    //         userMember.MEMBER === "member"
    //     ))
    //         .map((userMemberId: Record<any, any>) => (
    //             userMemberId.USER_ID
    //         ))
    //     setUserMemberForApp(userMember);
    //     setCheckeRows(userMember);
    // }, [usersResponse]);

    useEffect(()=>{
        const fetchDataForParticularRole = async()=>{
            setLoading(true);
            try{
                const membershipForParticularRole = await GetUserMembershipForApp({roleId});
                console.log(membershipForParticularRole);
                setUserMemberForApp(membershipForParticularRole);
                setCheckeRows(membershipForParticularRole);
            }catch(error){
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        if(roleId){
            fetchDataForParticularRole();
        }
    },[roleId])

    useEffect(() => {

        const saveUserAppData = async () => {
            try {
                const { ACCOUNT_ID } = await getAccount();
                const membershipForUsers = await saveMembershipForUsers({
                    roleId: roleId,
                    userIds: userMemberForApp,
                    softwareId: softwareId,
                    accountId: ACCOUNT_ID
                });
                console.log("Membership For Saved Users: " + membershipForUsers);
                SuccessToast();

            } catch (error) {
                FailureToast();
                console.log("Error Saving Data", error);
            }
        }

        if (isSaved) {
            saveUserAppData();
            setIsSaved(false);
            setOpen(false);
        }

    }, [isSaved])

    const userIdofCheckedRows = (row: any) => {
        setCheckeRows((prevCheckedRows: any) =>
            prevCheckedRows.includes(row.original.userId)
                ? prevCheckedRows.filter((id: any) => id !== row.original.userId) // Remove if exists
                : [...prevCheckedRows, row.original.userId] // Add if not present
        );
    }

    const onSaveChange = () => {
        console.log(userMemberForApp)
        setUserMemberForApp(checkedRows);
        setIsSaved(true);
    }
    const AppSettingUsersColumns: DTColumnsProps<AppSettingUsersTable>[] = [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={
        //                 table.getIsAllPageRowsSelected() ||
        //                 (table.getIsSomePageRowsSelected() && "indeterminate")
        //             }
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //         />
        //     ),
        //     cell: ({ row }) => {
        //         const isSelected = checkedRows?.some(user => {
        //             return user === row.original.userId
        //         });
        //         useEffect(() => {
        //             if (isSelected) {
        //                 row.toggleSelected(true)
        //             }
        //         }, [isSelected, row])
        //         return (
        //             <Checkbox
        //                 checked={row.getIsSelected()}
        //                 onCheckedChange={(value) => {
        //                     row.toggleSelected(!!value);
        //                     userIdofCheckedRows(row);
        //                 }}
        //                 aria-label="Select row"
        //             />
        //         )
        //     },
        // },
        {
            accessorKey: "userName",
            header: "User Name",
        },
        {
            accessorKey: "userEmail",
            header: "User Email",
        },
        {
            accessorKey: "userLogin",
            header: "User Login",
        },

    ]

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="md:max-w-[90%] md:max-h-[90%] sm:max-w-[445px] sm:max-h-[100vh]">
                    <DialogHeader>
                        <DialogTitle className='pl-4'>Manage Users</DialogTitle>
                    </DialogHeader>
                    {
                        loading ?
                            <div className='h-[50vh] overflow-y-auto p-4'>
                                <LoadingSpinner size={60} />
                            </div> :
                            <div className='max-h-[80vh] overflow-y-auto p-4' >
                                <DataTable columns={AppSettingUsersColumns} data={activeUserDetails} extraParams={{
                                    checkBoxColumn: true
                                }} />
                                {/* <DataTable columns={AppSettingUsersColumns} data={activeUserDetails} /> */}
                            </div>
                    }
                    {
                        !loading &&
                        <DialogFooter>
                            <Button onClick={() => { onSaveChange() }}>Save</Button>
                        </DialogFooter>
                    }
                </DialogContent>
            </Dialog>

        </>
    )
}
