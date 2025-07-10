import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService";
import { getDealDetails } from "./getDealsDetails";

async function SubscribedAppData() {
    const accountId = await getActiveAccountId();
    const subscribedApps = await getAllSubscribedSoftwaresForClient({ accountId })
    return subscribedApps;
}

export default async function productDetails() {
    let productDetails = [];
    const getSubscribedAppData = await SubscribedAppData();
    const dealsDetails = await getDealDetails()
    const saleCrmDetails = getSubscribedAppData.filter((saleCrmDetail: Record<string, string>) => (saleCrmDetail.SOFTWARE_NAME === 'Sales CRM'))
    let predefinedFilters = { "taskName": "View State" };
    let mongoWhereClause: string|null = `(this.Data.dealStatus != "Won" && this.Data.dealStatus != "Lost" && this.Data.activeStatus == undefined) || (this.Data.dealStatus != "Won" && this.Data.dealStatus != "Lost" && this.Data.activeStatus != undefined && this.Data.activeStatus != "Deal Lost" && this.Data.activeStatus != "Suspended")`;
    if (saleCrmDetails) {
        const saleCrmSoftwareId = saleCrmDetails[0].SOFTWARE_ID;
        const dealProcessData = await getMyInstancesV2({
            processName: "Deal",
            softwareId: saleCrmSoftwareId,
            predefinedFilters: predefinedFilters,
            mongoWhereClause: mongoWhereClause,
            projections: ['Data.dealIdentifier']
        })
        let processVariableFilter = { productType: "Professional Service" };
        mongoWhereClause = '(';
        let totalCount = dealProcessData.length;
        let count = 0;
        for (let i = 0; i < dealProcessData.length; i++) {
            count++;
            if (count == totalCount) {
                mongoWhereClause += 'this.Data.dealIdentifier  == "' + dealProcessData[i].data.dealIdentifier + '" )';
            } else {
                mongoWhereClause += 'this.Data.dealIdentifier  == "' + dealProcessData[i].data.dealIdentifier + '" ||';
            }
        }
        if (dealProcessData.length == 0) {
            mongoWhereClause = null
        }
        const productProcessDetails = await getMyInstancesV2({
            processName: "Product",
            softwareId: saleCrmSoftwareId,
            predefinedFilters: {taskName: "View State"},
            processVariableFilters: processVariableFilter,
            mongoWhereClause: mongoWhereClause
        })
        productDetails = productProcessDetails;

        for(var i = 0; i < productDetails.length; i++){
            var projectIdentifier = productDetails[i].data.dealIdentifier ? productDetails[i].data.dealIdentifier : productDetails[i].data.leadIdentifier;


            var thisDealData = dealsDetails.find( dealDetails=> dealDetails.dealIdentifier == projectIdentifier);
            // accountName
            productDetails[i].data.accountName = thisDealData && thisDealData.accountName ? thisDealData.accountName : "n/a";
            productDetails[i].data.clientName = thisDealData && thisDealData.clientName ? thisDealData.clientName : "n/a";
            productDetails[i].data.country = thisDealData && thisDealData.country ? thisDealData.country : "n/a";
        }
        return productDetails;
    }
    
}
