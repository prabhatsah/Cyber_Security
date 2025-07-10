export type RawBacnetTableDataType  = {
    id: string,
    description?: string,
    object_name?: string,
    present_value?: string,
    units?: string,   
}

// export type DeletedCredHistoryTableDataType = {
//     deletedBy: string,
//     deletedOn: string,
//     credentialName: string,
//     credentialType: string,
//     updatedOn: string,
//     services:string
// }
// export type CredentialType = 'Windows' | 'SNMP' | 'SSH' | 'Parameter';

// export type CredentialTableSchemaType={
//     credentialName:string
// } 
// export type DiscoveryStatusTableSchemaType={   
//     discoveryStarted:boolean,
//     startingDiscovery:boolean,
//     discoveringIPOnlyDevices:boolean,
//     basicDiscoveryCompleted:boolean
// }