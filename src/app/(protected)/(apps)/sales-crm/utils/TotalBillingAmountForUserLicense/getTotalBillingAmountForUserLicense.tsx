import { differenceInMonths } from 'date-fns';

interface DateRange {
    sdate: string | Date;
    edate: string | Date;
}

export const getTotalBillingAmountForUserLicense = (costPerLicensePerMonth = 0, billingCycle = "", noOfLicense = 0, dateObject: DateRange | null = null) => {
    let noOfPeriods = 0;
    switch (billingCycle) {
        case "Monthly":
            noOfPeriods = 1;
            break;
        case "Yearly":
            noOfPeriods = 12;
            break;
        case "Quartely":
            noOfPeriods = 3;
            break;
        default:
            if (dateObject) {
                noOfPeriods = Math.ceil(
                    differenceInMonths(new Date(dateObject.edate), new Date(dateObject.sdate))
                );
            }
    }

    return noOfLicense * costPerLicensePerMonth * noOfPeriods;
};

