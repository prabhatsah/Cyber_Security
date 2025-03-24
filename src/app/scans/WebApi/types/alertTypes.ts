interface Instance {
  id: string;
  uri: string;
  method: string;
  param: string;
  attack: string;
  evidence: string;
}

interface Alert {
  pluginid: string;
  alert: string;
  riskcode: number;
  confidence: number;
  count: number;
  cweid: string;
  wascid: string;
  desc: string;
  solution: string;
  reference: string;
  instances: Instance[];
}

interface Site {
  "@name": string;
  "@host": string;
  alerts: Alert[];
}

export interface Data {
  site: Site[];
}
