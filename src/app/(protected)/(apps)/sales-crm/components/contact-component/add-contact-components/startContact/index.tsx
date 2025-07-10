import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startLeadUserContactsProcess = async (newContact: Record<string, any>) => {
    const processId = await mapProcessName({processName: "Contact",});
    await startProcessV2({processId, data: newContact, processIdentifierFields: "newContact.email,newContact.phoneNo,newContact.source,newContact.leadIdentifier,newContact.contactIdentifier"});
};