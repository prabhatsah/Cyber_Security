import { addMonths, differenceInDays, differenceInMonths, format, parseISO, subMonths } from "date-fns";

export const calculateTaskEndDate = (
    startDate: string,
    duration: number
): string => {
    console.log("startDate:", startDate);
    console.log("duration:", duration);
    const taskStart = parseISO(startDate);
    const wholeMonths = Math.floor(duration);
    const fractionalDays = Math.round((duration % 1) * 30); // Ensure whole number of days

    let taskEnd = addMonths(taskStart, wholeMonths);
    console.log("taskEnd after adding months:", taskEnd);

    taskEnd.setDate(taskEnd.getDate() + fractionalDays); // Directly modify taskEnd
    console.log("taskEnd after adding days:", taskEnd);

    return format(taskEnd, "yyyy-MM-dd");
};

export const calculateTaskStartDate = (
    endDate: string,
    duration: number
): string => {
    const taskEnd = parseISO(endDate);
    const wholeMonths = Math.floor(duration);
    const fractionalMonths = duration % 1;

    let taskStart = subMonths(taskEnd, wholeMonths);
    taskStart = new Date(
        taskStart.setDate(taskStart.getDate() - fractionalMonths * 30)
    );

    return format(taskStart, "yyyy-MM-dd");
};

export const calculateTaskDuration = (
    startDate: string,
    endDate: string
): number => {
    if (startDate === endDate) return 0;

    let taskStart = parseISO(startDate);
    let taskEnd = parseISO(endDate);
    let duration = 0;

    if (
        taskStart.getMonth() === taskEnd.getMonth() &&
        taskStart.getFullYear() === taskEnd.getFullYear()
    ) {
        duration =
            (differenceInDays(taskEnd, taskStart) + 1) /
            new Date(taskEnd.getFullYear(), taskEnd.getMonth() + 1, 0).getDate();
    } else if (taskStart < taskEnd) {
        duration =
            differenceInMonths(taskEnd, taskStart) +
            (differenceInDays(taskEnd, taskStart) % 30) / 30;
    }

    duration = parseFloat(duration.toFixed(2));

    let providedEndDate = parseISO(endDate);
    let calculatedEndDate = parseISO(calculateTaskEndDate(startDate, duration));

    while (
        providedEndDate.toISOString().split("T")[0] !==
        calculatedEndDate.toISOString().split("T")[0]
    ) {
        if (providedEndDate < calculatedEndDate) {
            duration -= 0.01;
        } else {
            duration += 0.01;
        }
        calculatedEndDate = parseISO(calculateTaskEndDate(startDate, duration));
    }

    return parseFloat(duration.toFixed(2));
};