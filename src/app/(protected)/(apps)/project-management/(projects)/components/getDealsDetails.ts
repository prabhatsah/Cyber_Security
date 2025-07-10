'use server'
import { getBaseSoftwareId } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SubscribedAppData } from "./commonFunction";


async function getAccountIdWiseAccountDetails() {
    const baseAppSoftwareId = await getBaseSoftwareId();
    const accountProcessDetails = await getMyInstancesV2({
        processName: "Account",
        softwareId: baseAppSoftwareId,
        predefinedFilters: { "taskName": "View State" }
    })
    const accountIdWiseAccountMap = accountProcessDetails.reduce((acc:any, accountProcessData) => {
        let accountDetails = accountProcessData.data || {};
        acc[accountDetails.accountIdentifier] = accountDetails;
        return acc;
    }, {});

    return accountIdWiseAccountMap
}

export async function getDealDetails() {

    const accountIdWiseAccountMap = getAccountIdWiseAccountDetails();
    const getSubscribedAppData = await SubscribedAppData();
    const saleCrmDetails = getSubscribedAppData.filter((saleCrmDetail: Record<string, string>) => (saleCrmDetail.SOFTWARE_NAME === 'Sales CRM'))
    let leadPipelineProcessData = null;
    let dealProcessData = null;
    let dealDetails = [];
    let leadDetails:any = {};
    let dealStatusIdMap: any = [];
    if (saleCrmDetails.length > 0) {
        const saleCrmSoftwareId = saleCrmDetails[0].SOFTWARE_ID;
        leadPipelineProcessData = await getMyInstancesV2({
            processName: "Leads Pipeline",
            softwareId: saleCrmSoftwareId,
            predefinedFilters: { taskName: "View State" },
        });

        dealProcessData = await getMyInstancesV2({
            processName: "Deal",
            softwareId: saleCrmSoftwareId,
            predefinedFilters: { taskName: "View State" },
        })
    }

    if (leadPipelineProcessData) {
        leadPipelineProcessData.map((leadDetail) => {
            let leadIdentifier = leadDetail?.data?.leadIdentifier;
            leadDetails[leadIdentifier] = leadDetail?.data;
        })
    }


    if (dealProcessData) {
        dealStatusIdMap = new Map(dealProcessData.map(function (dealProcessObj) {
            const dealObj: any = dealProcessObj.data;
            return [dealObj.dealIdentifier, dealObj.dealStatus];
        }))
        for (let i = 0; i < dealProcessData.length; i++) {
            let eachDeal = dealProcessData[i]?.data || {}; // Ensure eachDeal is always an object
        
            let updatedDeal = { ...eachDeal }; // Avoid direct mutation
        
            // accountName
            if (eachDeal?.accountIdentifier) {
                updatedDeal.accountName = accountIdWiseAccountMap[eachDeal.accountIdentifier]?.accountName ?? "n/a";
            } else if (eachDeal.accountDetails) {
                updatedDeal.accountName = eachDeal.accountDetails?.accountName ?? "n/a";
            } else {
                updatedDeal.accountName = "n/a";
            }
        
            // clientName
            if (eachDeal.leadIdentifier && leadDetails[eachDeal.leadIdentifier]) {
                updatedDeal.clientName = leadDetails[eachDeal.leadIdentifier].organisationDetails?.organisationName ?? "n/a";
                updatedDeal.country = leadDetails[eachDeal.leadIdentifier].organisationDetails?.country ?? "n/a";
            } else if (eachDeal.dealStatus === "Won" && eachDeal.accountDetails) {
                updatedDeal.clientName = eachDeal.accountDetails?.accountName ?? "n/a";
            } else {
                updatedDeal.clientName = "n/a";
            }
        
            dealDetails.push(updatedDeal);
        }
    }

    return dealDetails;
}