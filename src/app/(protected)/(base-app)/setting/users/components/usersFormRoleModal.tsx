'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs'
import React, { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { UserDetailsForm } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/shadcn/ui/form'
import FormInput from '@/ikon/components/form-fields/input'
import { IconTextButton, TextButton } from '@/ikon/components/buttons'
import { Eye, EyeOff, KeyRound, Save } from 'lucide-react'
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type'
import { DataTable } from '@/ikon/components/data-table'
import { createUserV2, editUser } from '@/ikon/utils/api/userService'
import { LoadingSpinner } from '@/ikon/components/loading-spinner'
import RoleMembershipInfo from './roleMembershipInfo'
import SaveUsersData from './saveUsersData'
import { getEmailData } from './saveNewUserData'
import { getActiveAccountId } from '@/ikon/utils/actions/account'
import PasswordStrengthMeter from '@/ikon/components/password-strength-meter'
import { Button } from '@/shadcn/ui/button'
import { getUserDetailsMap } from './getUserDetailsMap'
import { revalidateData } from '@/ikon/utils/actions/common/revalidate'
import { useRouter } from 'next/navigation'


export default function UsersFormRoleModal({ open, setOpen, editUserDetails, membershipDetails, setUpdateUserDetails }: any) {
    console.log(editUserDetails);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedRoleForUser, setSelectedRoleForUser] = useState<Record<string, any>>({})
    const [membershipLoading, setMembershipLoading] = useState<boolean>(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [randomPassword, setRandomPassword] = useState('');
    console.log(selectedRoleForUser);
    const form = useForm<z.infer<typeof UserDetailsForm>>({
        resolver: zodResolver(UserDetailsForm),
        defaultValues: {
            USER_NAME: '',
            USER_EMAIL: '',
            USER_LOGIN: '',
            USER_PHONE: '',
            USER_PASSWORD: "",
            confirmPassword: "",
        },
    });
    const { watch, getValues } = form;
    useEffect(() => {
        const getGroupMembership = async () => {
            setMembershipLoading(true);
            try {
                const userId = editUserDetails?.userId;
                if (userId) {
                    const allRoleMembershipForUser = await RoleMembershipInfo({ userId });
                    allRoleMembershipForUser.map((e: Record<string, string>) => {
                        setSelectedRoleForUser((prev) => {
                            const roleId = e?.ROLE_ID;
                            const softwareId = e?.SOFTWARE_ID;
                            const userSelection = prev[userId] || {};
                            return {
                                ...prev,
                                [userId]: {
                                    ...userSelection,
                                    [softwareId]: [roleId]
                                },
                            };
                        })
                    })
                }
            } catch (error) {
                console.error('Error in fetching data from getUserGroupMembershipV2');
                console.log(error);
            } finally {
                setMembershipLoading(false);
            }
        }
        if (Object.keys(editUserDetails).length !== 0) {
            getGroupMembership();
        }

    }, [])


    useEffect(() => {
        form.reset({
            USER_NAME: editUserDetails?.userName || getValues('USER_NAME') || '',
            USER_EMAIL: editUserDetails?.userEmail || getValues('USER_EMAIL') || '',
            USER_LOGIN: editUserDetails?.userLogin || getValues('USER_LOGIN') || '',
            USER_PHONE: editUserDetails?.userPhone || getValues('USER_PHONE') || '',
            USER_PASSWORD: randomPassword || "",
            confirmPassword: randomPassword || "",
        })
        setCurrentUserId(editUserDetails?.userId || '');
    }, [editUserDetails, randomPassword])

    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["displayAppName"],
        grouping: false,
    };

    const AppColumnsForUserRole: DTColumnsProps<any>[] = [
        {
            id: "select",
            cell: ({ row }) => {
                const userId = editUserDetails?.userId || 'newUserTemporaryUserId';
                const softwareId = userId ? row.original.SOFTWARE_ID : null;
                const roleId = userId ? row.original.ROLE_ID : null;
                return (
                    <input
                        type="checkbox"
                        name={softwareId}
                        checked={selectedRoleForUser[userId]?.[softwareId]?.includes(roleId) || false}
                        onChange={() =>
                            setSelectedRoleForUser((prev) => {
                                const userSelection = prev[userId] || {};
                                const softwareSelection = userSelection[softwareId] || [];

                                return {
                                    ...prev,
                                    [userId]: {
                                        ...userSelection,
                                        [softwareId]: softwareSelection.includes(roleId)
                                            ? [] // If already selected, deselect all
                                            : [roleId], // Otherwise, select only this roleId
                                    },
                                };
                            })
                        }
                    />
                )
            },
        },

        {
            accessorKey: "displayAppName",
            header: "Software Name",
        },
        {
            accessorKey: "ROLE_NAME",
            header: "Role Name",
        }
    ]

    function setRandomPasswordForUser() {
        const length = 20;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const specialChars = "@#$";
        let retVal = "";
        retVal += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
        for (var i = 1, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        retVal = charset.charAt(Math.floor(Math.random() * charset.length)) + retVal.split('').sort(function () { return 0.5 - Math.random() }).join('');
        setRandomPassword(retVal);
    }

    async function saveUserInfo(data: z.infer<typeof UserDetailsForm>) {
        console.log(data);
        console.log(selectedRoleForUser)
        const selectedRoleIdForCurrentUsers: string[] = []
        const roledWiseId = Object.values(selectedRoleForUser)[0];
        for (let roleid in roledWiseId) {
            if (roleid) {
                selectedRoleIdForCurrentUsers.push(roledWiseId[roleid][0])
            }
            console.log(roledWiseId[roleid][0])
        }
        const membershipInfo = await SaveUsersData({ currentUserId, membershipDetails, selectedRoleIdForCurrentUsers });
        console.log('Saved data')
        console.log(membershipInfo);
        try {
            if (currentUserId.length > 0) {
                await editUser({
                    userId: currentUserId,
                    userName: data.USER_NAME,
                    userPassword: data.confirmPassword || '',
                    userPhone: data.USER_PHONE,
                    userEmail: data.USER_EMAIL,
                    userThumbnail: null,
                    chargeable: true,
                    membershipMap: membershipInfo
                })
            } else {
                console.log('Save Button Clicked For New User');
                const accountId = await getActiveAccountId();
                const emailDataInstance = await getEmailData();
                let emailData: any = emailDataInstance?.[0]?.data || {};
                if (emailData) {
                    let subject = emailData?.subject || "User Created - IKON";
                    let emailBody = emailData?.body || '';
                    emailBody = emailBody.replaceAll("__UserName__", data.USER_NAME);
                    emailBody = emailBody.replaceAll("__UserLogin__", data.USER_LOGIN);
                    emailBody = emailBody.replaceAll("__UserPassword__", '');
                    emailBody = emailBody.replaceAll("__ServerURL__", emailData.serverUrl);
                    await createUserV2({
                        userName: data.USER_NAME,
                        userLogin: data.USER_LOGIN,
                        userPassword: data.confirmPassword || 'qriwnf112K8rIjl',
                        userPhone: data.USER_PHONE,
                        userEmail: data.USER_EMAIL,
                        userThumbnail: null,
                        userType: 'Human',
                        chargeable: true,
                        accountId: accountId,
                        membershipMap: membershipInfo,
                        emailSubject: subject,
                        emailContent: emailBody
                    })
                } else {
                    console.error('Data not Saved');
                }

            }

            startTransition(() => {
                router.refresh();
            });
            // await revalidateData({
            //     paths: ["/setting/user"],
            //     tags: ["userMap"]
            // })

            // const userDetailsMap = await getUserDetailsMap();
            // setUpdateUserDetails(userDetailsMap);
            setOpen(false)

        } catch (error) {
            console.log(error);
        }


    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="md:max-w-[90%] md:max-h-[90%] sm:max-w-[445px] sm:max-h-[100vh]">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>

                    {
                        membershipLoading ? <div className='md:h-[50vh] sm:h-[100vh] overflow-y-auto p-4' ><LoadingSpinner size={60} /></div> :
                            <Tabs defaultValue="userInfo" className="">
                                <TabsList className="w-full self-start">
                                    <TabsTrigger value="userInfo">User Info</TabsTrigger>
                                    <TabsTrigger value="membership">Membership</TabsTrigger>
                                </TabsList>

                                <TabsContent value="userInfo">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle></CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 md:h-[50vh] sm:h-[100vh] overflow-y-auto p-4">
                                            <Form {...form}>
                                                <form>
                                                    <div className='grid grid-cols-1 gap-3'>
                                                        <FormInput formControl={form.control} name={"USER_LOGIN"} label={"User Login"} placeholder={"Enter User Login"} />
                                                        <FormInput formControl={form.control} name={"USER_NAME"} label={"User Name"} placeholder={"Enter User Name"} />
                                                        <FormInput formControl={form.control} name={"USER_EMAIL"} label={"User Email"} placeholder={"Enter User Email"} />
                                                        <FormInput formControl={form.control} name={"USER_PHONE"} label={"User Phone"} placeholder={"Enter User Phone"} />
                                                        <div className='flex flex-row gap-1'>
                                                            <div className='flex-grow'>
                                                                <FormInput type={showPassword ? "text" : "password"} formControl={form.control} name={"USER_PASSWORD"} label={"User Password"} placeholder={"Enter Password"}
                                                                    formDescription="* Please keep password blank if you would like to preserve old password."
                                                                    extraFormComponent={(value) => <PasswordStrengthMeter value={value || ""} />}
                                                                    autoComplete='new-password'
                                                                />
                                                            </div>
                                                            <Button type='button' onClick={() => { setShowPassword(!showPassword) }} className='self-center mb-3'>{showPassword ? <Eye /> : <EyeOff />}</Button>
                                                            <Button type='button' onClick={setRandomPasswordForUser} className='self-center mb-3'><KeyRound /></Button>
                                                        </div>
                                                        <FormInput type={showPassword ? "text" : "password"} formControl={form.control} name={"confirmPassword"} label={"Confirm Password"} placeholder={"Enter Confirm Password"} />
                                                    </div>
                                                </form>
                                            </Form>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="membership">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle></CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">

                                            <div className='md:max-h-[50vh] sm:max-h-[100vh] overflow-y-auto p-4' >
                                                <DataTable columns={AppColumnsForUserRole} data={membershipDetails} extraParams={extraParams} />
                                            </div>

                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                    }
                    <DialogFooter>
                        <TextButton className='mt-3' onClick={form.handleSubmit(saveUserInfo)}>
                            Update
                        </TextButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}
