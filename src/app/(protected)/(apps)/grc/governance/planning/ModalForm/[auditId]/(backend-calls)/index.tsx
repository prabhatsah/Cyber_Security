import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const fetchFindingsMatchedInstance = async (
  controlPolicyId: any,
  controlObjId: any
) => {
  try {
    var mongoWhereClause = `this.Data.controlObjId == '${controlObjId}' && this.Data.controlId == '${controlPolicyId}' `;
    const findingsInstances = await getMyInstancesV2<any>({
      processName: "Meeting Findings",
      predefinedFilters: { taskName: "Edit Find" },
      mongoWhereClause: mongoWhereClause,
    });

    const findingsInstancesData = Array.isArray(findingsInstances)
      ? findingsInstances.map((e: any) => e.data)
      : [];
    return findingsInstancesData;
  } catch (error) {
    console.error("Error fetching findings data:", error);
  }
};
