import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export async function getLeadData() {
    const eventDataInstances = await getMyInstancesV2({
        processName: "Event Creation Process",
        predefinedFilters: { taskName: "Event_View" },
        //  mongoWhereClause: `this.Data.Created_User == "e30576c6-9b46-423c-966e-a9ec8d76ac02"`,
        mongoWhereClause: `this.Data.Created_User == "a3544940-dc6a-44f1-8e59-ed0644e0b0ad"`,

    });
    return eventDataInstances
}
