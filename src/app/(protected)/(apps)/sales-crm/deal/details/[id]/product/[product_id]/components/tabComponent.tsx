'use client'

import { TabArray } from "@/ikon/components/tabs/type";
import TabContainer from "@/ikon/components/tabs";
import { useRouter } from "next/navigation";
import ProductActivityLog from "./product-activity-log";
//import DealActivityLog from "./deal-activity-log";
//import LeadActivityLog from "./lead-activity-log";

export default function TabComponentProductDetails({
  children,
  productIdentifier,
  dealIdentifier

}: {
  children?: React.ReactNode
  productIdentifier: string;
  dealIdentifier: string;
}) {

  const tabArray: TabArray[] = [
    {
      tabName: "Schedule",
      tabId: "schedule",
      default: true,
    },
    {
      tabName: "Resources",
      tabId: "resource",
      default: false,
    },
    {
      tabName: "Expenses",
      tabId: "expense",
      default: false,
    },
    {
      tabName: "Pricing",
      tabId: "pricing",
      default: false,
    }
  ];
  const router = useRouter();
  function onTabChange(tabId: string) {
    router.push(`./${tabId}`)
  }
  return (
    <>
      <TabContainer
        tabArray={tabArray}
        tabListClass="py-6 px-3"
        tabListButtonClass="text-md"
        headerEndComponent={<ProductActivityLog productIdentifier={productIdentifier} />}
        onTabChange={onTabChange}
        isSeperatePage={true}

      >
        {children}
      </TabContainer>
    </>
  );
}
