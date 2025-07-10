export const getRevisedAmountForDeal = (discountPercent: number = 0, actualRevenue: number = 0): number => {
    const discountedAmount = actualRevenue * (discountPercent / 100);
    return actualRevenue - discountedAmount;
};
