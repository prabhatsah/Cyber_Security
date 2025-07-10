import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService'
import { format, parseISO } from 'date-fns';
import React from 'react'
import ActiveRequisitionDt from './components/activeRequisitionDt';

interface VendableItemData {
    itemId: string;
    itemName: string;
    [key: string]: any; // Allow additional properties
}

export interface VendableItemInstance {
    data?: VendableItemData;
}

export interface RequisitionInstance {
    data?: Record<string, any>;
    taskId:string
}

async function getVendableItem(): Promise<{ vendableItemMap: Record<string, string>, allItemDetails: Record<string, any>,vendabledata: Record<string,any> | undefined[] }> {
    const vendableItemInstance: VendableItemInstance[] = await getMyInstancesV2({
        processName: "Vendable Item",
        predefinedFilters: { taskName: "Item" },
    });

    let vendableItemMap: Record<string, string> = {};
    let allItemDetails: Record<string, any> = {};

    let vendabledata:Record<string,any> | undefined[] = []

    for (let i = 0; i < vendableItemInstance.length; i++) {
        const data = vendableItemInstance[i].data;
        vendabledata.push(data);
        if (!data || !data.itemId || !data.itemName) continue;

        const { itemId, itemName } = data;
        vendableItemMap[itemId] = itemName;
        allItemDetails[itemId] = data;
    }

    return { vendableItemMap, allItemDetails, vendabledata};
}

async function getRequisitionItemDetails(): Promise<Record<string, any>[]> {
    const { allItemDetails } = await getVendableItem();

    const requisitionInstance: RequisitionInstance[] = await getMyInstancesV2({
        processName: "Requisition",
        predefinedFilters: { taskName: "Edit Requisition" },
    });

    let purchaseRequisitionDetails: Record<string, any>[] = [];

    for (let i = 0; i < requisitionInstance.length; i++) {
        const requisitionInstanceData = requisitionInstance[i].data ?? {};
        requisitionInstanceData.allItemDetails = { ...allItemDetails };
        purchaseRequisitionDetails.push(requisitionInstanceData);
    }

    return purchaseRequisitionDetails;
}

async function renderPurchaseRequisitionTable() {
    const purchaseRequisitionDetails = await getRequisitionItemDetails();
    const { vendableItemMap } = await getVendableItem();
    for (let i = 0; i < purchaseRequisitionDetails.length; i++) {
        var itemId = [];
        var itemName = "";
        let purchaseOrderObj = purchaseRequisitionDetails[i].supplierItems;
        for (let each in purchaseOrderObj) {
            itemId.push(purchaseOrderObj[each]);
        }

        for (let i = 0; i < itemId.length; i++) {
            itemName = itemName + vendableItemMap[itemId[i]] + ", ";
        }

        var allItemName = itemName.replace(/,\s*$/, "");
        purchaseRequisitionDetails[i]["itemName"] = allItemName;
    }

    for (let i = 0; i < purchaseRequisitionDetails.length; i++) {
        if (purchaseRequisitionDetails[i].purchaseRequisitionDeliveryDate) {
            purchaseRequisitionDetails[i].purchaseRequisitionDeliveryDate = format(purchaseRequisitionDetails[i].purchaseRequisitionDeliveryDate, 'yyyy-MM-dd');
        }
    }

    const totalData = [...purchaseRequisitionDetails];

    return totalData;
}


async function getApprovedRequisitionItemDetails() {

    const { allItemDetails } = await getVendableItem();

    const requisitionInstance: RequisitionInstance[] = await getMyInstancesV2({
        processName: "Requisition",
        predefinedFilters: { taskName: "Approved Purchase Requisition Item" },
    })
    let approvedRequisitionDetails:Record<string, any>[] = [];

    for (let i = 0; i < requisitionInstance.length; i++) {
        const requisitionInstanceData = requisitionInstance[i].data ?? {};
        requisitionInstanceData.allItemDetails = { ...allItemDetails };
        approvedRequisitionDetails.push(requisitionInstanceData);
    }

    return approvedRequisitionDetails;
}

async function renderApprovedPurchaseRequisitionTable(){

    const approvedPurchaseRequisitionDetails = await getApprovedRequisitionItemDetails();
    const { vendableItemMap } = await getVendableItem();
    for(let i = 0; i < approvedPurchaseRequisitionDetails.length; i++) {
        var itemId = [];
        var itemName = "";
        let purchaseOrderObj = approvedPurchaseRequisitionDetails[i].supplierItems;
        for(let each in purchaseOrderObj){
            itemId.push(purchaseOrderObj[each]);
        }

        for(let i=0; i<itemId.length; i++) {
            itemName = itemName + vendableItemMap[itemId[i]] + ", ";
        }

        var allItemName = itemName.replace(/,\s*$/, "");
        approvedPurchaseRequisitionDetails[i]["itemName"] = allItemName;
    }

    for (let i = 0; i < approvedPurchaseRequisitionDetails.length; i++) {
        if (approvedPurchaseRequisitionDetails[i].purchaseRequisitionDeliveryDate) {
            approvedPurchaseRequisitionDetails[i].purchaseRequisitionDeliveryDate = format(approvedPurchaseRequisitionDetails[i].purchaseRequisitionDeliveryDate, 'yyyy-MM-dd');
        }
    }

    const totalData = [...approvedPurchaseRequisitionDetails];

    return totalData;
}


export default async function Requisition() {
    const totalData = await renderPurchaseRequisitionTable();
    const totalApprovedData = await renderApprovedPurchaseRequisitionTable();
    console.log(totalData);
    console.log(totalApprovedData);
    const {vendabledata} = await getVendableItem();
    return (
        <>
            <ActiveRequisitionDt totalData={totalData} totalApprovedData={totalApprovedData} vendabledata={vendabledata} />
        </>
    )
}
