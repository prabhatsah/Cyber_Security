import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React, { useEffect, useState } from 'react'

export default function RequisitonView({ open, setOpen, viewData }: any) {
    console.log(viewData);
    const [raisedByName, setRaisedByName] = useState<string | null>(null);
    const [approverName,setApproverName] = useState<string | null>(null);
    useEffect(() => {
        async function userDetails() {
            const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

            if (Object.keys(userIdWiseUserDetailsMap).length) {
                const requisitionRaisedByid = viewData.requisitionRaisedBy
                const requisetRaisedName = userIdWiseUserDetailsMap[requisitionRaisedByid].userName;
                setRaisedByName(requisetRaisedName);
                const requisitionApprovedById = viewData?.approvedBy||'';
                if(requisitionApprovedById.length){
                    const requisitionApprovedByName = userIdWiseUserDetailsMap[requisitionApprovedById].userName;
                    setApproverName(requisitionApprovedByName);
                }
            }
        }
        userDetails();
    }, [])

    const columnsViewRequisition: DTColumnsProps<any>[] = [
        {
            header: "Sl No.",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "itemName",
            header: "Item Name"
        },
        {
            accessorKey: "requiredQuantity",
            header: "Number of Required Items"
        },
        {
            accessorKey: "remarks",
            header: "Remarks"
        },
    ];

    const extraParamsApprovedTable: DTExtraParamsProps = {}

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[40%]">
                <DialogHeader>
                    <DialogTitle>View Details</DialogTitle>
                </DialogHeader>
                {
                    raisedByName?
                        < div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            <div className='flex flex-row gap-3'>
                                <p>Raised By:</p>
                                <p>
                                    {raisedByName}
                                </p>
                            </div>
                            <div className='flex flex-row gap-3'>
                                <p>Estimated Delivery Date: </p>
                                <p>
                                    {viewData.estimatedDelivery}
                                </p>
                            </div>
                            <div className='flex flex-row gap-3'>
                                <p>Approval Status: </p>
                                <p>
                                    {viewData.approvalStatus}
                                </p>
                            </div>
                            <div className='flex flex-row gap-3'>
                                <p>Approved By: </p>
                                <p>
                                    {
                                        approverName? approverName: 'n/a'
                                    }
                                </p>
                            </div>
                            <div className='flex flex-row gap-3'>
                                <p>Requisition Raised Date: </p>
                                <p>
                                    {viewData.raisedOn}
                                </p>
                            </div>
                            <div className='flex flex-row gap-3'>
                                <p>Requisition Approved Date: </p>
                                <p>
                                    {viewData?.approvedOn||'n/a'}
                                </p>
                            </div>
                            <div className='flex flex-row gap-3'>
                                <p>Requisition Updated On: </p>
                                <p>
                                    {viewData.updatedOn}
                                </p>
                            </div>
                            <div className='col-span-1 md:col-span-2'>
                                <DataTable data={viewData.requisitionData} columns={columnsViewRequisition} extraParams={extraParamsApprovedTable} />
                            </div>
                        </div> :
                        <LoadingSpinner size={60} />
                }
                <DialogFooter>
                    <Button onClick={()=>setOpen(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
