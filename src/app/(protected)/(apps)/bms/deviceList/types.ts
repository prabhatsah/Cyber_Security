import { InstanceV2Props } from "@/ikon/utils/api/processRuntimeService/type";

export interface DeviceListDataType {
    processInstanceId: string;
    data: {
      deviceCredentialID: string;
      hostName: string;
      hostIp: string;
      clientId: string;
      shortCode: string;
      assetTag: string;
      description: string;
      classification: string;
      type: string;
      os: string | null;
      macAddress: string;
      location: string;
      accountable: {
        userId: string;
        userName: string;
      };
      discoverDateAndTime: string;
      deviceId: string;
      probeId: string;
      country: string | null;
      state: string | null;
      city: string | null;
      assignedRoles: null | string[],
      osType: string;
      sysDescr: string;
      postProcessor: string;
      executionTarget: string | null;
      modelId: string;
      //dryRunAccessable?: true | false;
      dryRunAccessable?: string;
      
    };
    sender: string;
    processInstanceAccountId: string;
    lockedByMe: boolean;
    action: string;
    taskName: string;
    message: string;
    taskId: string;
    suspended: boolean;
    timestamp: string;
}

export interface ImportedDeviceListType {
  processInstanceId: string;
  action: string,
  data:{
      accountable: {
      userId: string,
      userName: string
    },
    assetTag: string,
    assignedRoles : string [],
    city: null | string,
    classification: string,
    clientId: string,
    country: string | null,
    description: string,
    deviceCredentialID: string,
    deviceId: string,
    discoverDateAndTime: string,
    hostIp: string,
    hostName: string,
    location: string,
    macAddress: string,
    os: string,
    osType: string,
    probeId: string,
    shortCode: string,
    state: null | string,
    type: string
  },
  sender: string;
  processInstanceAccountId: string;
  lockedByMe: boolean;
  taskName: string;
  message: string;
  taskId: string;
  suspended: boolean;
  timestamp: string;
}


export type probleIdMapType = {
    [key: string] : string
}

interface CommonModalProps{
  open: boolean;
  close: () => void;
  refresh: () => void;
  clientId: string
}

export interface DeviceModalAddFormProps extends CommonModalProps{
  profile: ProfileDataType;
  probleIdWiseDetails: probleIdMapType | undefined

}

export interface DeviceModalViewFormProps extends Omit<DeviceModalAddFormProps, "refresh"> {
  deviceData: InstanceV2Props<DeviceListDataType>;
}

export interface DeviceModalEditFormProps extends Omit<DeviceModalAddFormProps, 'clientId'> {
  deviceData: InstanceV2Props<DeviceListDataType>;
}

export type DeviceIdWiseDetailsType = {
  [key: string] : InstanceV2Props<DeviceListDataType>
}

export type ImportedDeviceIdWiseDetailsType = {
  [key: string] : ImportedDeviceListType
}

export interface ProfileDataType{
  CNT: number,
  USER_EMAIL: string,
  USER_ID: string,
  USER_LOGIN: string,
  USER_NAME: string,
  USER_PHONE: string,
  USER_THUMBNAIL: null
}

export interface UploadDeviceFileProps extends Omit<CommonModalProps, 'clientId'>{
  file: string
}

export interface ImportDevicesProps extends CommonModalProps{
  existingDevices: string[]
}


export interface UploadedFileType {
  processInstanceId: string;
  processInstanceSoftwareId: string;
  data: {
    "Uploaded Resource": {
      resourceId: string;
      inputControl: string;
      resourceName: string;
      resourceSize: number;
      resourceType: string;
    };
  };
  sender: string;
  lockedByMe: boolean;
  action: string;
  taskName: string;
  message: string;
  taskId: string;
  suspended: boolean;
  timestamp: string;
}

export interface CredentialType {
  clientAccess: string[],
  createdOn: string,
  credentialId: string,
  credentialName: string,
  credentialType: string,
  password: string,
  updatedOn: string,
  userName: string,
  port?: string,
  deletedBy?: string
}

export interface RoleMembershipInfoType{
  SOFTWARE_ID: string,
  ROLE_NAME: RoleType,
  ROLE_ID: string
}

export type RoleType = 'System Viewer' | 'System Administrator' | 'Command Administrator' | 'Asset Administrator';