export const getFormattedAmountByUserPreference = (amount: number | string, decimalPlaces: number = 0): string => {
    if (amount === "-" || amount === "" || amount === null || amount === undefined) return "0";
    
    let num = parseFloat(amount as string);
    if (isNaN(num)) return amount.toString();

    num = parseFloat(num.toFixed(decimalPlaces));
    const formatted = new Intl.NumberFormat("en-US").format(num);

    return num < 0 ? `(${formatted})` : formatted;
};