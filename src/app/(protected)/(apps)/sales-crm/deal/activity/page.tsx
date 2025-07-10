import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ActivityDataTable from "./components/activity-data-table";

export default async function LeadActivity() {

  const softwareId = await getSoftwareIdByNameVersion("Sales CRM", "1")
  const accountId = await getActiveAccountId()

  const activityLogsData = await getMyInstancesV2({
    "softwareId": softwareId,
    "processName": "Activity Logs",
    "accountId": accountId,
    "predefinedFilters": { taskName: "Activity" },
    "mongoWhereClause": `this.Data.source == "Deal"`
  })

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <ActivityDataTable activityLogsData={activityLogsData} />
    </div>
  );
}
