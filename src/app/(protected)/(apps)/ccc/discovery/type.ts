export type DiscoveryTableDataType  = {
    id: string,
    ipRange: string,
    user:string,
    probe: string,
    discoveredTime: string,
    discoveredDevices: number,
    undiscoveredDevices: number,    

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


