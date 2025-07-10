export const getFinalBillingAmountIncludingVATRate = (vatPercent: number = 0, amount: number = 0): number => {
    const vatTaxAmount = amount * (vatPercent / 100);
    return amount + vatTaxAmount;
};
