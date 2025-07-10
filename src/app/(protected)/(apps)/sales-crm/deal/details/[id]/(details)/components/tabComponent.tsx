'use client'

import { TabArray } from "@/ikon/components/tabs/type";
import TabContainer from "@/ikon/components/tabs";
import { useRouter } from "next/navigation";
import DealActivityLog from "./deal-activity-log";

export default function TabComponentDealDetails({
  children,
  dealIdentifier,

}: {
  children?: React.ReactNode
  dealIdentifier: string;
}) {

  const tabArray: TabArray[] = [
    {
      tabName: "Products",
      tabId: "products",
      default: true,
    },
    {
      tabName: "Events",
      tabId: "event",
      default: false,
    },
    {
      tabName: "Notes",
      tabId: "note",
      default: false,
    },
    {
      tabName: "Contacts",
      tabId: "contact",
      default: false,
    }
  ];
  const router = useRouter();
  function onTabChange(tabId: string) {
    router.push(`/sales-crm/deal/details/${dealIdentifier}/${tabId}`)
  }
  return (
    <>
      <TabContainer
        tabArray={tabArray}
        tabListClass=""
        tabListButtonClass="text-md"
        headerEndComponent={<DealActivityLog dealIdentifier={dealIdentifier} />}
        onTabChange={onTabChange}
        isSeperatePage={true}
      >
        {children}
      </TabContainer>
    </>
  );
}
