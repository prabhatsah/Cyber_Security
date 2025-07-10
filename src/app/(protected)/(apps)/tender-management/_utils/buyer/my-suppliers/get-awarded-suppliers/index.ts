import { getFullAccountTree } from "@/ikon/utils/api/accountService";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

const getMyAwardedSuppliers = async () => {
  const returnData: any[] = [];
  try {
    let response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: {
        taskName: "View Tender",
      },
      mongoWhereClause: `this.Data.contractFinalizedFlag == true`,
      projections: ["Data.accountId", "Data.tenderId"],
    });
    console.log('response TM',response)
    if (response.length === 0) {
      return [];
    }

    const awardedTenders = response.map((res) => res.data);
    let awardedTenderIdMongo = "";
    awardedTenders.forEach((tender: any) => {
      awardedTenderIdMongo += `this.Data.id=='${tender.tenderId}' ||`;
    });

    awardedTenderIdMongo = awardedTenderIdMongo.substring(
      0,
      awardedTenderIdMongo.length - 2
    );
    console.log('awardedTenderIdMongo',awardedTenderIdMongo)

    response = await getMyInstancesV2({
      processName: "Published Tenders",
      predefinedFilters: {
        taskName: "View",
      },
      mongoWhereClause: awardedTenderIdMongo,
      projections: [
        "Data.id",
        "Data.title",
        "Data.contactPerson",
        "Data.contactEmail",
      ],
    });
    console.log('response PT',response)

    const tenderDetails = response.map((res) => res.data);

    let returnData = awardedTenders.map((item: any) => {
      const match: any = tenderDetails.find((t: any) => t.id === item.tenderId);
      return {
        ...item,
        tenderId: match.id,
        title: match.title,
        contactPerson: match.contactPerson,
        contactEmail: match.contactEmail,
      }; // Merging only if match exists
    });

    const accountList = await getFullAccountTree();
    console.log('accountList',accountList)
    const result = returnData.map(tender => {
        const data = accountList.children.filter(
          (account: any) => account.ACCOUNT_ID === tender.accountId
        );
        console.log('account details',data);
        return { ...tender, accountName: data[0].ACCOUNT_NAME };
    })

    return result;
  } catch (error) {
    console.error("Failed to get data:", error);
    throw error;
  }
};

export default getMyAwardedSuppliers;
