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
