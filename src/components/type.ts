export interface ScanNotificationInDatabase {
  pid: number;
  tool: string;
  target: string;
  status: string;
  scan_id: string;
  user_id: string;
  end_time?: string;
  progress?: null;
  pentest_id: string | null;
  start_time: string;
}

export interface ScanNotificationDataModified {
  scanId: string;
  tool: string;
  target: string;
  startTime: string;
  endTime: string;
  status: string;
  pentestId: string;
}

export interface PentestEachSubScan {
  tool: string;
  startTime: string;
  endTime: string;
  status: string;
  scanId: string;
}

export interface ScanNotificationDataWithGroupedPentestId {
  target: string;
  pentestId: string;
  subScanDetails: PentestEachSubScan[];
}

// Not in Use Presently
export interface ScanNotificationDataWithPentestId {
  scanId: string;
  tool: string;
  target: string;
  startTime: string;
  endTime: string;
  status: string;
  pentestId: string;
}

export interface ScanNotificationDataWithoutPentestId {
  scanId: string;
  tool: string;
  target: string;
  startTime: string;
  endTime: string;
  status: string;
  pentestId: null;
}
