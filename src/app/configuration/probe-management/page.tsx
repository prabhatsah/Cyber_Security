import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings, List, PlusIcon, FilterIcon } from "lucide-react";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { getDataForTaskId, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ProbeTable from "./components/probeList";
import moment from "moment";
import { Button } from "@/components/Button";

type ProbeData = {
    probeDetails: any[]
}

async function getProbeDetails(userAccoutId: string, softwareId: string) {
    let processName = 'Probe Management Process';
    let taskName_ = 'View Probe';
    console.log("Inside Fetching Process : " + processName);
    var predefinedFilters = { "taskName": taskName_ };
    var processVariableFilters = null;
    var taskVariableFilter = null;
    var mongoWhereClause = null;
    var projection = ['Data'];
    var isFetchAllInstances = false;
    let probeInstances = await getMyInstancesV2({
        accountId: userAccoutId, softwareId: softwareId, processName: processName, predefinedFilters: predefinedFilters, processVariableFilters: processVariableFilters,
        taskVariableFilters: taskVariableFilter,
        mongoWhereClause: mongoWhereClause, projections: projection, allInstances: isFetchAllInstances
    });
    console.log("Probe Instances Fetched: ", (probeInstances[0]));
    let taskIdRequired = probeInstances[0].taskId;
    let ProbeData: ProbeData = await getDataForTaskId({ taskId: taskIdRequired, accountId: userAccoutId });
    let probeDetailsArray = [];
    if (ProbeData && ProbeData?.probeDetails && ProbeData.probeDetails.length > 0)
        probeDetailsArray = ProbeData.probeDetails

    for (var i = 0; i < probeDetailsArray.length; i++) {
        var heartbeat = probeDetailsArray[i].LAST_HEARTBEAT;

        if (heartbeat == null) {
            probeDetailsArray[i].ALIVE = false;
            probeDetailsArray[i].LAST_HEARTBEAT = "No Heartbeat";
        } else {
            var heartbeatTime = moment(probeDetailsArray[i].LAST_HEARTBEAT, "YYYY-MM-DDTHH:mm:ss.SSSZZ");
            var now = moment(new Date());
            var diff = now.diff(heartbeatTime, "seconds");
            if (diff < 30) {
                probeDetailsArray[i].ALIVE = true;
            } else {
                probeDetailsArray[i].ALIVE = false;
            }
            probeDetailsArray[i].LAST_HEARTBEAT = heartbeatTime.format("YYYY-MM-DD HH:mm:ss");
        }
    }

    console.log("Probe Details Array: ", probeDetailsArray);

    return probeDetailsArray;
}


export default async function probeMainPage() {

    let userAccoutId = await getActiveAccountId();
    let softwareId = await getCurrentSoftwareId();
    console.log("Active Account ID in Probe Management Page: " + userAccoutId, "Software ID: " + softwareId);

    let ProbeData = await getProbeDetails(userAccoutId, softwareId);

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Configuration",
                }}
            />
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 1,
                    title: "Probe Management",
                    href: "/configuration/pentest-management",
                }}
            />
            <div className="flex-1 flex flex-col relative">

                <div className="flex items-center justify-between px-4">
                    <h1 className="mb-2">Probe List</h1>
                    <div className="flex gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <PlusIcon className="w-4 h-4 " />
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <FilterIcon className="w-4 h-4 " />
                        </Button>
                    </div>
                </div>
                <ProbeTable probes={ProbeData}></ProbeTable>
            </div>
        </>
    );
}
