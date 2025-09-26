export interface Credential {
  username: string;
  password: string;
}

export interface EncryptedCredential {
  username: string;
  password: string;
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
