import { WidgetProps } from "@/ikon/components/widgets/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import AccountWidget from "./component/account-widget";
import AccountDataTable from "./component/account-datatable";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
// import DealDataTable from "./component/deal-datatable";
// import { WidgetProps } from "@/ikon/components/widgets/type";
// import DealWidget from "./component/deal-widget";

export default async function AccountDetails() {
  const activeDealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: 'this.Data.dealStatus != "Won" && this.Data.dealStatus != "Lost" && this.Data.dealStatus != "Suspended" && this.Data.activeStatus != "Wom" && this.Data.activeStatus != "Deal Lost" && this.Data.activeStatus != "Suspended"',
    projections: ["Data.dealIdentifier","Data.dealName","Data.dealStatus","Data.activeStaus"],
  });
  const activeDealsData = activeDealsInstanceData.map((e: any) => e.data);
  console.log('activeDealsData', activeDealsData)
  const wonDealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: 'this.Data.dealStatus == "Won"',
    projections: ["Data.dealIdentifier","Data.dealName","Data.dealStatus","Data.activeStaus","Data.formattedActualRevenueIncludingVAT_contracted","Data.isDebtRevenue"],
  });
  const wonDealsData = wonDealsInstanceData.map((e: any) => e.data);
  console.log('wonDealsData', wonDealsData)
  var totalRevemue = 0;
  for(var i=0; i<wonDealsData.length; i++){
    if(wonDealsData[i].isDebtRevenue == false){
      totalRevemue += parseFloat(wonDealsData[i].formattedActualRevenueIncludingVAT_contracted);
    }
  }
  console.log('totalRevemue', totalRevemue)
  const lostDealsInstanceData = await getMyInstancesV2({
    processName: "Deal",
    predefinedFilters: { taskName: "View State" },
    mongoWhereClause: 'this.Data.dealStatus == "Lost"',
    projections: ["Data.dealIdentifier","Data.dealName","Data.dealStatus","Data.activeStaus"],
  });
  const lostDealsData = lostDealsInstanceData.map((e: any) => e.data);
  console.log('lostDealsData', lostDealsData)

  const accountInsData = await getMyInstancesV2({
    processName: "Account",
    predefinedFilters: { taskName: "View State" },
    projections: ["Data"],
  });

  const accountData = accountInsData.map((e: any) => e.data);
  console.log('accountData', accountData)
  var accountIdWiseAccountNameMap: { [key: string]: string } = {};
  for(var i=0; i<accountData.length; i++){
    accountIdWiseAccountNameMap[accountData[i].accountIdentifier] = accountData[i].accountName;
  }   
  const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

//   const productInsData = await getMyInstancesV2({
//     processName: "Dynamic Product Add",
//     predefinedFilters: { taskName: "View State" },
//     projections: ["Data"],
//   });

//   const productData = productInsData.map((e: any) => e.data);

//   interface DealStatus {
//     Open: number;
//     Won: number;
//     Lost: number;
//     Closed: number;
//   }

//   const dealStatus: DealStatus = {
//     Open: 0,
//     Won: 0,
//     Lost: 0,
//     Closed: 0,
//   };

//   for (var i = 0; i < dealsData.length; i++) {
//     if (dealsData[i].dealStatus != "Won" && dealsData[i].dealStatus != "Lost") {
//       ++dealStatus.Closed;
//     }
//     if (dealsData[i].dealStatus == "Won") {
//       ++dealStatus.Won;
//     } else if (dealsData[i].dealStatus == "Lost") {
//       ++dealStatus.Lost;
//     } else {
//       ++dealStatus.Open;
//     }
//   }

  const WidgetData: WidgetProps[] = [
    {
      id: "totalRevenue",
      widgetText: "Total Revenue",
      widgetNumber: "" + totalRevemue,
      iconName: "dollar-sign" as const,
    }, 
    {
        id: "noOfAccounts",
        widgetText: "No. of Accounts",
        widgetNumber: "" + accountData.length,
        iconName: "folder-code" as const,
    },
    {
      id: "noOfActiveDeals",
      widgetText: "No. of Active Deal(s)",
      widgetNumber: "" + activeDealsData.length,
      iconName: "sticky-note" as const,
    },
    {
        id: "noOfwonDeals",
        widgetText: "No. of Won Deal(s)",
        widgetNumber: "" + wonDealsData.length,
        iconName: "trophy" as const,
    },
    {
        id: "noOfLostDeals",
        widgetText: "No. of Loat Deal(s)",
        widgetNumber: "" + lostDealsData.length,
        iconName: "ban" as const,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <AccountWidget widgetData={WidgetData} />
      <div className="flex-grow overflow-hidden">
        <AccountDataTable accountsData={accountData} userIdWiseUserDetailsMap={userIdWiseUserDetailsMap} accountIdWiseAccountNameMap={accountIdWiseAccountNameMap}/>
      </div>
    </div>
  );
}
