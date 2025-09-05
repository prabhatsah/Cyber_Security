export interface FileSystemConfigData {
  config_id: string;
  config_name: string;
  probe_id: string;
  probe_name: string;
  probe_machine_os_type: string;
  created_on: string;
  created_by: string;
  hostname: string;
  ip_address: string;
}

export interface FileSystemScanMetaData {
  Author: string;
  Branch: string;
  Commit: string;
  CommitMsg: string;
  Committer: string;
}

export interface FileSystemScanResultsSecretsCodeLines {
  Annotation: string;
  Content: string;
  FirstCause: boolean;
  Highlighted: string;
  IsCause: boolean;
  LastCause: boolean;
  Number: number;
  Truncated: boolean;
}

export interface FileSystemScanResultsSecrets {
  Category: string;
  Code: {
    Lines: FileSystemScanResultsSecretsCodeLines[];
  };
  EndLine: number;
  Match: string;
  RuleID: string;
  Severity: string;
  StartLine: number;
  Title: string;
}

export interface FileSystemCVSS {
  [key: string]: {
    V3Score: number;
    V3Vector: string;
  };
}

export interface FileSystemScanResultsVulnerabilities {
  CVSS: FileSystemCVSS;
  CweIDs: Array<string>;
  DataSource: {
    ID: string;
    Name: string;
    URL: string;
  };
  Description: string;
  FixedVersion: string;
  InstalledVersion: string;
  LastModifiedDate: string;
  PkgID: string;
  PkgIdentifier: {
    PURL: string;
    UID: string;
  };
  PkgName: string;
  PrimaryURL: string;
  PublishedDate: string;
  References: Array<string>;
  Severity: string;
  SeveritySource: string;
  Status: string;
  Title: string;
  VendorSeverity: Record<string, number>;
  VulnerabilityID: string;
}

export interface FileSystemScanResultsData {
  Class: string;
  Target: string;
  Type?: string;
  Secrets?: FileSystemScanResultsSecrets[];
  Vulnerabilities?: FileSystemScanResultsVulnerabilities[];
}

export interface FileSystemScanData {
  ArtifactName: string;
  ArtifactType: string;
  CreatedAt: string;
  Metadata: FileSystemScanMetaData;
  Results: FileSystemScanResultsData[];
  SchemaVersion: number;
}

export interface FileSystemFullInstanceData {
  file_system_id: string;
  scan_data: FileSystemScanData;
  scan_id: string;
  scan_path: string;
  user_id: string;
  user_login: string;
}

export interface ProbeDetails {
  PROBE_ID: string;
  PROBE_NAME: string;
  USER_NAME: string;
  USER_ID: string;
  ACTIVE: boolean;
  SOFTWARE_ID: string;
  IS_PLATFORM_PROBE: boolean;
  LAST_HEARTBEAT: string;
}
