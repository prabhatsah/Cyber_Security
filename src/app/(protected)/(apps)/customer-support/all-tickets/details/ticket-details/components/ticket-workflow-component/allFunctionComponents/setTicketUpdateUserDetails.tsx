import { getProfileData } from "@/ikon/utils/actions/auth";

export interface TicketDetails {
    ResponseDetails?: { userId: string; dateTime: Date }[];
    assigneeId: string;
    assigneeName: string;
    [key: string]: any;
}

export const setTicketUpdateUserDetails = async (state: string, ticketDetails: TicketDetails): Promise<TicketDetails> => {
    const dateTime = new Date();
  const profileData = await getProfileData();
  const userId = profileData.USER_ID;
  const userName = profileData.USER_NAME;
    if (!ticketDetails.ResponseDetails) {
        ticketDetails.ResponseDetails = [];

        const tempObj = {
            userId:userId,
            dateTime: dateTime
        };

        ticketDetails.ResponseDetails.push(tempObj);
    }
console.log("ticketDetails.ResponseDetails.push(tempObj)", ticketDetails)
    state = getSpecificIndexWord(state, 1);
    const stateKey = `${state}Details`;

    const tempStateUpdateDetails = {
        userId: ticketDetails.assigneeId,
        userName: ticketDetails.assigneeName,
        dateTime: dateTime
    };

    if (!ticketDetails[stateKey]) {
        ticketDetails[stateKey] = [];
    }
    ticketDetails[stateKey].push(tempStateUpdateDetails);
console.log("from setTicketUpdateUserDetails>>>>>>>>>>>>>>>>>>>>>>>>>>>" , ticketDetails)
    return ticketDetails;
};
export const resetTicketPastStateList = (transition: string, ticketDetails: TicketDetails): TicketDetails => {
    if (transition === "Reopen from Resolve" && ticketDetails.pastStateList) {
        ticketDetails.pastStateList.splice(3);
    }
    console.log("from resetTicketPastStateList>>>>>>>>>>>>>>>>>>>>>>>>>>>" , ticketDetails)
    return ticketDetails;
};
export const getSpecificIndexWord = (element: string, index: number): string => {
    const words = element.split(" ");
    return words.length > index ? words[index] : element;
};
