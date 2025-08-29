export interface NetworkDetails {
  pentestId: string;
  clientName: string;
  pentestName: string;
  pentestDescription: string;
  aggressiveness: string;
  progress: number;
  scopeType: string;
  ipAddresses: Array<string>;
  startIp: string;
  endIp: string;
  cidrRange: string;
  hostName: string;
  allowedActions: Array<string>;
  agentIp: string;
  subnetMask: string;
  defaultGateway: string;
  createdOn: string;
  createdBy: {
    userId: string;
    userName: string;
  };
}

export interface NetworkPenTestModified {
  userId: string;
  pentestId: string;
  pentestType: string;
  networkDetails: NetworkDetails;
  scanData: Record<string, string>;
  lastUpdated: string;
  scanDataLastUpdatation: boolean;
}

export interface NetworkPenTestDefault {
  id: number;
  userid: string;
  pentestid: string;
  type: string;
  data: {
    networkDetails: NetworkDetails;
    scandata?: Record<string, string>;
    isDataUpdated?: boolean;
  };
  lastscanon: string;
}

export interface NetworkPenTestWithoutScanModified {
  userId: string;
  pentestId: string;
  pentestType: string;
  networkDetails: NetworkDetails;
  lastUpdated: string;
}

export interface NetworkPenTestWithoutScanDefault {
  id: number;
  userid: string;
  pentestid: string;
  type: string;
  networkdetails: NetworkDetails;
  lastscanon: string;
}
