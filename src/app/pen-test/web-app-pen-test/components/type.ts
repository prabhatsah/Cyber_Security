export interface BasicDetails {
  pentestId: string;
  webApp: string;
  pentestName: string;
  pentestDescription: string;
  scope: string;
  testingType: string;
  startDate: string;
  endDate: string;
  timeZone: string;
  priorityLevel: string;
  securityLevel?: string | null;
  createdOn: string;
  createdBy: {
    userId: string;
    userName: string;
  };
}

export interface PenTestModified {
  userId: string;
  pentestId: string;
  pentestType: string;
  basicDetails: BasicDetails;
  reconnaissance: Record<string, any> | null;
  vulnerabilityScanning: Record<string, any> | null;
  exploitation: Record<string, any> | null;
  postExploitation: Record<string, any> | null;
  aiAnalysis: Record<string, any> | null;
  lastUpdated: string;
}

export interface PenTestDefault {
  id: number;
  userid: string;
  pentestid: string;
  pentest_type: string;
  basic_details: BasicDetails;
  reconnaissance: Record<string, any> | null;
  vulnerability_scanning: Record<string, any> | null;
  exploitation: Record<string, any> | null;
  post_exploitation: Record<string, any> | null;
  ai_analysis: Record<string, any> | null;
  last_updated: string;
}
