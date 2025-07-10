export type DiscoveryTableDataType  = {
    id: string,
    ipRanges?: string,
    user?:string,
    probe: string,
    discoveredTime?: string,
    discoveredDevices?: number,
    undiscoveredDevices?: number,
    discoverDateAndTime?: string,
    accountable?: any    
}

export type DeletedCredHistoryTableDataType = {
    deletedBy: string,
    deletedOn: string,
    credentialName: string,
    credentialType: string,
    updatedOn: string,
    services:string
}
export type CredentialType = 'Windows' | 'SNMP' | 'SSH' | 'Parameter';

export type CredentialTableSchemaType={
    credentialName:string
} 
export type DiscoveryStatusTableSchemaType={   
    discoveryStarted:boolean,
    startingDiscovery:boolean,
    discoveringIPOnlyDevices:boolean,
    basicDiscoveryCompleted:boolean
}
