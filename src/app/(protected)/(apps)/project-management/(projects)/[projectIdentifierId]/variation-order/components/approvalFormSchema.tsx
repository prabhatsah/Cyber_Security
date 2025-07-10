import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Textarea } from '@/shadcn/ui/textarea'
import React, { useEffect, useState } from 'react'
import AapproveVoForm from './approveVoForm';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { getSoftwareIdByNameVersion } from '@/ikon/utils/actions/software';
import { getUserMapForCurrentAccount } from '../../../components/getProjectManagerDetails';
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
import { useParams } from 'next/navigation';

type ManagerDetails = {
    userId: string;
    userName: string;
    userActive: boolean;
};

type UserMap = Record<string, ManagerDetails>;

type SelectOption = {
    value: string;
    label: string;
};

export default function ApprovalFormSchema({ open, setOpen, checkedRows }: any) {
    console.log(checkedRows);
    const [approveVo, setApproveVo] = useState<boolean>(false);

    const [dealsData, setDealsData] = useState<Record<string, any>[] | null>(null);
    const [accountData, setAccountData] = useState<Record<string, any>[] | null>(null);
    // const [productData, setProductData] = useState<Record<string, any>[] | null>(null);
    const [projectMg, setProjMg] = useState<Record<string, any>[] | null>(null);
    const [accountManagerDetails, setAccountManagerDetails] = useState<Record<string, any>[] | null>(null);
    const [projectInstanceDetails, setProjectInstanceDetails] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const params = useParams();

    async function fetchData() {
        try {
            setLoading(true);
            const dealsInstanceData = await getMyInstancesV2({
                processName: "Deal",
                softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
                predefinedFilters: { taskName: "View State" },
            });
            const dealsData = dealsInstanceData.map((e: any) => e.data);

            console.log(dealsData)
            setDealsData(dealsData);

            const accountInsData = await getMyInstancesV2({
                processName: "Account",
                softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
                predefinedFilters: { taskName: "View State" },
            });
            const accountData = accountInsData.map((e: any) => e.data);

            console.log(accountData)
            setAccountData(accountData)

            const usersProjectManagerGroup: UserMap = await getUserMapForCurrentAccount({
                groups: ["Project Manager"],
            });

            const activeUsersPMGrp: SelectOption[] = Object.values(usersProjectManagerGroup)
                .filter((managerDetails) => managerDetails?.userActive)
                .map((activeManagerDetails) => ({
                    value: activeManagerDetails.userId,
                    label: activeManagerDetails.userName
                }));

            setProjMg(activeUsersPMGrp)


            const projectIdentifier = params?.projectIdentifierId;
            const mongoWhereClause = 'this.Data.productType == "Professional Service"';
            const productInstance = await getMyInstancesV2({
                processName: "Product",
                softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
                predefinedFilters: { taskName: "View State" },
                processVariableFilters: { "dealIdentifier": projectIdentifier },
                mongoWhereClause
            })

            const productInstanceData = productInstance.map((e: any) => e.data);
            setProjectInstanceDetails(productInstanceData);


            const usersAccountManagerGroup: UserMap = await getUserMapForCurrentAccount({
                groups: ["Account Manager"],
            });

            console.log(usersAccountManagerGroup);

            const activeUsersAccountManagerGroup: SelectOption[] = Object.values(usersAccountManagerGroup)
                .filter((managerDetails) => managerDetails?.userActive)
                .map((activeManagerDetails) => ({
                    value: activeManagerDetails.userId,
                    label: activeManagerDetails.userName
                }));

            setAccountManagerDetails(activeUsersAccountManagerGroup)


        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    function approveafn() {
        setApproveVo(true)
    }

    async function rejectFn() {

        const selectedNotificationIds = checkedRows.map((selectedRows: Record<string, any>) => selectedRows.notiIdentifier);
        let mongoWhereClause = ``;
        for (let i = 0; i < selectedNotificationIds.length; i++) {
            mongoWhereClause += `this.Data.notiIdentifier=='${selectedNotificationIds[i]}' || `;
        }
        mongoWhereClause = mongoWhereClause.substring(0, mongoWhereClause.length - 3);

        const changeNotificationInstances = await getMyInstancesV2({ processName: "Change Notification", mongoWhereClause: mongoWhereClause });

        for (var x in changeNotificationInstances) {
            var taskId = changeNotificationInstances[x].taskId;
            var transitionName = "Update Notification";
            var updatedObj: Record<string, any> = changeNotificationInstances[x].data || {};
            updatedObj.approvedStatus = "Rejected"
            await invokeAction({
                taskId,
                transitionName,
                data: updatedObj,
                processInstanceIdentifierField: "userId"
            })
        }

        setOpen(false);

    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[50%]">
                    <DialogHeader>
                        <DialogTitle>
                            {
                                !approveVo ?
                                    "Variation Form" : "Deal Form"
                            }
                        </DialogTitle>
                    </DialogHeader>
                    <div className='max-h-[60vh] overflow-auto'>
                        {
                            approveVo ? loading ? <div className='h-[60vh]'><LoadingSpinner size={60} /></div> :
                                <AapproveVoForm
                                    dealsData={dealsData}
                                    accountData={accountData}
                                    // productData={productData}
                                    projectManagers={projectMg}
                                    accountManagerDetails={accountManagerDetails}
                                    checkedRows={checkedRows}
                                    setOpen={setOpen}
                                    projectInstanceDetails={projectInstanceDetails}
                                /> :
                                <div className="grid gap-4 p-2 h-full">
                                    <Textarea placeholder="Type your Remarks here." />
                                </div>
                        }
                    </div>
                    {
                        !approveVo &&
                        <DialogFooter>
                            <Button onClick={approveafn}>Approve</Button>
                            <Button onClick={rejectFn}>Reject</Button>
                        </DialogFooter>
                    }
                </DialogContent>
            </Dialog>

        </>
    )
}
