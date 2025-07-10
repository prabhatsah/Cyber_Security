export interface DeviceConfigDataType {
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
    dryRunAccessable?: 'Yes' | 'No';

    status?: string;
    monitoringStatus?: 'Yes' | 'No' | 'yes' | 'no' | 'N/A';
    noOfServices: number
    serviceIdList?: string[]
}

export interface Command {
    commandName: string;
    command: string;
    eachCommandId: string;
    deviceSelectionObj?: {
        deviceSelection: boolean
    };
  }
  
interface Script {
    commands: Command[];
}
  
export interface CommandDataType {
    devicesAssosiated: string[]; // Assuming it's an array, define type if structure is known
    commandName: string;
    commandDescription: string;
    deviceType: "ipBased" | string; // Expand if more types exist
    commandProtocol: "Ssh" | string; // Expand if more protocols exist
    authorizedPersons: string[]; // Array of user IDs
    commandTags: string[]; // Array of tag IDs
    selectedTags: string[]; // Array of tag names
    script: Script;
    subType: string;
    commandId: string;
    isVerified?: boolean;
    rootNecessary: boolean;
    tokensNecessary: boolean;
    source: "Manual" | string; // Expand if other sources exist
    executionTarget: string;
    updatedBy: string;
    updatedOn: string; // Consider `Date` if you'll parse it
    createdBy: string;
    createdOn: string; // Consider `Date` if you'll parse it
}
 
interface ScheduleConfig {
    type: "monthly" | string; // Expand if more types exist
    timeVal: string;
    monthlyScheduleMonths: string[]; // Array of month names
    cronExp: string;
  }
  
interface DeviceDetail {
    hostIp: string;
    deviceId: string;
    associatedSubcommandId: string;
    commandIndex: number;
}
  
export interface CommandScheduleDataType {
    scheduleId: string;
    scheduleConfig: ScheduleConfig;
    deviceDetailsWithAssociatedSubCommand: Record<string, DeviceDetail>; // Maps unique IDs to DeviceDetail
    deviceId: string;
    credId: string;
    parameterId: string;
    commandId: string;
    scheduledOn: string; // Consider `Date` if you'll parse it
}

interface ExecutionResult {
    className: string;
}
  
interface Result {
    result: ExecutionResult;
    dryRunStatus: "Failed" | "Success"; // Add more statuses if needed
}
  
export interface CommandExecutionDataType {
    executionId: string;
    commandStartTime: string; // Consider `Date` if parsing
    instructionList: string[]; // List of instruction IDs
    probeId: string;
    updatedOn: string; // Consider `Date` if parsing
    resultList: Result[];
    scheduleId: string;
    status: "failure" | "success" | "in-progress"; // Expand if more statuses exist
}
  
  
export interface SelectedHostIp {
    hostIp: string;
    deviceId: string;
    credId: string;
    parameterId: string;
}
  
interface ConfiguredItem {
    commandProtocol: "Ssh" | "Http" | "Other"; // Adjust based on possible protocols
    commandName: string;
    selectedHostIps: SelectedHostIp[];
    commandId: string;
    deviceCount: number;
    deviceIds: string[];
    commandIds: string[];
    commandCount: number;
  }
  
interface CommandScheduleConfig {
    // type: "monthly" | "daily" | "weekly"; // Expand as needed
    // timeVal: string;
    // monthlyScheduleMonths: string[];
    // cronExp: string;
    cronExp: string;
    dateTime?: string;
    type: 'oneTime' | 'daily' | 'weekly' | 'monthly';
    recurCount?: string;
    timeVal?: string;
    dayList?: string[];
    monthlyScheduleMonths?: string[];
    reminderDetails?: {
        startReminder: string,
        reminderDuration: string,
        interval: number,
        intervalUnit: string,
        reminderStartCron: string,
        repeatCount: number | string
    }
}
  
interface ScheduleObj {
    scheduleId: string;
    scheduleConfig: CommandScheduleConfig;
}
  
interface CommandSchedule {
    commandId: string;
    deviceList: SelectedHostIp[];
    scheduleObj: ScheduleObj;
    configuredOn: string; // Convert to Date if needed
}
  
export interface CommandIdWiseSchedule {
    [commandId: string]: CommandSchedule;
}
  
export interface UserCommandConfigType {
    associatedUserId: string;
    associatedUserLogin: string;
    associatedTabId: string;
    configuredItemListForTab: ConfiguredItem[];
    commandIdWiseSchedule: CommandIdWiseSchedule;
}

export interface TreeNodeDataType{
    id: string;
    type: "treeNode" | string;
    position: { x: number, y: number },
    data: { 
        label: string, 
        expanded: boolean ,
        deviceCount: number, 
        commandsCount: number
    },
    style?: { 
        backgroundColor: string, 
        color: string,
        [key: string]: string | number
    }
}

export interface TreeNodeEdgesType{ 
    id: string, 
    source: string, 
    target: string 
}


export type DeviceIdWiseDetailsType = {
    [key: string] : DeviceConfigDataType
}

export type CommandIdWiseDetailsType = {
    [key: string] : CommandDataType
}

export type CommandDeviceWiseScheduleDetailsType = {
    [key: string] : {
        [key: string] : CommandScheduleDataType
    }
}

export type ScheduleIdWiseExecutionDetailsType = {
    [key: string] : CommandExecutionDataType
}

interface TaskScheduleConfig {
    type: "monthly";
    timeVal: string;
    monthlyScheduleMonths: string[];
    cronExp: string;
}
  
interface DeviceDetails {
    hostIp: string;
    deviceId: string;
    associatedSubcommandId: string;
    commandIndex: number;
}
  
export interface TaskScheduleDataType {
    scheduleId: string;
    scheduleConfig: TaskScheduleConfig;
    deviceDetailsWithAssociatedSubCommand: Record<string, DeviceDetails>;
    deviceId: string;
    commandId: string;
    scheduledOn: string;
}
 

interface ExecutionLogResult {
    [key: string]: string;
}
  
export interface ExecutionLogType {
    executionId: string;
    commandStartTime: string;
    instructionList: string[];
    hostIp: string;
    probeId: string;
    updatedOn: string;
    resultList: {
      result: ExecutionLogResult;
      dryRunStatus: "Success" | "Failed";
    }[];
    deviceId: string;
    commandId: string;
    scheduleId: string;
    status: "success" | "failure";
  }


  interface ApiCredProperty {
    key: string;
    uniqueIdForInput: string;
    value: string;
    selectValueType: "Text" | "Password";
  }
  
export interface ParameterCredentialType {
    credentialId: string;
    credentialName: string;
    credentialType: "Apicred";
    createdOn: string;
    updatedOn: string;
    clientAccess: string[];
    associatedMetrics: string[];
    ApiCredProperties: ApiCredProperty[];
}
  

export interface BasicCredentialType {
    credentialId: string;
    credentialName: string;
    credentialType: "Ssh" | "Windows";
    createdOn: string;
    updatedOn: string;
    userName: string;
    password: string;
    port: string;
    clientAccess: string[];
  }

interface DeviceSubcommandDetail {
    hostIp: string;
    deviceId: string;
    associatedSubcommandId: string;
    commandIndex: number;
}
  
type DeviceDetailsWithAssociatedSubCommandType = Record<string, DeviceSubcommandDetail>;
export interface CommandScheduleType {
    configuredOn: Date;
    commandId: string;
    deviceList: {
        hostIp: string;
        deviceId: string;
    }[];
    scheduleObj: {
        scheduleConfig: {
            cronExp: string;
            dateTime?: string;
            type: 'oneTime' | 'daily' | 'weekly' | 'monthly';
            recurCount?: string;
            timeVal?: string;
            dayList?: string[];
            monthlyScheduleMonths?: string[];
            reminderDetails?: {
                startReminder: string,
                reminderDuration: string,
                interval: number,
                intervalUnit: string,
                reminderStartCron: string,
                repeatCount: number | string
            } 
        };
        scheduleId: string;
    };
    deviceDetailsWithAssociatedSubCommand?: DeviceDetailsWithAssociatedSubCommandType

}

export type ProcessInstanceDeleteMapType = Record<string, string>;