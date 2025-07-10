import { SAVE_DATE_FORMAT, VIEW_DATE_FORMAT } from "@/ikon/utils/config/const";
import productDetails from "./productDetails";

import { addMonths, addDays, subDays, differenceInDays, format, lastDayOfMonth } from "date-fns";
import { getClientNameFunc, getDealCountryFunc, getDealStatus_prospectFunc, getProjectDuration, getProjectManagerFunc, SubscribedAppData, voType_prospectFunc } from "./commonFunction";
import { getDealDetails } from "./getDealsDetails";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import AllProjectData from "./allProjectData";

function calculateTaskEndDate(startDate: string | Date, duration: number): string {
    let taskStart = new Date(startDate);
    let taskDuration = parseFloat(duration.toString());

    // Add whole months to the start date
    let endDate = addMonths(taskStart, Math.floor(taskDuration));

    // Get the number of days in the last month
    let daysInLastMonth = differenceInDays(lastDayOfMonth(endDate), new Date(endDate.getFullYear(), endDate.getMonth(), 1)) + 1;

    // Move endDate back by 1 day to match the original logic
    endDate = subDays(endDate, 1);

    // Add the remaining fraction of the month in days
    endDate = addDays(endDate, Math.round(daysInLastMonth * (taskDuration % 1)));

    // Ensure the end date is not earlier than the start date
    if (endDate < taskStart) {
        return format(taskStart, "yyyy-MM-dd");
    }

    return format(endDate, "yyyy-MM-dd");
}

export default async function prospectDetails() {
    let prospectData = [];
    let dealProcessData = null;
    let dealStatusIdMap = null;
    let allProductDetail = (await productDetails()) || []; // Default to an empty array
    const dealDetails = await getDealDetails();
    const getSubscribedAppData = await SubscribedAppData();
    const saleCrmDetails = getSubscribedAppData.filter((saleCrmDetail: Record<string, string>) => (saleCrmDetail.SOFTWARE_NAME === 'Sales CRM'))
    if (saleCrmDetails.length > 0) {
        const saleCrmSoftwareId = saleCrmDetails[0].SOFTWARE_ID;
        dealProcessData = await getMyInstancesV2({
            processName: "Deal",
            softwareId: saleCrmSoftwareId,
            predefinedFilters: { taskName: "View State" },
        })
        if(dealProcessData){
            dealStatusIdMap = new Map(dealProcessData.map(function (dealProcessObj) {
                const dealObj: any = dealProcessObj.data;
                return [dealObj.dealIdentifier, dealObj.dealStatus];
            }))
        }
    }

    let dealIdDetailsMap: any = {};

    allProductDetail.map((productDetail) => {
        let dealIdentifier = productDetail?.data?.dealIdentifier;
        dealIdDetailsMap[dealIdentifier] = productDetail;
    })

    for (let i = 0; i < allProductDetail.length; i++) {
        prospectData.push(allProductDetail[i].data);
    }

    for (var x in prospectData) {
        var allStartDate = [];
        var allEndDate = [];
        const dealId = prospectData[x].dealIdentifier;

        if (prospectData[x].scheduleData) {
            for (var y in prospectData[x].scheduleData.task) {

                var startD = prospectData[x].scheduleData.task[y].taskStart;
                var dur = prospectData[x].scheduleData.task[y].taskDuration;
                var endD = calculateTaskEndDate(startD, dur);
                allStartDate.push(format(startD, SAVE_DATE_FORMAT))
                allEndDate.push(format(endD, SAVE_DATE_FORMAT));
            }
            var SortStartDate = allStartDate.sort(function (a, b) {
                const date1 = new Date(a)
                const date2 = new Date(b)
                return date1 - date2;
            });

            var SortEndDate = allEndDate.sort(function (a, b) {
                const date1 = new Date(a)
                const date2 = new Date(b)
                return date2 - date1;
            });

            prospectData[x]["minStartDate"] = SortStartDate[0] ? format(SortStartDate[0], VIEW_DATE_FORMAT) : 'n/a';
            prospectData[x]["maxEndDate"] = SortEndDate[0] ? format(SortEndDate[0], VIEW_DATE_FORMAT) : 'n/a';
            prospectData[x]["duration"] = getProjectDuration(prospectData[x]["minStartDate"], prospectData[x]["maxEndDate"]);

        }
        else {
            prospectData[x]["minStartDate"] = 'n/a';
            prospectData[x]["maxEndDate"] = 'n/a';
            prospectData[x]["duration"] = "n/a";
        }

        prospectData[x]["name"] = dealIdDetailsMap[prospectData[x].dealIdentifier] ? dealIdDetailsMap[prospectData[x].dealIdentifier].dealName : prospectData[x].dealName;
        prospectData[x]["dealName"] = dealIdDetailsMap[prospectData[x].dealIdentifier] ? dealIdDetailsMap[prospectData[x].dealIdentifier].dealName : prospectData[x].dealName;
        prospectData[x]["type"] = 'Prospect';
        prospectData[x]["country"] = getDealCountryFunc(prospectData[x].country);
        prospectData[x]["getClientName"] = await getClientNameFunc(dealId, dealDetails);
        prospectData[x]["probability"] = getDealStatus_prospectFunc(dealId, dealDetails);
        prospectData[x]["voType"] = voType_prospectFunc(dealId, dealDetails);
        prospectData[x]["projectManager"] = await getProjectManagerFunc(prospectData[x].projectManager);

        prospectData[x]["status"] = dealStatusIdMap?.get(dealId);
        // prospectData[x]["projectName"] = dealDetails?.dealStatus;
    }


    let projectDetails = await AllProjectData();

    let tempProspectList = [];
    for(let i=0; i<prospectData.length; i++){
        let isProject = false;
        for(let j =0; j<projectDetails.length; j++){
            if(prospectData[i].dealIdentifier == projectDetails[j].projectIdentifier && projectDetails[j].type == "Project"){
                isProject = true;
                break;
            }
        }
        if(!isProject){
            tempProspectList.push(prospectData[i]);
        }
    }

    return [... projectDetails, ...tempProspectList];

}
