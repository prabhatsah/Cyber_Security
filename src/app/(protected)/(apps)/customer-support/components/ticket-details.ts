import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { TicketData } from "../components/type";
import { TicketsDetails } from "../components/type";
import { getProfileData } from "@/ikon/utils/actions/auth";

export default async function fetchTicketDetails(): Promise<TicketsDetails> {


    let sortedTicketList = [];
    let priorityWiseTicket = [];
    let unAssignedCritical = [], unAssignedHigh = [], unAssignedMedium = [], unAssignedLow = [];
    let assignedCritical = [], assignedHigh=[], assignedMedium = [], assignedLow = [];
    let remainingCritical = [], remainingHigh = [],remainingMedium = [], remainingLow = [];
    let remainingCritical_Hold = [], remainingHigh_Hold = [], remainingMedium_Hold = [], remainingLow_Hold = [];
    let remainingCritical_Restoration = [], remainingHigh_Restoration = [], remainingMedium_Restoration = [], remainingLow_Restoration = [];
    let remainingCritical_Resolved = [], remainingHigh_Resolved = [], remainingMedium_Resolved = [], remainingLow_Resolved = [];
    let remainingCritical_Cancelled = [], remainingHigh_Cancelled = [], remainingMedium_Cancelled = [], remainingLow_Cancelled = [];
    let remainingCritical_Closed = [], remainingHigh_Closed = [], remainingMedium_Closed = [], remainingLow_Closed = [];


    const ticketsInstanceData = await getMyInstancesV2<TicketData>({
      processName: "Customer Support Desk Ticket",
    //   projections: [
    //     "Data.subject",
    //     "Data.ticketNo",
    //     "Data.priority",
    //     "Data.dateCreated",
    //     "Data.issueDate",
    //     "Data.status",
    //     "Data.assigneeName",
    //     "Data.accountName",
    //     "Data.assigneeId",
    //     "Data.type",
    //     "Data.accountId",
    //     'Data.requestedFrom',
    //     'Data.portalName',
    //     'Data.requestedFrom',
    //     "Data.createdByBot",
    //   ],
    projections:["Data"]
    });
  
     priorityWiseTicket = ticketsInstanceData.map((e: any) => e.data);
  
     const profileData = await getProfileData();
     const userId = profileData.USER_ID
     // Categorize tickets
  const myTickets = priorityWiseTicket.filter(ticket => ticket.assigneeId === userId);
  const totalTickets = priorityWiseTicket.length;
  const unassignedTickets = priorityWiseTicket.filter(ticket => !ticket.assigneeId);


    for(var i=0; i<priorityWiseTicket.length; i++){
        //UN ASSIGNED TICKET INFO
        var data = priorityWiseTicket[i];
        if(!data.hasOwnProperty("assigneeId")){
            var priority = data["priority"];
            if(priority == "Low"){
                unAssignedLow.push(data);
            }
            else if(priority == "Medium"){
                unAssignedMedium.push(data);
            }
            else if(priority == "High"){
                unAssignedHigh.push(data);
            }
            else if(priority == "Critical"){
                unAssignedCritical.push(data)
            }
        }
        //ASSIGNED-New TICKET INFO
        else if(data.hasOwnProperty("assigneeId") && data["status"] == "New"){
          var priority = data["priority"];
            if(priority == "Low"){
                assignedLow.push(data);
            }
            else if(priority == "Medium"){
                assignedMedium.push(data);
            }
            else if(priority == "High"){
                assignedHigh.push(data);
            }
            else if(priority == "Critical"){
                assignedCritical.push(data);
            }
        }
        else if(data.hasOwnProperty("assigneeId") && data["status"] == "In Progress"){
          var priority = data["priority"];
            if(priority == "Low"){
                remainingLow.push(data);
            }
            else if(priority == "Medium"){
                remainingMedium.push(data);
            }
            else if(priority == "High"){
                remainingHigh.push(data);
            }
            else if(priority == "Critical"){
                remainingCritical.push(data);
            }
        }
        else if(data.hasOwnProperty("assigneeId") && data["status"] == "On Hold"){
          var priority=data["priority"];
            if(priority == "Low"){
                remainingLow_Hold.push(data);
            }
            else if(priority == "Medium"){
                remainingMedium_Hold.push(data);
            }
            else if(priority == "High"){
                remainingHigh_Hold.push(data);
            }
            else if(priority == "Critical"){
                remainingCritical_Hold.push(data);
            }
        }
        else if(data.hasOwnProperty("assigneeId") && data["status"] == "Restoration"){
          var priority = data["priority"];
            if(priority == "Low"){
                remainingLow_Restoration.push(data);
            }
            else if(priority == "Medium"){
                remainingMedium_Restoration.push(data);
            }
            else if(priority == "High"){
                remainingHigh_Restoration.push(data);
            }
            else if(priority == "Critical"){
                remainingCritical_Restoration.push(data);
            }
        }
        else if(data.hasOwnProperty("assigneeId") && data["status"] == "Resolved"){
          var priority = data["priority"];
            if(priority == "Low"){
                remainingLow_Resolved.push(data);
            }
            else if(priority == "Medium"){
                remainingMedium_Resolved.push(data);
            }
            else if(priority == "High"){
                remainingHigh_Resolved.push(data);
            }
            else if(priority == "Critical"){
                remainingCritical_Resolved.push(data);
            }
        }
        else if(data.hasOwnProperty("assigneeId") && data["status"]=="Cancelled"){
          var priority = data["priority"];
            if(priority == "Low"){
                remainingLow_Cancelled.push(data);
            }
            else if(priority == "Medium"){
                remainingMedium_Cancelled.push(data);
            }
            else if(priority == "High"){
                remainingHigh_Cancelled.push(data);
            }
            else if(priority == "Critical"){
                remainingCritical_Cancelled.push(data);
            }
        }
        else if(data.hasOwnProperty("assigneeId") && data["status"] == "Closed"){
          var priority = data["priority"];
            if(priority == "Low"){
                remainingLow_Closed.push(data);
            }
            else if(priority == "Medium"){
                remainingMedium_Closed.push(data);
            }
            else if(priority == "High"){
                remainingHigh_Closed.push(data);
            }
            else if(priority == "Critical"){
                remainingCritical_Closed.push(data);
            }
        }
    }
    const priorityWiseTicketInfo = [...unAssignedCritical,...unAssignedHigh,...unAssignedMedium,...unAssignedLow,...assignedCritical,...assignedHigh,...assignedMedium,...assignedLow,...remainingCritical,...remainingHigh,...remainingMedium,...remainingLow,...remainingCritical_Hold,...remainingHigh_Hold,...remainingMedium_Hold,...remainingLow_Hold,...remainingCritical_Restoration,...remainingHigh_Restoration,...remainingMedium_Restoration,...remainingLow_Restoration,...remainingCritical_Resolved,...remainingHigh_Resolved,...remainingMedium_Resolved,...remainingLow_Resolved,...remainingCritical_Cancelled,...remainingHigh_Cancelled,...remainingMedium_Cancelled,...remainingLow_Cancelled,...remainingCritical_Closed,...remainingHigh_Closed,...remainingMedium_Closed,...remainingLow_Closed];
  
    // Separate tickets into open and closed
    const closedTickets = priorityWiseTicketInfo.filter(ticket => ticket.status === "Closed");
    const openTickets = priorityWiseTicketInfo.filter(ticket => ticket.status !== "Closed");
    const groupByProperty = (array: TicketData[], property: keyof TicketData) => {
        return array.reduce((acc, ticket) => {
          if (ticket[property]) {
            const key = ticket[property];
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(ticket);
          }
          return acc;
        }, {} as Record<string, TicketData[]>);
      };
      
      // Get grouped data (each key contains an array of objects)
      const typeGrouped = groupByProperty(priorityWiseTicketInfo, "type");
      const priorityGrouped = groupByProperty(priorityWiseTicketInfo, "priority");
      const statusGrouped = groupByProperty(priorityWiseTicketInfo, "status");
      const accountGrouped = groupByProperty(priorityWiseTicketInfo, "accountName");
      const infraGrouped = groupByProperty(priorityWiseTicketInfo, "serverName");
      
      // Convert to chart data format
      const typeChartData = Object.entries(typeGrouped).map(([label, items]) => ({ label, value: items.length }));
      const priorityChartData = Object.entries(priorityGrouped).map(([label, items]) => ({ label, value: items.length }));
      const statusChartData = Object.entries(statusGrouped).map(([label, items]) => ({ label, value: items.length }));
      const accountChartData = Object.entries(accountGrouped).map(([label, items]) => ({ label, value: items.length }));
      const infraChartData = Object.entries(infraGrouped).map(([label, items]) => ({ label, value: items.length }));

console.log("hi")
console.log(typeChartData)
console.log(typeGrouped)
    return { 
        openTickets,
        closedTickets,
        priorityWiseTicketInfo,  
        myTickets : myTickets.length,
        completedTicketsCount: closedTickets.length,
        totalTicketsCount: totalTickets,
        openTicketsCount: openTickets.length,
        unassignedTicketsCount: unassignedTickets.length, 
        typeChartData,
        priorityChartData,
        statusChartData,
        accountChartData,
        infraChartData,
        typeGrouped,
        infraGrouped,
        accountGrouped,
        statusGrouped,
        priorityGrouped,





        // typeCounts,      // Count of Bugs, Incident, Feature, Service Request
        // priorityCounts,  // Count of Critical, High, Medium, Low
        // statusCounts,
        // accountCounts,
        // infrastructureCounts  
    };
  }