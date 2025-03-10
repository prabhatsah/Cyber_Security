
import { format } from "date-fns";

export const getFormattedAmountWithDecimal = (amount: string): string => {
    return amount ? parseFloat(amount).toFixed(2) : '0.00';
}

export const getFormattedAmount = (amount: string): string => {
    const formattedAmount = getFormattedAmountWithDecimal(amount);
    return formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const getDateFormat = (date: string): string => {
    return date ? format(new Date(date), 'dd-MMM-yyyy') : 'n/a';
}

export const getDateTimeFormat = (date: string): string => {
    return date ? format(new Date(date), 'dd-MMM-yyyy hh:mm a') : 'n/a';
}

export const getSpecifiedDateFormat = (date: string, dateFormat: string): string => {
    return date ? format(new Date(date), dateFormat) : 'n/a';
}