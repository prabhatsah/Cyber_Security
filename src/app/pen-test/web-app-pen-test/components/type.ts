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
  progress: number;
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
  context: string;
  analysis: string;
  confidence: string;
  count: string;
  cweid: string;
  wascid: string;
  desc: string;
  solution: string;
  reference: string;
  owasp_title: string;
  instances: ZapAlertInstance[];
}

export interface NmapAIReport {
  host: string;
  latency: string;
  scan_date: string;
  ip_address: string;
  open_ports: Array<{
    port: string;
    state: string;
    service: string;
    version: string;
    protocol: string;
  }>;
  host_status: string;
  port_summary: {
    open_ports_count: number;
    total_ports_scanned: number;
    filtered_ports_count: number;
  };
  scan_duration: string;
  firewall_status: string | null;
  recommendations: {
    "HTTP Security": string;
    "Service Ports": string;
    "Operating System": string;
    "Web Server (Nginx)": string;
  };
  operating_system: {
    cpe: string | null;
    name: string | null;
    details: string | null;
  };
  service_insights: Array<{
    description: string;
    port_service: string;
  }>;
  software_versions: {
    http: string;
    "ssl/https": string;
  };
}

export interface AmassAIReport {
  domains: Array<Array<string>>;
  mx_records: Array<Array<string>>;
  cname_chains: Array<Array<string>>;
  domains_info: string;
  name_servers: Array<Array<string>>;
  infrastructure: Array<Array<string>>;
  mx_records_info: string;
  cname_chains_info: string;
  executive_summary: {
    top_asns: Array<Array<string>>;
    unique_ips_count: number;
    unique_asns_count: number;
    unique_fqdns_count: number;
  };
  name_servers_info: string;
  infrastructure_info: string;
  executive_summary_info: string;
}

export interface WhatwebAIReport {
  country: string;
  ip_address: string;
  uses_https: boolean;
  scanned_url: string;
  status_code: string;
  country_code: string;
  scan_date_gmt: string;
  web_server_os: string;
  website_title: string;
  status_message: string;
  web_server_name: string;
  content_encoding: Array<string>;
  operating_system: string;
  last_modified_gmt: string;
  security_protocol: string;
  web_server_version: string;
  backend_technologies: Array<string>;
  frontend_technologies: Array<string>;
  security_protocol_version: string;
  security_protocol_standard: string;
}

export interface AIReportData {
  nmap?: NmapAIReport;
  amass?: AmassAIReport;
  whatweb?: WhatwebAIReport;
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
  aiReport: AIReportData;
  lastUpdated: string;
  scanDataLastUpdatation: boolean;
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
    isDataUpdated?: boolean;
  };
  ai_report?: {
    nmap?: NmapAIReport;
    amass?: AmassAIReport;
    whatweb?: WhatwebAIReport;
  };
  lastscanon: string;
}

export interface PenTestWithoutScanModified {
  userId: string;
  pentestId: string;
  pentestType: string;
  basicDetails: BasicDetails;
  lastUpdated: string;
}

export interface PenTestWithoutScanDefault {
  id: number;
  userid: string;
  pentestid: string;
  type: string;
  basicdetails: BasicDetails;
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
