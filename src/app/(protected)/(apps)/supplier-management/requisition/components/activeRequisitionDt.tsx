"use client"
import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/ui/toggle-group';
import React, { useState } from 'react'
import OpenRequisitionForm from './openRequisitionForm';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { format } from "date-fns";
import { getCurrentUserId } from '@/ikon/utils/actions/auth';
import RequisitonView from './requisitonView';
import RequisitionForm from './requisitionForm';
import { Button } from '@/shadcn/ui/button';

interface RequisitionData {
    purchaseRequisitionIdentifier: string;
    requisitionStatus?: string;
    approvedBy?: string;
    approvedOn?: string;
    rejectedBy?: string;
}

interface RequisitionInstance {
    data: RequisitionData;
    taskId: string;
}

export default function ActiveRequisitionDt({ totalData, totalApprovedData, vendabledata }: { totalData: Record<string, any>[], totalApprovedData: Record<string, any>[], vendabledata: Record<string, any>[] | undefined }) {

    const [activeTable, setActiveTable] = useState("activeRequisiton");
    const [openViewModal, setOpenViewModal] = useState<boolean>(false);
    const [viewData, setViewData] = useState<Record<string, any>>({});
    const [openRequisitionForm, setOpenRequisitionForm] = useState<boolean>(false);
    const [editRowDetails, setEditRowDetails] = useState<Record<string, any> | null>(null);

    async function approvePurchaseRequisitionItem(rowData: Record<string, any>) {
        try {
            const requisitionInstance: RequisitionInstance[] = await getMyInstancesV2({
                processName: "Requisition",
                predefinedFilters: { taskName: "Edit Requisition" },
            });

            console.log(requisitionInstance);
            console.log(rowData);

            for (const instance of requisitionInstance) {
                const requisitionInstanceData = instance.data;

                if (requisitionInstanceData.purchaseRequisitionIdentifier === rowData.purchaseRequisitionIdentifier) {
                    requisitionInstanceData.requisitionStatus = "Approved";
                    requisitionInstanceData.approvedBy = await getCurrentUserId();
                    requisitionInstanceData.approvedOn = format(new Date(), "dd-MM-yyyy");

                    const taskId = instance.taskId;
                    const successRequisitionData = instance.data;

                    await invokeAction({
                        taskId: taskId,
                        transitionName: "Approve Purchase Requition Item",
                        data: successRequisitionData,
                        processInstanceIdentifierField: ""
                    })
                    console.log("Approved Row");

                }
            }
        } catch (error) {
            console.error("Error approving purchase requisition:", error);
        }
    }

    async function rejectPurchaseRequisitionItem(rowData: Record<string, any>) {
        try {
            const requisitionInstance: RequisitionInstance[] = await getMyInstancesV2({
                processName: "Requisition",
                predefinedFilters: { taskName: "Edit Requisition" },
            });

            console.log(requisitionInstance);
            console.log(rowData);

            for (const instance of requisitionInstance) {
                const requisitionInstanceData = instance.data;

                if (requisitionInstanceData.purchaseRequisitionIdentifier === rowData.purchaseRequisitionIdentifier) {
                    requisitionInstanceData.requisitionStatus = "Rejected";
                    requisitionInstanceData.rejectedBy = await getCurrentUserId();

                    const taskId = instance.taskId;
                    const rejectedRequisitionData = instance.data;

                    await invokeAction({
                        taskId: taskId,
                        transitionName: "Reject Purchase Requition Item",
                        data: rejectedRequisitionData,
                        processInstanceIdentifierField: ""
                    })
                    console.log("Rejected Row");

                }
            }
        } catch (error) {
            console.error("Error rejected purchase requisition:", error);
        }
    }

    function viewRequisition(rowData: Record<string, any>) {
        let requisitionDataTable = []
        let requisitonViewDetails = {}
        for (const instance of totalData) {
            if (instance.purchaseRequisitionIdentifier === rowData.purchaseRequisitionIdentifier) {
                console.log(instance);
                for (let j = 0; j < instance.supplierItems.length; j++) {
                    let eachItemId = instance["supplierItems"][j];
                    let eachItemDetails = instance["requiredItemObj"][eachItemId];
                    let eachItemData = {
                        "itemName": instance["allItemDetails"][eachItemId].itemName,
                        "requiredQuantity": eachItemDetails["requiredItemQuantity"],
                        "deliverDate": format(instance["purchaseRequisitionDeliveryDate"], "dd-MM-yyyy"),
                        "remarks": instance["requisitionShortDescription"],
                    }
                    requisitionDataTable.push(eachItemData)
                }
                requisitonViewDetails = {
                    requisitionData: requisitionDataTable,
                    requisitionRaisedBy: instance["requisitionRaisedBy"],
                    estimatedDelivery: format(instance["purchaseRequisitionDeliveryDate"], "dd-MMM-yyyy"),
                    approvalStatus: instance["requisitionStatus"],
                    raisedOn: format(instance["requisitionRaisedOn"], "dd-MMM-yyyy"),
                    updatedOn: format(instance["requisitionUpdatedOn"], "dd-MMM-yyyy"),
                    requisitionIdentifier: instance["requisitionIdentifier"],
                };
                break;
            }
        }

        setViewData(requisitonViewDetails);
        setOpenViewModal(true);
    }

    function viewApproveRequisition(rowData: Record<string, any>) {
        let requisitionDataTable = []
        let requisitonViewDetails = {}
        for (const instance of totalApprovedData) {
            if (instance.purchaseRequisitionIdentifier === rowData.purchaseRequisitionIdentifier) {
                console.log(instance);
                for (let j = 0; j < instance.supplierItems.length; j++) {
                    let eachItemId = instance["supplierItems"][j];
                    let eachItemDetails = instance["requiredItemObj"][eachItemId];
                    let eachItemData = {
                        "itemName": instance["allItemDetails"][eachItemId].itemName,
                        "requiredQuantity": eachItemDetails["requiredItemQuantity"],
                        "deliverDate": format(instance["purchaseRequisitionDeliveryDate"], "dd-MM-yyyy"),
                        "remarks": instance["requisitionShortDescription"],
                    }
                    requisitionDataTable.push(eachItemData)
                }
                requisitonViewDetails = {
                    requisitionData: requisitionDataTable,
                    requisitionRaisedBy: instance["requisitionRaisedBy"],
                    estimatedDelivery: format(instance["purchaseRequisitionDeliveryDate"], "dd-MMM-yyyy"),
                    approvalStatus: instance["requisitionStatus"],
                    raisedOn: format(instance["requisitionRaisedOn"], "dd-MMM-yyyy"),
                    updatedOn: format(instance["requisitionUpdatedOn"], "dd-MMM-yyyy"),
                    requisitionIdentifier: instance["requisitionIdentifier"],
                    approvedBy: instance["approvedBy"],
                    approvedOn: instance["approvedOn"]
                };
                break;
            }
        }

        console.log(requisitonViewDetails);

        setViewData(requisitonViewDetails);
        setOpenViewModal(true);
    }

    const columnsActiveRequisition: DTColumnsProps<any>[] = [
        {
            accessorKey: "requisitionIdentifier",
            header: "Requisition Id",
            cell: ({ row }) => (
                <Button onClick={() => {
                    setEditRowDetails(row.original);
                    setOpenRequisitionForm(true);
                }} variant='link'>
                    {row.original.requisitionIdentifier}
                </Button>
            )
        },
        {
            accessorKey: "itemName",
            header: "Item"
        },
        {
            accessorKey: "purchaseRequisitionDeliveryDate",
            header: "Delivery Date"
        },
        {
            accessorKey: "requisitionShortDescription",
            header: "Description"
        },
        {
            accessorKey: "requisitionStatus",
            header: "Status"
        },
    ];

    const extraParamsActiveTable: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "Approve",
                    onClick: async (rowData) => {
                        console.log(rowData);
                        await approvePurchaseRequisitionItem(rowData);
                    },
                },
                {
                    label: "Reject",
                    onClick: async (rowData) => {
                        console.log(rowData);
                        await rejectPurchaseRequisitionItem(rowData);
                    },
                },
                {
                    label: "View",
                    onClick: (rowData) => {
                        console.log(rowData);
                        viewRequisition(rowData);
                    },
                },
                // {
                //     label: "Edit",
                //     onClick: (rowData) => {
                //         console.log(rowData);
                //         setEditRowDetails(rowData);
                //         setOpenRequisitionForm(true);
                //     },
                // },

            ]
        },
        extraTools: [
            <OpenRequisitionForm vendabledata={vendabledata} />
        ]
    }

    const columnsApproveRequisition: DTColumnsProps<any>[] = [
        {
            accessorKey: "requisitionIdentifier",
            header: "Requisition Id Approved"
        },
        {
            accessorKey: "itemName",
            header: "Item"
        },
        {
            accessorKey: "purchaseRequisitionDeliveryDate",
            header: "Delivery Date"
        },
        {
            accessorKey: "requisitionShortDescription",
            header: "Description"
        },
        {
            accessorKey: "requisitionStatus",
            header: "Status"
        },
    ];

    const extraParamsApprovedTable: DTExtraParamsProps = {
        actionMenu: {
            items: [
                {
                    label: "View",
                    onClick: (rowData) => {
                        console.log(rowData);
                        viewApproveRequisition(rowData);
                    },
                },
            ]
        }
    }


    return (
        <>
            <div className="space-y-4">
                <ToggleGroup
                    type="single"
                    value={activeTable}
                    onValueChange={(value) => {
                        if (value) setActiveTable(value);
                    }}
                >
                    <ToggleGroupItem value="activeRequisiton">Active Requisition</ToggleGroupItem>
                    <ToggleGroupItem value="approvedRequisition">Approved Requisition</ToggleGroupItem>
                </ToggleGroup>

                <div>
                    {activeTable === "activeRequisiton" ? (
                        <div>
                            <DataTable columns={columnsActiveRequisition} data={totalData} extraParams={extraParamsActiveTable} />
                        </div>
                    ) : activeTable === "approvedRequisition" ? (
                        <div>
                            <DataTable columns={columnsApproveRequisition} data={totalApprovedData} extraParams={extraParamsApprovedTable} />
                        </div>
                    ) : null}
                </div>
            </div>
            {
                openViewModal &&
                <RequisitonView open={openViewModal} setOpen={setOpenViewModal} viewData={viewData} />
            }
            {
                openRequisitionForm && editRowDetails &&
                <RequisitionForm open={openRequisitionForm} setOpen={setOpenRequisitionForm} vendabledata={vendabledata} editRow={editRowDetails} />
            }
        </>
    );

}
