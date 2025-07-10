'use server'
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getDealDetails } from "./getDealsDetails";
import { format } from "date-fns";
import { SAVE_DATE_FORMAT } from "@/ikon/utils/config/const";
import { getClientNameFunc, getDealCountryFunc, getProjectDuration, getProjectManagerFunc } from "./commonFunction";


export default async function AllProjectData() {
    const predefinedFilters = { "taskName": "View State" };
    const allProjectData = await getMyInstancesV2({
        processName: "Project",
        predefinedFilters: predefinedFilters
    });
    const dealDetails = await getDealDetails();

    let projectDetails: any = [];
    for (let i = 0; i < allProjectData.length; i++) {
        projectDetails[i] = allProjectData[i].data;
        projectDetails[i]["name"] = (allProjectData[i].data as { projectName: string }).projectName;
        projectDetails[i]["getClientName"] = await getClientNameFunc(allProjectData[i].data.projectIdentifier,dealDetails);
        projectDetails[i]["country"] = getDealCountryFunc(allProjectData[i].data as { projectCountry: string }).projectCountry;
        projectDetails[i]["duration"] = getProjectDuration(allProjectData[i].data.contractedStartDate, allProjectData[i].data.contractedEndDate);
        projectDetails[i]["type"] = 'Project';
        projectDetails[i]["projectManager"] = await getProjectManagerFunc(allProjectData[i].data.projectManager);

        projectDetails[i]["minStartDate"] = allProjectData[i].data.contractedStartDate ? format(allProjectData[i].data.contractedStartDate, SAVE_DATE_FORMAT) : 'NA';
        projectDetails[i]["maxEndDate"] = allProjectData[i].data.contractedEndDate ? format(allProjectData[i].data.contractedEndDate, SAVE_DATE_FORMAT) : 'NA';
        projectDetails[i]["status"] = 'Won';
        projectDetails[i]["probability"] = '-';
        projectDetails[i]["getAccountManager"] = "-";
        projectDetails[i]["dealName"] = "-";
        projectDetails[i]["source"] = projectDetails[i].parentDealId ? "Change" : (projectDetails[i]["source"]=="Manual" ? "Manual":"Deal");

    }
    return projectDetails;

}
