import { string } from "zod"

export interface Rfp{
    id : string,
    title : string,
    status : 'Approved' | 'Pending' | 'Rejected'
}

export interface RfpDraft {
  id: string;
  title: string;
  industry: string;
  budget: number | null;
  timeline: string | null;
  additionalInfo: string | null;
  stepTracker: {
    "Draft Creation": "COMPLETED" | "IN PROGRESS" | "PENDING";
    "Template Selection": "COMPLETED" | "IN PROGRESS" | "PENDING";
    Draft: "COMPLETED" | "IN PROGRESS" | "PENDING";
    Approval: "COMPLETED" | "IN PROGRESS" | "PENDING";
    Publish: "COMPLETED" | "IN PROGRESS" | "PENDING";
  };
}
export interface Sector{
    sectorId : string,
    sectorName : string

}

export interface Country{
    countryId : string,
    countryName : string
} 

export interface RfpData{
    id : string,
    rfpTitle : string,
    rfpDeadline : string,
    sector : string,
    country : string,
    resourceData : File
}

export interface RfpTemplate{
    templateId : string,
    templateName : string,
    templateCategory : string
}

export interface Items {
  name: string
  dropdown?: boolean
  color: string
  status: string
}

export interface RfpDraftActionBtns {
  btnText: string
  btnIcon: React.ReactNode
  btnID: string
  btnFn: () => any
}

