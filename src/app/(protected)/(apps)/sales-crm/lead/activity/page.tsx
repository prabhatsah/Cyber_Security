import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ActivityDataTable from "./components/activity-data-table";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { ActivityLog } from "../../components/type";

export default async function LeadActivity() {

  const softwareId = await getSoftwareIdByNameVersion("Sales CRM", "1")
  const accountId = await getActiveAccountId()

  const activityLogsIns = await getMyInstancesV2<ActivityLog>({ "softwareId": softwareId, processName: "Activity Logs", "accountId": accountId, predefinedFilters: { taskName: "Activity" }, mongoWhereClause: `this.Data.source == "Leads"` })
  const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
  const activityLogsData = activityLogsIns.map((activityLog) => activityLog.data)
  return (
    <div className="w-full h-full">
      <ActivityDataTable activityLogsData={activityLogsData} userIdWiseUserDetailsMap={userIdWiseUserDetailsMap} />
    </div>
  );
}
