import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startAccountData = async (newAccount: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Account",});
    await startProcessV2({processId, data: newAccount, processIdentifierFields: "accountIdentifier,accountName,accountManager,createdOn,updatedOn"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
