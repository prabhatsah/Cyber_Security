'use client'
import "../lead-details.css";
import { TabArray } from "@/ikon/components/tabs/type";
import TabContainer from "@/ikon/components/tabs";
import { useRouter } from "next/navigation";
import LeadActivityLog from "./lead-activity-log";

export default function TabComponentLeadDetails({
  children,
  leadIdentifier,

}: {
  children?: React.ReactNode
  leadIdentifier: string;
}) {

  const tabArray: TabArray[] = [
    {
      tabName: "Events",
      tabId: "event",
      default: true,
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

    },
    {
      tabName: "Product Details",
      tabId: "product-details",
      default: false,
    },
    {
      tabName: "Point of Interest",
      tabId: "point-of-interest",
      default: false,
    },
  ];
  const router = useRouter();
  function onTabChange(tabId: string) {
    router.push(`/sales-crm/lead/details/${leadIdentifier}/${tabId}`)
  }
  return (
    <>
      <TabContainer
        tabArray={tabArray}
        tabListClass=""
        tabListButtonClass="text-md"
        headerEndComponent={<LeadActivityLog leadIdentifier={leadIdentifier} />}
        onTabChange={onTabChange}
        isSeperatePage={true}
        tabContentClass="h-full"
      >
        {children}
      </TabContainer>
    </>
  );
}
