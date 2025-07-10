export type EditDealType = {
    dealNo?: string;
    dealName: string;
    currency: string;
    expectedRevenue: string;
    isDebtRevenue?: boolean;
    dealIdentifier?: string;
    leadIdentifier?: string;
    expectedClosingDate?: string;
    updatedOn?: string;
    createdBy?: string;
    contactDetails?: Record<string, string>;
    dealStatus?: string;
  };
  