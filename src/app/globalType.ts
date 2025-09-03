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
