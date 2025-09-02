import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings, List } from "lucide-react";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { getDataForTaskId, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import ProbeTable from "./components/probeList";

interface ProbeData {
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
                <Tabs defaultValue="list" className="">
                    <TabsList className="">
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Probe List
                        </TabsTrigger>
                        <TabsTrigger value="configs" className="flex items-center gap-2">
                            <List className="w-4 h-4" /> Probe Configs
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="configs" className="p-4">
                        {/* Replace with your real component */}
                        <p className="text-gray-700 dark:text-gray-300">
                            Here you can configure probes.
                        </p>
                    </TabsContent>
                    <TabsContent value="list" className="p-4">
                        <ProbeTable probes={ProbeData}></ProbeTable>
                        <p className="text-gray-700 dark:text-gray-300">
                            Here is the list of probes.
                        </p>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
