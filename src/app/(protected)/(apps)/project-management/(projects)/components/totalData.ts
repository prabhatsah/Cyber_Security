import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import prospectDetails from "./getProspectData";
import { addMonths, addDays, subDays, getDaysInMonth, format, isBefore, isAfter, parseISO, isBefore as dfIsBefore } from 'date-fns';
import { VIEW_DATE_FORMAT } from "@/ikon/utils/config/const";

function calculateTaskEndDate(startDate, duration) {
    let taskStart = new Date(startDate);
    let taskDuration = parseFloat(duration);

    // Add whole months
    let endDate = addMonths(taskStart, Math.floor(taskDuration));

    // Get the number of days in the last month
    let daysInLastMonth = getDaysInMonth(endDate);

    // Adjust end date by fractional month days
    endDate = subDays(endDate, 1); // Move back one day to the previous month
    endDate = addDays(endDate, Math.round(daysInLastMonth * (taskDuration % 1)));

    // If the calculated end date is before the start date, return the start date
    if (isBefore(endDate, taskStart)) {
        return format(taskStart, 'yyyy-MM-dd');
    }

    return format(endDate, 'yyyy-MM-dd');
}


function getProjectStartEndDate(data:any) {
    if (data && data.task.length) {
        let endDateList = data.task.map(task => calculateTaskEndDate(task.taskStart, task.taskDuration));
        let endDate = endDateList[0];
        let startDate = data.task[0].taskStart;
        
        for (let i = 0; i < data.task.length; i++) {
            if (isAfter(parseISO(endDateList[i]), parseISO(endDate))) {
                endDate = endDateList[i];
            }
            if (dfIsBefore(parseISO(data.task[i].taskStart), parseISO(startDate))) {
                startDate = data.task[i].taskStart;
            }
        }

        return {
            startDate: format(parseISO(startDate), 'dd-MMM-yyyy'),
            endDate: format(parseISO(endDate), 'dd-MMM-yyyy')
        };
    }
}

async function getProductOfProjectDetails() {
    let productOfProjectDetails = {};

    const getProductOfProcessData = await getMyInstancesV2({
        processName: "Product of Project",
        predefinedFilters: { taskName: "View State" }
    })
    if (getProductOfProcessData.length > 0) {
        for (let i = 0; i < getProductOfProcessData.length; i++) {
            let scheduledData = getProductOfProcessData[i].data ? getProductOfProcessData[i].data : {};
            productOfProjectDetails[scheduledData.projectIdentifier] = scheduledData;
        }
    }
    return productOfProjectDetails;
}

export default async function TotalData() {
    let currentSuspendedProject = {};
    let totalData = await prospectDetails();
    for (let i = 0; i < totalData.length; i++) {
        if (totalData[i].type == "Project") {
            if (totalData[i]["projectStatus"]) {
                totalData[i]["updatedStatus"] = totalData[i]["projectStatus"];
            }
            else {
                totalData[i]["updatedStatus"] = "Ongoing";
            }

        }
        else {
            totalData[i]["updatedStatus"] = totalData[i]["productStatus"];
        }
    }
    let productOfProjectDetails = await getProductOfProjectDetails();
    for (let i = 0; i < totalData.length; i++) {
        if (totalData[i].type == "Project") {
            let data = productOfProjectDetails[totalData[i].projectIdentifier];
            if (data && data.scheduleData) {
                let dateObj = getProjectStartEndDate(data.scheduleData);
                totalData[i]["startDate"] = dateObj.startDate;
                totalData[i]["endDate"] = dateObj.endDate;
            }
            else {

                totalData[i]["startDate"] = totalData[i]["minStartDate"];
                totalData[i]["endDate"] = totalData[i]["maxEndDate"];
            }
        }
        else {
            totalData[i]["startDate"] = totalData[i]["minStartDate"];
            totalData[i]["endDate"] = totalData[i]["maxEndDate"];
        }

    }

    for (let i = 0; i < totalData.length; i++) {
        if (currentSuspendedProject[totalData[i]["projectIdentifier"]]) {
            if (totalData[i]["projectStatus"] != currentSuspendedProject[totalData[i]["projectIdentifier"]]) {
                totalData[i]["projectStatus"] = currentSuspendedProject[totalData[i]["projectIdentifier"]]
            }
        }
    }

    // for (let i = 0; i < totalData.length; i++) {
    //     let start = totalData[i].startDate;
    //     let end = totalData[i].endDate;
    //     let momentStart = '';
    //     let momentEnd = '';
    //     momentStart = start == "" || start == "n/a" ? null : format(start, VIEW_DATE_FORMAT);
    //     momentEnd = end == "" || start == "n/a" ? null : format(end, VIEW_DATE_FORMAT);
    //     console.log(momentStart+ " "+momentEnd);
    //     // totalData[i].startDate = momentStart;
    //     // totalData[i].endDate = momentEnd;
    // }

    return totalData;
}
