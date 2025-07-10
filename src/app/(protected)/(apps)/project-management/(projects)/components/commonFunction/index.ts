import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService";

export async function SubscribedAppData() {
    const accountId = await getActiveAccountId();
    const subscribedApps = await getAllSubscribedSoftwaresForClient({ accountId })
    return subscribedApps;
}

export async function getUserDetailsMap() {
    const userDetailsMap = await getUserIdWiseUserDetailsMap();
    return userDetailsMap;
}

export async function getClientNameFunc(dealIdentifier: any, dealDetails: any) {
    if (dealIdentifier) {
        for (let i = 0; i < dealDetails.length; i++) {
            if (dealDetails[i].dealIdentifier == dealIdentifier) {
                if (dealDetails[i].clientName == "n/a")
                    return dealDetails[i].accountName ? dealDetails[i].accountName : "n/a";
                else
                    return dealDetails[i].clientName;
            }
        }
    }
    return "n/a";
}

export function getDealCountryFunc(country: any) {
    if (country && country != "-1" && country != "") {
        return (country)
    }
    else {
        return "n/a";
    }
}


export function getProjectDuration(startDateParams: Date | string, endDateParams: Date | string): string {
    const startDate = new Date(startDateParams);
    const endDate = new Date(endDateParams);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "n/a"; // Return "n/a" if dates are invalid
    }

    // Calculate the number of months between dates
    let numberOfMonths = endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear()));

    // Function to count working days in a given range
    const countWorkingDays = (from: Date, to: Date): number => {
        let count = 0;
        const current = new Date(from);

        while (current <= to) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // Exclude weekends
            current.setDate(current.getDate() + 1);
        }
        return count;
    };

    // Function to count working days in an entire month
    const countWorkingDaysInMonth = (date: Date): number => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return countWorkingDays(firstDay, lastDay);
    };

    // Case when start and end dates are in the same month
    if (startDate.getFullYear() === endDate.getFullYear() && startDate.getMonth() === endDate.getMonth()) {
        const workingDaysInMonth = countWorkingDaysInMonth(startDate);
        const workingDaysBetweenDates = countWorkingDays(startDate, endDate);
        return parseFloat((workingDaysBetweenDates / workingDaysInMonth).toFixed(2)).toString();
    }

    // Calculate working days for the start month
    const lastDayOfStartMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    const startMonthWorkingDays = countWorkingDays(startDate, lastDayOfStartMonth);
    const totalStartMonthWorkingDays = countWorkingDaysInMonth(startDate);
    const startMonthFraction = startMonthWorkingDays / totalStartMonthWorkingDays;

    // Calculate working days for the end month
    const firstDayOfEndMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    const endMonthWorkingDays = countWorkingDays(firstDayOfEndMonth, endDate);
    const totalEndMonthWorkingDays = countWorkingDaysInMonth(endDate);
    const endMonthFraction = endMonthWorkingDays / totalEndMonthWorkingDays;

    // Calculate final duration
    return parseFloat((startMonthFraction + endMonthFraction + numberOfMonths - 1).toFixed(2)).toString();
}

export async function getProjectManagerFunc(id: string) {
    const userIdUserDetailsMap = await getUserDetailsMap();
    var managerName = userIdUserDetailsMap[id] ? (userIdUserDetailsMap[id].userName ? userIdUserDetailsMap[id].userName : ("n/a")) : ("n/a");
    return (managerName);

}

export function voType_prospectFunc(dealIdentifier: any, dealDetails: any) {
    for (let i = 0; i < dealDetails.length; i++) {
        if (dealDetails[i].dealIdentifier == dealIdentifier) {
            if (dealDetails[i].parentDealId) {
                if (dealDetails[i].voType && dealDetails[i].voType == "internal") {
                    return dealDetails[i].voType
                }
                else {
                    return "external"
                }
            }
            else {
                return "NA"
            }
        }

    }
}

export function getDealProbability (dealStatus:any){
    if((dealStatus == "Deal Created") || (dealStatus == "Recall Product from Quotation") || (dealStatus == "BAFO") || (dealStatus == "Recall from Lost to Product")){
        return("20%");
    }
    else if((dealStatus == "Product Submitted for Quotation") || (dealStatus == "Recall Quotation from Sales Review")){
        return("40%")
    }
    else if((dealStatus == "Sales Review from Quotation") || (dealStatus == "Recall From Client Review to Sales Review")){
        return("60%")
    }
    else if((dealStatus == "Submit Quotation for Client Review")){
        return("80%")
    }
    else if((dealStatus == "Won")){
        return("100%")
    }
    else if((dealStatus == "Lost")){
        return("0%")
    }
}

export function getDealStatus_prospectFunc(dealIdentifier: any, dealDetails: any) {
    let dealProbability="";
    for (let i = 0; i < dealDetails.length; i++) {
        if (dealDetails[i].dealIdentifier == dealIdentifier) {
            let activeStatus = dealDetails[i].activeStatus;
            if (activeStatus && (activeStatus == "Suspended" || activeStatus == "Deal Lost")) {
                dealProbability = "0%"
            }
            else {
                let dealStatus = dealDetails[i].dealStatus;
                dealProbability = getDealProbability(dealStatus);
            }

            return (dealProbability);
        }
    }
}