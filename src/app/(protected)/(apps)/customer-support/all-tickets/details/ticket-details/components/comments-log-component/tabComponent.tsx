"use client";

import { TabArray } from "@/ikon/components/tabs/type";
import TabContainer from "@/ikon/components/tabs";
import { useRouter } from "next/navigation";
import EachTicketComments from "./comments/page";
import EachTicketActivityLog from "./activityLog-component/page";
import { TicketDetails } from "../ticket-workflow-component/allFunctionComponents/setTicketUpdateUserDetails";



export default function TabComponentTicketDetails({
  children,
  ticketId,
  isFirst,
  ticketDetails
  // ticketDetails
}: {
  children?: React.ReactNode;
  ticketId: string;
  isFirst?:boolean;
  ticketDetails: TicketDetails;
 // ticketDetails: TicketDetails;
}) {

  console.log("initialTicketDetailsinitialTicketDetails---", ticketDetails)

  let loadPage = "load"
  const tabArray: TabArray[] = [
    { tabName: "Comments", tabId: "comments", default: true ,tabContent: <EachTicketComments  loadPage={loadPage} ticketNo={ticketId} initialTicketDetails={ticketDetails}/>},
    { tabName: "Activity Logs", tabId: "activityLog", default: false ,tabContent: <EachTicketActivityLog ticketNo={ticketId} initialTicketDetails={ticketDetails}/>},
  ];
  
  const router = useRouter();
  
  function onTabChange(tabId: string) {
    router.push(`/customer-support/all-tickets/details/${ticketId}/${tabId}`);
  }

  return (
    <div className="flex flex-col h-full"> {/* Ensure it stretches */}
      
      <TabContainer
        tabArray={tabArray}
        tabListClass=""
        tabListButtonClass="text-md"
      />
    </div>
  );
}
