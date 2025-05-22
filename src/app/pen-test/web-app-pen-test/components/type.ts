export interface BasicDetails {
  pentestId: string;
  target: string;
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

export interface ActiveReconnaissance {
  amassData: Array<string>;
}

export interface Reconnaissance {
  activeReconnaissance: ActiveReconnaissance;
  passiveReconnaissance?: Array<string> | Record<string, any> | null;
}

export interface ZapAlertInstance {
  id: string;
  uri: string;
  method: string;
  param: string;
  attack: string;
  evidence: string;
}

export interface ZapAlert {
  pluginid: string;
  alert: string;
  alertRef: string;
  riskcode: string;
  confidence: string;
  count: string;
  cweid: string;
  wascid: string;
  desc: string;
  solution: string;
  reference: string;
  instances: ZapAlertInstance[];
}

export interface ZapData {
  "@name": string;
  "@host": string;
  "@port": string;
  "@ssl": string;
  alerts: ZapAlert[];
}

export interface PenTestModified {
  userId: string;
  pentestId: string;
  pentestType: string;
  basicDetails: BasicDetails;
  scanData: {
    amass?: string;
    whatweb?: string;
    nmap?: string;
    theHarvester?: string;
    zap?: ZapData;
  };
  lastUpdated: string;
}

export interface PenTestDefault {
  id: number;
  userid: string;
  pentestid: string;
  type: string;
  data: {
    basicDetails: BasicDetails;
    scandata?: {
      amass?: string;
      whatweb?: string;
      nmap?: string;
      theHarvester?: string;
    };
  };
  lastscanon: string;
}

// export interface PenTestModified {
//   userId: string;
//   pentestId: string;
//   pentestType: string;
//   basicDetails: BasicDetails;
//   reconnaissance: Reconnaissance | null;
//   vulnerabilityScanning: Record<string, any> | null;
//   exploitation: Record<string, any> | null;
//   postExploitation: Record<string, any> | null;
//   aiAnalysis: Record<string, any> | null;
//   lastUpdated: string;
// }

// export interface PenTestDefault {
//   id: number;
//   userid: string;
//   pentestid: string;
//   pentest_type: string;
//   basic_details: BasicDetails;
//   reconnaissance: Reconnaissance | null;
//   vulnerability_scanning: Record<string, any> | null;
//   exploitation: Record<string, any> | null;
//   post_exploitation: Record<string, any> | null;
//   ai_analysis: Record<string, any> | null;
//   last_updated: string;
// }
