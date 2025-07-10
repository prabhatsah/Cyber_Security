import { getAccount } from "@/ikon/utils/actions/account";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

export const setSupplierOffer = async (
  bidId: string | null,
  newOfferObj: any
) => {
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "Bid Shortlisting and Negotiations" },
      processVariableFilters: { bidId: bidId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const existing: any = response[0].data;

      let newData = { ...existing };
      if (!newData.offers) {
        newData.offers = [];
      }

      const account = await getAccount();
      const accountId = account.ACCOUNT_ID;
      newOfferObj.sender = accountId; // Mark as Supplier

      newData = { ...existing, offers: [...newData.offers, newOfferObj] };

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

export const finalizeAcceptOffer = async (bidId: any, offerId: any) => {
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "Bid Shortlisting and Negotiations" },
      processVariableFilters: { bidId: bidId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const existing: any = response[0].data;
      const offers = existing.offers.map((offer: any) => {
        if (offer.id === offerId) offer.status = "Accepted";
        else offer.status = "Rejected";
        return offer;
      });
      console.log("offers after accepting", offers);
      existing.offers = offers;
      existing.negotiationComplete = true;
      await invokeAction({
        taskId: taskId,
        transitionName: "Update Bid Shortlisting & Negotiations",
        data: existing,
        processInstanceIdentifierField: "bidId",
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
