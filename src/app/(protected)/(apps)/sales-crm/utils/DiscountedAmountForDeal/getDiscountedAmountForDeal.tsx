export const getDiscountedAmountForDeal = (discountPercent: number = 0, actualRevenue: number = 0): number => {
    return actualRevenue * (discountPercent / 100);
};
