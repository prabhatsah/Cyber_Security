interface Instance {
  id: string;
  uri: string;
  method: string;
  param: string;
  attack: string;
  evidence: string;
}

export interface Alert {
  pluginid: string;
  alert: string;
  riskcode: string;
  confidence: string;
  count: string;
  cweid: string;
  wascid: string;
  desc: string;
  solution: string;
  reference: string;
  instances: Instance[];
}

export interface Site {
  "@name": string;
  "@host": string;
  "@port": string;
  "@ssl": string;
  alerts: Alert[];
}

export interface Data {
  [key: string]: Site & { scanned_at: string };
}

export interface PastScansData {
  data: Data;
  id: number;
  lastscanon: string;
  userId: string;
}
