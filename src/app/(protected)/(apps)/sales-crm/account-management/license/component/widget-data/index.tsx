import { WidgetProps } from "@/ikon/components/widgets/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import Widgets from "@/ikon/components/widgets";
import { useEffect, useState } from "react";

export default function WidgetData() {
  const [account, setAccount] = useState([]);
  const [billingAccount, setBillingAccount] = useState([]);
  const fetchLicenseData = async () => {
    try {
      const accountInsData = await getMyInstancesV2({
        processName: "Account",
        predefinedFilters: { taskName: "View State" },
        projections: ["Data"],
      });

      const accountData: any = accountInsData.map((e: any) => e.data);
      console.log("accountData", accountData);
      setAccount(accountData)
      var accountIdWiseAccountNameMap: { [key: string]: string } = {};
      for (var i = 0; i < accountData.length; i++) {
        accountIdWiseAccountNameMap[accountData[i].accountIdentifier] =
          accountData[i].accountName;
      }

      const billingInsData = await getMyInstancesV2({
        processName: "Billing Account",
        predefinedFilters: { taskName: "View" },
        projections: ["Data"],
      });

      const billingData: any = billingInsData.map((e: any) => e.data);
      console.log("billingData", billingData);
      setBillingAccount(billingData);
    } catch (error) {
      console.error("Error fetching License:", error);
    }
  };

  useEffect(() => {
    fetchLicenseData();
  }, []);

  const WidgetData: WidgetProps[] = [
    {
      id: "totalBillingAccountCount",
      widgetText: "Billing Accounts",
      widgetNumber: "" + billingAccount.length,
      iconName: "dollar-sign" as const,
    },
    {
      id: "totalAccountsCount",
      widgetText: "Accounts",
      widgetNumber: "" + account.length,
      iconName: "dollar-sign" as const,
    },
    {
      id: "totalPaidAmount",
      widgetText: "Total Paid(USD)",
      widgetNumber: "$ 0.00",
      iconName: "dollar-sign" as const,
    },
    {
      id: "totalUnpaidAmount",
      widgetText: "Total Unpaid(USD)",
      widgetNumber: "$ 0.00",
      iconName: "dollar-sign" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Widgets widgetData={WidgetData} />
      {/* <div className="flex-grow overflow-hidden">
        <AccountDataTable
          accountsData={accountData}
          userIdWiseUserDetailsMap={userIdWiseUserDetailsMap}
          accountIdWiseAccountNameMap={accountIdWiseAccountNameMap}
        />
      </div> */}
    </div>
  );
}
