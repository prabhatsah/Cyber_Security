import { getAccount } from "@/ikon/utils/actions/account";
import { getMyProfileData } from "./get-profile-data";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startRegisterInstanceIfNotPresent = async () => {
  const account = await getAccount();
  const accountId = account.ACCOUNT_ID;
  const instance = await getMyProfileData(accountId);
  if (!instance) {
    console.log("instance not found...starting new instance");
    const processId = await mapProcessName({
      processName: "Tender Management User Register",
    });
    await startProcessV2({
      processId,
      data: {
        accountId: accountId,
        buyerDetails: {},
        supplierDetails: {},
      },
      processIdentifierFields: "accountId",
    });
    console.log('instance created with accountid', accountId);
  } else {
    console.log("instance found");
  }
};
