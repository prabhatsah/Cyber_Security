import { addMonths, addDays, subDays, getDaysInMonth, format, parseISO, parse, differenceInMonths } from 'date-fns';

export function calculateTaskEndDate(startDate: string | Date, duration: number | string): string {
    // Convert startDate to a Date object if it's a string
    const taskStart: Date = typeof startDate === 'string' ? parseISO(startDate) : startDate;

    // Convert duration to a number if it's a string
    const taskDuration: number = typeof duration === 'string' ? parseFloat(duration) : duration;

    // Add the integer part of the duration as months
    let endDate: Date = addMonths(taskStart, Math.trunc(taskDuration));

    // Get the number of days in the month of the calculated end date
    const daysInLastMonth: number = getDaysInMonth(endDate);

    // Subtract one day from the end date
    endDate = subDays(endDate, 1);

    // Calculate the fractional part and add the corresponding days
    const fractionalPart: number = taskDuration % 1;
    endDate = addDays(endDate, daysInLastMonth * fractionalPart);

    if (endDate < taskStart) {
        return format(taskStart, 'yyyy-MM-dd');
    }

    return format(endDate, 'yyyy-MM-dd');
}

export function getDateArray({ productData }: any) {

    const tasks: { [key: string]: any } = productData.scheduleData
        ? productData.scheduleData.task
        : {};

    let startArr: string[] = [];
    let endArr: string[] = [];
    let dateMap: { [dateStr: string]: number } = {};

    // Build arrays of start and end month strings ("YYYY-MM")
    for (const key in tasks) {
        if (tasks.hasOwnProperty(key)) {
            const task = tasks[key];
            // Extract "YYYY-MM" from taskStart string
            const taskStartStr: string = task.taskStart;
            const startMonth: string = taskStartStr.substring(0, taskStartStr.length - 3);
            startArr.push(startMonth);

            // Calculate the task end date and extract "YYYY-MM"
            const endDate: string = calculateTaskEndDate(task.taskStart, task.taskDuration);
            const endMonth: string = endDate.substring(0, endDate.length - 3);
            endArr.push(endMonth);
        }
    }

    // Remove duplicates and sort the arrays
    startArr = Array.from(new Set(startArr)).sort();
    endArr = Array.from(new Set(endArr)).sort();

    // Merge both arrays, remove duplicates and sort to get a complete list of baseline months
    let dateArr: string[] = Array.from(
        new Set([...startArr, ...endArr])
    ).sort();

    // Build a mapping of date strings to sequential numbers (if needed for other purposes)
    dateArr.forEach((dateStr, index) => {
        dateMap[dateStr] = index + 1;
    });

    // Instead of using dateMap for parsing, directly parse the month strings
    const lastStartMonth: string = startArr[startArr.length - 1];
    const lastEndMonth: string = endArr[endArr.length - 1];

    // // Parse the "YYYY-MM" strings into Date objects using date-fns.
    const date1: Date = parse(lastStartMonth, 'yyyy-MM', new Date());
    const date2: Date = parse(lastEndMonth, 'yyyy-MM', new Date());

    // Compute the difference in months between the two dates
    const durationInMonths: number = differenceInMonths(date2, date1);

    return { dateArr, dateMap, startArr, endArr, durationInMonths,date1,date2};
}




export default function BaseLineForCastChart({ forecastedProductData, baselineProductData }: { forecastedProductData: any, baselineProductData: any }) {

    const baselineInfo = getDateArray({ productData: baselineProductData });
    const forcasteInfo = getDateArray({ productData: forecastedProductData });
    let dateNumberArr = [...baselineInfo.dateArr, ...forcasteInfo.dateArr];
    dateNumberArr = Array.from(new Set(dateNumberArr)).sort();

    let baselineDateMap = baselineInfo.dateMap;
    let baselineStartArr = baselineInfo.startArr;
    let baselineEndArr = baselineInfo.endArr;
    let bDurationInMonths = baselineInfo.durationInMonths;

    let forecastDateMap = forcasteInfo.dateMap;
    let forecastStartArr = forcasteInfo.startArr;
    let forecastEndArr = forcasteInfo.endArr;
    let fDurationInMonths = forcasteInfo.durationInMonths;


    let chartData = [
        {
            category: "Baseline",
            start: baselineDateMap[baselineStartArr[0]] - .1,
            end: baselineDateMap[baselineEndArr[baselineEndArr.length - 1]] + .1,
            duration: bDurationInMonths,
            tooltipText: "",
        }, {
            category: "Forecast",
            start: forecastDateMap[forecastStartArr[0]] - .1,
            end: forecastDateMap[forecastEndArr[forecastEndArr.length - 1]] + .1,
            duration: fDurationInMonths,
            tooltipText: "",
        }
    ];




    return {chartData,dateNumberArr};
}


