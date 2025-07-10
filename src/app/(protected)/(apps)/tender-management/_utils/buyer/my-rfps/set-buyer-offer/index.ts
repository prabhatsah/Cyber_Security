import { getAccount } from "@/ikon/utils/actions/account";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

export const setBuyerOffer = async (bidId: string | null, newOfferObj: any) => {
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "Bid Shortlisting and Negotiations" },
      processVariableFilters: { bidId: bidId },
    });
    console.log("response", response);

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const existing: any = response[0].data;
      console.log("existing", existing);
      console.log("now", newOfferObj);
      let newData = { ...existing };
      if (!newData.offers) {
        newData.offers = [];
      }
      const account = await getAccount();
      const accountId = account.ACCOUNT_ID;
      newOfferObj.sender = accountId;
      newData = { ...existing, offers: [...newData.offers, newOfferObj] };
      console.log("newData", newData);
      await invokeAction({
        taskId: taskId,
        transitionName: "Update Bid Shortlisting & Negotiations",
        data: newData,
        processInstanceIdentifierField: "bidId",
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};
