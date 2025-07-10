"use server"
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService";

import { addMonths, addDays, subDays, getDaysInMonth, format, parseISO } from 'date-fns';

export default async function getDealData({ dealIdentifier }: { dealIdentifier: string | string[] | undefined }) {
    const predefinedFilters = { "taskName": "View State" };
    if (dealIdentifier) {
        const dealDataDetails = await getMyInstancesV2({
            processName: "Deal", predefinedFilters: predefinedFilters, processVariableFilters: { "dealIdentifier": dealIdentifier }
        })
        return dealDataDetails[0]?.data;
    }
    return {};
}


export async function getLeadData({ dealIdentifier }: { dealIdentifier: string | string[] | undefined }) {
    let projections = ["Data.organisationDetails"];
    let predefinedFilters = { "taskName": "View State" };
    const dealData = await getDealData({ dealIdentifier: dealIdentifier })
    console.log(dealData.leadIdentifier);
    if (dealData.leadIdentifier) {
        const leadDataDetails = await getMyInstancesV2({
            processName: "Leads Pipeline",
            predefinedFilters: predefinedFilters,
            processVariableFilters: { "leadIdentifier": dealData?.leadIdentifier },
            projections: projections,
        })
        return leadDataDetails;
    }
    return undefined;
}

export async function SubscribedSoftwareNameMaps() {
    const accountId = await getActiveAccountId();
    return getAllSubscribedSoftwaresForClient({ accountId }) || []; // Ensure it's always an array
}

export async function getChannelPartnerData(salesCrmInfo: any) {

    const partnerInfo = await getMyInstancesV2({
        processName: "Account",
        softwareId: salesCrmInfo[0]?.SOFTWARE_ID,
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.isChannelPartner==true`,
        projections: ["Data.accountIdentifier", "Data.accountName"]
    })
    return partnerInfo;
}

export async function getExistingAccountTypeAccountName(salesCrmInfo: any) {

    const existingAccountTypeAccountName = await getMyInstancesV2({
        processName: "Account",
        softwareId: salesCrmInfo[0]?.SOFTWARE_ID,
        predefinedFilters: { taskName: "View State" },
    })
    return existingAccountTypeAccountName;
}

export async function getParentProjectNumber(projectManagementInfo: any) {

    const getProjectInfo = await getMyInstancesV2({
        processName: "Project",
        softwareId: projectManagementInfo[0]?.SOFTWARE_ID,
        predefinedFilters: { taskName: "View State" }
    })

    return getProjectInfo;
}

export async function getProductProcessData(dealIdentifier: string) {
    const productDetails = await getMyInstancesV2({
        processName: "Product", predefinedFilters: { taskName: "View State" }, processVariableFilters: { "dealIdentifier": dealIdentifier }
    })
    return productDetails;
}

export async function calculateTaskEndDate(startDate, duration) {
    let taskStart = parseISO(startDate);
    let taskDuration = parseFloat(duration);

    // Add whole months
    let endDate = addMonths(taskStart, Math.floor(taskDuration));

    // Get days in last month
    let daysInLastMonth = getDaysInMonth(endDate);

    // Adjust end date by fractional month days
    endDate = addDays(endDate, Math.round(daysInLastMonth * (taskDuration % 1)) - 1);

    // Ensure the end date is not before the start date
    if (endDate < taskStart) return format(taskStart, 'yyyy-MM-dd');

    return format(endDate, 'yyyy-MM-dd');
}


export async function buildScheduleSummaryData(dealData: any) {

    const sortStartDates = (allStartDates: string[]): string[] => {
        return allStartDates.sort((a, b) => {
            const date1 = new Date(a).getTime();
            const date2 = new Date(b).getTime();
            return date1 - date2;
        });
    };

    const sortEndDates = (allEndDates: string[]): string[] => {
        return allEndDates.sort((a, b) => {
            const date1 = new Date(a).getTime();
            const date2 = new Date(b).getTime();
            return date2 - date1;
        });
    };

    const productIdentifierWiseDataObj = await getProductProcessData(dealData?.dealIdentifier);


    const productIdentifierWiseData = productIdentifierWiseDataObj[0]?.data;

    let allStartDates = [];
    let allEndDates = [];

    if (productIdentifierWiseData?.productType == "Professional Service") {
        for (let i = 0; i < productIdentifierWiseData?.scheduleData.task.length; i++) {
            var startDate = productIdentifierWiseData?.scheduleData.task[i].taskStart;
            var duration = productIdentifierWiseData?.scheduleData.task[i].taskDuration;
            var endDate = await calculateTaskEndDate(startDate, duration);
            allStartDates.push(format(startDate, 'yyyy-MM-dd'));
            allEndDates.push(format(endDate, 'yyyy-MM-dd'));
        }
    }

    const sortedStartDates = sortStartDates(allStartDates);
    const sortedEndDates = sortEndDates(allEndDates);

    const minStartDate = sortedStartDates.length > 0 ? sortedStartDates[0] : null;
    const maxEndDate = sortedEndDates.length > 0 ? sortedEndDates[0] : null;

    return { startDate: minStartDate, endDate: maxEndDate };
    // return productIdentifierWiseData
}

