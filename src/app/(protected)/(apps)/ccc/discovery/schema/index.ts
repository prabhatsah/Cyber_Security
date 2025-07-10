import {z} from 'zod'

//windows schema
const winSchemaObject = {
    
    credentialName:z.string(),
    userName:z.string(),
    password:z.string(),

}
const windowsCredentialSchema =z.object(winSchemaObject)

//SSH Schema
const sshSchemaObject = {
    credentialName:z.string(),
    userName:z.string(),
    port:z.number(),
    password:z.string(),
}
const sshCredentialSchema = z.object(sshSchemaObject)

//SNMP Schema
const snmpSchemaObject = {
    credentialName:z.string(),
    port:z.string(),
    version:z.string(),
    communityString:z.string(),
}
const snmpCredentialSchema = z.object(snmpSchemaObject)

//Parameter Credential Schema
const parameterSchemaObject = {
    credentialName:z.string(),
    key:z.string(),
    value:z.string(),
    selectValueType:z.string(),
}
const parameterCredentialSchema = z.object(parameterSchemaObject)


export const credentialTypeWiseSchemaDetails = {
    'Parameter':parameterCredentialSchema,
    'SSH':sshCredentialSchema,
    'SNMP':snmpCredentialSchema,
    'Windows':windowsCredentialSchema
}

export const CredTypeWiseSchemaKeys = {
    'Parameter':parameterSchemaObject,
    'SSH':sshSchemaObject,
    'SNMP':snmpSchemaObject,
    'Windows':winSchemaObject
}
