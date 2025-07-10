import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
const startCustomerSupportTicketProcess = async (newTicket: Record<string, any>) => {
    const processId = await mapProcessName({processName: "Customer Support Desk Ticket",});
    await startProcessV2({processId, data: newTicket, processIdentifierFields: "newTicket.ticketNo"});
};

export { startCustomerSupportTicketProcess };