
export interface UserMap {
  [userId: string]: {
    userLogin: string;        // User's login email
    groupNames: string[];     // Array of group names
    userActive: boolean;      // User's active status
    userInvited: number;      // Number of invitations sent
    userPhone: string;        // User's phone number
    groupIds: string[];       // Array of group IDs
    userEmail: string;        // User's email
    userName: string;         // User's name
    userId: string;           // Unique identifier for the user
  };
}
interface UserDetails {
  userLogin: string;
  groupNames: string[];
  userActive: boolean;
  userInvited: number;
  userPhone: string;
  groupIds: string[];
  userEmail: string;
  userName: string;
  userId: string;
}
// export interface InvoiceData {
//   invoiceNumber: string;
//   defaultContact: string;
//   dealIdentifier: string;
//   revenue: number;
//   updatedOn: string;
// }

//  export interface InvoiceData {
//     AEDNumber?: string;
//     accountDetails?: string;
//     accountId?: string;
//     accountManagerEmail?: string;
//     dealIdentifier: string;
//     defaultContact: string;
//     invoiceDate: string;
//     invoiceIdentifier: string;
//     invoiceNumber?: string;
//     invoiceStatus: string;
//     mailCc?: string;
//     mailTo?: string;
//     pdfName?: string;
//     productInitials?: string;
//     remarks?: string;
//     remarksForLostInv?: string;
//     revenue?: string;
//     subject?: string;
//     type?: string;
//   }
export interface InvoiceData {
  dealIdentifier: string;
  defaultContact?: string;
  invoiceDate: string;
  invoiceIdentifier: string;
  invoiceStatus: string;
  revenue?: string;
  invoiceNumber: string;
  accountName: string;
  accountId?: string;
  accountManager: string | null;
  accountManagerEmail?: string | null;
  client?: string;
  deal: string;
  invoicedAmounts: string;
  invoiceDates: string | null;
  receiptDates: string | null;
  invoiceStatus01?: string;
  productsType?: string[];
  contactForDeal?: any;
  PaymentTerm?: string;
  productInitials: string;
  tobeInvoiced?: boolean;
}

export interface DealProductDetailsData{
  productIdentifier: string;
  productType: string;
  productDescription: string;
  projectManager: string;
  quotation: any;
  quotationAmount: number;
  actualRevenue: number;
}
export interface PricingTableData{
  id: string;
  role?: string;

    totalFTE?: number;

    scr?: number;

    expenses?: number;

    otherCosts?: number;

    billingAmount?: number;

    [key: string]: any; // Add this line

}

export interface NoteData {
  id: string
  userId?: string
  timestamp?: string
  source?: string
  parentId?: string
  note?: string
}

export interface ContactData {
  firstName: string
  middleName?: string
  lastName?: string
  email?: string
  phoneNo?: string
  mobileNo?: string
  department?: string
  fax?: string
  address1?: string
  city?: string
  state?: string
  pinCode?: string
  country?: string | null
  leadIdentifier?: string
  contactIdentifier: string
  productIdentifier?: string
  accountIdentifier?: string
  currentUserLogin: string
  source: string
  isDefault: boolean
}

export interface Items {
  name: string
  dropdown?: boolean
  color: string
  status: string
}


export interface WorkflowActionBtns {
  btnText: string
  btnIcon: React.ReactNode
  btnID: string
  btnFn: () => any
}

export interface ActivityLog {
  id: string
  activity: string
  updatedBy: string
  updatedOn: string
  source: string
  parentId: string
}
export interface POIData {
  remarks: string
  updatedOn: string
  updatedBy: string
}
export interface ProductDetailsData {
  productType: string
  productDescription?: string
  
}

export interface LeadData {
  organisationDetails: {
    organisationName: string
    email: string
    orgContactNo: string
    noOfEmployees?: number | string
    sector: string
    source: string
    website: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    landmark: string
  }
  teamInformation: {
    salesManager: string
    salesteam: string[]
  }
  leadIdentifier: string
  leadStatus: string
  updatedOn: string
  salesManager: string,
  dealDetails?: {
    dealIdentifier: string
    dealNo: string
    dealName: string
    expectedRevenue: number
    currency: string
    dealStatus: string
    productDetails: {
      [key: string]: {
        productIdentifier: string
        productType: string
        productDescription: string
        projectManager: string
      }
    }
    updatedOn: string
    isDebtRevenue: boolean
    dealStartDate: string
    createdBy?: string
    leadIdentifier: string,
    
    contactDetails?: object
  }
  activeStatus?: string
  commentsLog?: object[]
}

export interface AccountData {
  accountName: string;
  accountManager: string;
  isChannelPartner: any;
  wasFromChannelPartner: string;
  channelPartnerAccount?: string;
  createdOn: string;
  updatedOn: string;
}


export interface DealData {
  dealIdentifier: string;
  dealNo?: string;
  dealName?: string;
  expectedRevenue?: number;
  currency?: string;
  dealStatus?: string;
  productDetails: {
    [key: string]: {
      description: string;
      productIdentifier: string
      productType: string
      productDescription: string
      projectManager: string
      discountPercent?: number;
    }
  }
  checkedproductIdentifierList?: string[];
  updatedOn?: string;
  accountDetails?: {
    accountIdentifier: string;
    isChannelPartner?: boolean;
    wasFromChannelPartner?: boolean;
    accountType?: string;
    accountName?: string;
    accountManager?: string;
    accountCode?: string;
    taxinfo?: string;
    address?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
    phone?: string;
    email?: string;
  };
  isDebtRevenue?: boolean;
  copyDealCheck?: boolean;
  olddealIdentifier?: string;
  dealStartDate?: string;
  createdBy?: string;
  vatPercent?: number;
  discountPercent?: number;
  fxRateForDeal?: Record<string, {
    id: string;
    currency: string;
    fxRate: number;
    year: string;
  }>;
  contractNumber?: string;
  dealWonDate?: string;
  formattedActualRevenueIncludingVAT_contracted?: string;
  contractedStartDate?: string;
  contractedEndDate?: string;
  projectName?: string;
  startDate?: string;
  parentProjectNo?: string;
  projectManager?: string;
  issueLinked?: boolean;
  dealTeam?: any[];
  projectManagerDelegates?: string;
  projectTeamUnderProjectManager?: any[];
  projectTeamUnderProjectManagerDelegates?: any[];
  activeStatus?: string;
  remarkForDealLostOrSuspended?: string;
  inActiveStatusDate?: string;
  accountName?: string;
  clientName?: string;
  dealProductTypeArray?: string[];
  source?: string;
  dealClosingDate?: string;
  shortProductName?: string;
  leadIdentifier?: string;
}
