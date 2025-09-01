import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { CloudCog, FolderCog, GlobeLock, Network, TabletSmartphone } from "lucide-react";
import { fetchData } from "@/utils/api";
import EachPenTestTypeWidget from "../pentest-configs/components/EachPenTestTypeWidget";
import { secureGaurdService } from "@/utils/secureGaurdService";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings, List } from "lucide-react";

export async function getPententCount(pentestType: string) {
    const currentRole = (await secureGaurdService.userDetails.getUserRolesForthisSoftware())[0]?.ROLE_NAME;
    const currentAccountId = await secureGaurdService.userDetails.getAccountId()
    const userId = (await getLoggedInUserProfile()).USER_ID;
    let pentestData = [];
    if (currentRole == "Pentest Admin")
        pentestData = await fetchData("pentest_data", "last_scan_on", [{ table: "pentest_data", column: "type", value: pentestType }, { table: "user_membership", column: "generatedby", value: currentAccountId }], null, "pentest_data.pentestid");
    else
        pentestData = await fetchData("pentest_data", "last_scan_on", [{ table: "user_membership", column: "generatedby", value: currentAccountId }, { table: "user_membership", column: "userid", value: userId }], null, "pentest_data.pentestid");

    const pentestCount = pentestData.data.length
    return pentestCount;
}


export default function probeMainPage() {

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
                    {/* Tab headers */}
                    <TabsList className="">
                        <TabsTrigger value="list" className="flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Probe List
                        </TabsTrigger>
                        <TabsTrigger value="configs" className="flex items-center gap-2">
                            <List className="w-4 h-4" /> Probe Configs
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab content */}
                    <TabsContent value="configs" className="p-4">
                        {/* Replace with your real component */}
                        <p className="text-gray-700 dark:text-gray-300">
                            Here you can configure probes.
                        </p>
                    </TabsContent>

                    <TabsContent value="list" className="p-4">
                        {/* Replace with your real component */}
                        <p className="text-gray-700 dark:text-gray-300">
                            Here is the list of probes.
                        </p>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
