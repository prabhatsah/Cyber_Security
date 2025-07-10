import { getAccount } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import moment from "moment";

export const getCurrentAccountBids = async () => {
  const account = await getAccount();
  const accountId = account.ACCOUNT_ID;
  const allMyBids = [];

  /* fetch from internally ikon */
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: "View Tender" },
      processVariableFilters: { accountId: accountId },
      projections: ["Data.tenderId"],
    });

    console.log("tender management response", response);

    if (response.length > 0) {
      const tenderIdArr = response.map((res: any) => res.data.tenderId);
      let mongo = "";
      tenderIdArr.forEach((tenderId: any) => {
        mongo += `this.Data.id=='${tenderId}' ||`;
      });
      mongo = mongo.slice(0, -2);

      const published: any[] = await getMyInstancesV2({
        processName: "Published Tenders",
        predefinedFilters: { taskName: "View" },
        mongoWhereClause: mongo,
        //* processVariableFilters : { id: idd }
      });

      allMyBids.push(...published.map((res) => res.data));
    }
  } catch (error) {
    console.error("Failed to get data:", error);
  }

  /**fetch from external sources */
  try {
    const response = await getMyInstancesV2({
      processName: "External Tenders",
      predefinedFilters: { taskName: "View" },
    });

    console.log("external tender response response", response);

    allMyBids.push(
      ...response.map((res: any) => {
        return {
          title: res.data.title,
          industry: res.data.department,
          publishedStatus: "External Source",
          submissionDeadlineRemaining: res.data.daysLeft,
          submissionDeadline: moment(res.data.deadline,'DD-MM-YYYY').format('YYYY-MM-DD'),
          publisherAccountName: "Tender247",
          url : res.data.url
        };
      })
    );
  } catch (error) {
    console.error("Failed to get data:", error);
  }

  return allMyBids;
};
