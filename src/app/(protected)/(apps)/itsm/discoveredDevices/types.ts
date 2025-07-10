// Discovered devices -> [page.tsx] : ST

export interface ProfileDataType{
    CNT: number;
    USER_EMAIL: string;
    USER_ID: string;
    USER_LOGIN: string;
    USER_NAME: string;
    USER_PHONE: string;
    USER_THUMBNAIL: null;
}

export interface DeviceListDataType {
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
    assignedRoles: null | string[];
    osType: string;
    sysDescr: string;
    postProcessor: string;
    executionTarget: string | null;
    modelId?: string;
    dryRunAccessable?: string;

    status?: string;
    monitoringStatus?: 'Yes' | 'No' | 'yes' | 'no' | 'N/A';
    noOfServices: number
    serviceIdList?: string[]
}

export interface DataTableExtraParamProps {
    tm: string
}

export interface DataTableColumnsProps {
    tm: string
}

export type probleIdMapType = {
    [key: string] : string
}

export interface serviceDetails{
    category: string;
    devicesAssosiated: string[] | [];
    executionTarget: string;
    metricsDescription: string;
    metricsName: string;
    monitoringNecessary: boolean;
    monitoringProtocol: string;
    osName: string;
    postProcessor: string;
    rootNecessary: boolean
    script: string;
    serviceId: string;
    subType: string;
    tokensNecessary: boolean;
    type: string;
}

// Discovered devices -> [page.tsx] : ED



// discovered devices -> components -> [DataTableToolsButton.tsx] : ST

export interface TableToolButtonProps {
    onclick: () => void;
    classes: string;
}

// discovered devices -> components -> [DataTableToolsButton.tsx] : ED



// discovered devices -> components -> [DataTable.tsx] : ST

export interface DiscoveredDevicesTableProps{
    deviceData: DeviceListDataType[];
    probeIdNameMap: probleIdMapType | undefined;
    profileData: ProfileDataType;
    taskId: string;
    serviceIdWiseDetails: {
        [key: string] : serviceDetails
    };
    deviceIdWiseData: DeviceIdWiseData;
    currentRole: RoleMembershipInfoType[];
}

// discovered devices -> components -> [DataTable.tsx] : ED


// discovered devices -> utils -> [preloader_functions.ts] : ST

export type serviceIdWiseDetailsType = {
    [key: string] : serviceDetails
}

export type param = {
    clientId?: string;
    deviceId?: string;
    deviceIdList: string[];
    serviceIdWiseDetails: {
        [key: string] : serviceDetails
    }
};

export type memoryCacheReturn = {
    [key: string] : {
        'Last Monitoring' : string | null,
        'Poling Interval' : number | null
    }
}

export type LatestDataType = {
    daashboardData: {
        client_id: string;
        data_received_on: string;
        device_id: string;
        monitoring_data: string;
        service_id: string;
        service_status: string;
        [key: string]: unknown;
    }[]
}

// discovered devices -> utils -> [preloader_functions.ts] : ED

interface CommonModalProps{
    open: boolean;
    close: () => void;
    refresh: () => void;
}
  
export interface DeviceModalAddFormProps extends CommonModalProps{
    profile: ProfileDataType;
    probleIdWiseDetails: probleIdMapType | undefined
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

export interface DeviceModalEditFormProps extends DeviceModalAddFormProps {
    deviceData: DeviceListDataType;
    taskId: string;
}


export interface DeletedDevicesTableProps extends Omit<CommonModalProps, 'refresh'>{
    deletedDeviceData: DeleteDeviceData[]
}

export interface DevicePollingIntervalProps extends CommonModalProps {
    deviceId: string | undefined;
    serviceIdWiseDetails: serviceIdWiseDetails;
    viewMode: boolean;
}

export type serviceIdWiseDetails = {
    [key: string] : serviceDetails
}

// [DeletedDeviceHistoryForm.tsx] : ST

export interface DeletedDeviceHistoryFormProps extends Omit<CommonModalProps, 'refresh'>{
    profile: ProfileDataType;
}

// [DeletedDeviceHistoryForm.tsx] : ED


interface Accountable {
    userId: string;
    userName: string;
}

export interface DeleteDeviceData {
    accountable: Accountable;
    clientId: string;
    deleteDataAndTime: string; // Consider using Date type if you will parse it
    description: string;
    deviceId: string;
    hostIp: string;
    hostName: string;
    os: string;
    serviceCount: number;
    serviceData: unknown[]; // Change `any` to a more specific type if serviceData has a structure
    status: string;
    type: string;
}

// [StartBasicServiceDiscovery.tsx] : ST

export interface StartBasicServiceDiscoveryProps extends CommonModalProps{
    deviceData: DeviceListDataType[];
    probeIdWiseData: probleIdMapType | undefined
}

export interface BasicDeviceDataType {
    deviceName: string;
    deviceId: string;
    deviceIP: string;
}

// [StartBasicServiceDiscovery.tsx] : ED



// [ProbeListTable.tsx] : ST

export interface ProbeListTableType extends CommonModalProps{
    selectedDeviceIdWiseProbeId: {
        [key: string] : string;
    };
    probleIdWiseDetails: probleIdMapType | undefined;
}

// [ProbeListTable] : ED



// [DeviceActivityLogModalForm.tsx] : ST

export type paramsType_DA =  {
    probeId: string;
    hostIp: string;
    hostName: string;
}

export interface DeviceActivityLogModalFormProps extends CommonModalProps{
    params: paramsType_DA
}

// [DeviceActivityLogModalForm.tsx] : ED



// [DeviceConfigurationForm.tsx] : ST

export interface DeviceConfigurationFormProps extends CommonModalProps{
    params: params_DC
}

export type params_DC = {
    deviceIds: string[];
    deviceIdWiseData: {
        [key: string] : DeviceListDataType
    };
    serviceIdWiseDetails: serviceIdWiseDetailsType
}

interface ServiceDetails {
    serviceId: string;
    apiCredentialId: string;
    serviceName: string;
    monitoringProtocol: "Ssh" | string; // Expand if other protocols exist
  }
  
export interface DataPayload {
    allSelectedDeviceId: string[];
    allUncheckedServiceId: Record<string, never>; // Empty object, consider adding fields if structure evolves
    associatedUserId: string;
    clientId: string;
    deviceIdDetails: {
      [deviceId: string]: ServiceDetails[]; // Maps device IDs to their respective service details
    };
    uncheckedMetricsList: unknown[]; // Define structure if details become available
}

export interface ConfigureServicesForDeviceProps{
    state: 'Initial State' | 'Update State';
    deviceIdWiseDetails: {
        [key: string]: DeviceListDataType
    },
    serviceIdWiseDetails: serviceIdWiseDetailsType
}

// [DeviceConfigurationForm.tsx] : ED



// [Device3DViewForm.tsx] : ST

export interface Device3DModalViewFormProps extends CommonModalProps{
    params: {
        modelId : string;
        macAddr : string;
        discoveredBy : string;
        osType : string;
        osName : string;
        hostIp : string;
        deviceCategory : string;
        deviceId : string;
        serviceIdWiseDetails: serviceIdWiseDetailsType;
    }
}


export interface Choose3DModelSelectionProps extends Omit<CommonModalProps, 'refresh'>{
    modelId: string | undefined;
}

export interface Add3DModelProps extends Omit<CommonModalProps, 'refresh'>{
    params: {
        deviceId: string;
    }
}

// [Device3DViewForm.tsx] : ED



// [DeviceDiscoveryHistoryModalForm.tsx] : ST

export interface DeviceIdWiseData{
    [key: string]: DeviceListDataType;
}

export interface DeviceDiscoveryHistoryModalFormProps extends Omit<CommonModalProps, 'refresh'>{
    params?: {
        deviceIdWiseData: DeviceIdWiseData;
    }
}

export interface DeviceHistoryDataType{
    accountable?: {
        userId: string;
        userName: string;
    }
    clientId?: string;
    countOfDiscoveredDevices?: number;
    countOfUnDiscoveredDevices?: number;
    deviceId?: string[];
    discoverDateAndTime?: string;
    hostName?: string;
    ipRanges?: {
        ipRangeEnd: string;
        ipRangeStart: string;
    }[];
    notDiscoveredDeviceIds?: string[]
    probeId?: string;
    routerConfigs?: unknown[]
    discoveryHistoryData?: {
        accountable: {
            userId: string;
            userName: string;
        };
        clientId: string;
        description: string;
        deviceId: string;
        discoverDateAndTime: string;
        discoveryType: string;
        hostIp: string;
        hostName: string;
        os: string;
        type: string;
    }[]

    deviceIds?: string[]
}

export interface DiscoveredDeviceDetailsTableProps extends Omit<CommonModalProps, 'refresh'>{
    deviceData: DeviceListDataType[]
}

// [DeviceDiscoveryHistoryModalForm.tsx] : ED


export type RoleType = 'System Viewer' | 'System Admin' | 'Asset Administrator' | 'Windows Administrator' | 'Linux Administrator' | 'Network Administrator' | "Database Administrator";

export interface RoleMembershipInfoType{
    SOFTWARE_ID: string,
    ROLE_NAME: RoleType,
    ROLE_ID: string
}