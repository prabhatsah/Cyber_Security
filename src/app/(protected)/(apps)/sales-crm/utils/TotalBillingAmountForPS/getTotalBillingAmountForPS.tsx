export const getTotalBillingAmountForPS = (scr = 0, expenses = 0, otherCosts = 0, totalFTE = 0) => {
    return (scr * totalFTE) + expenses + otherCosts;
};
