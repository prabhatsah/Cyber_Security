import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import NetworkPentestWidget from "./components/NetworkPentestWidget";
import NoSavedPentestTemplate from "./components/NoSavedPentestTemplate";
import { NetworkPentestFullInstanceData } from "../../NetworkPentestType";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { createUserMap } from "@/app/utils/UserDetailsUtils";


const fetchPresentUserConfigDetails = async () => {
    const presentUserId = await getCurrentUserId();
    const softwareId = await getCurrentSoftwareId();
    const pentestAdminGroupDetails = await getUserDashboardPlatformUtilData({ softwareId, isGroupNameWiseUserDetailsMap: true, groupNames: ["Pentest Admin"] });
    const pentestAdminUsers = Object.keys(pentestAdminGroupDetails["Pentest Admin"].users);

    console.log("Pentest Admin Users: ", pentestAdminUsers);

    const configInstances = await getMyInstancesV2<NetworkPentestFullInstanceData>({
        processName: "Network Pentest",
        predefinedFilters: { taskName: "Pentest Details View" },
        processVariableFilters: pentestAdminUsers.includes(presentUserId) ? null : { created_by_id: presentUserId },
        projections: ["Data"],
    });

    let configDataArray: NetworkPentestFullInstanceData[] = [];
    if (configInstances.length) {
        configDataArray = configInstances.map(eachInstance => eachInstance.data);
    }

    return configDataArray;
}

export default async function NetworkPenetrationTesting() {
    const presentUserConfigDetails: NetworkPentestFullInstanceData[] = await fetchPresentUserConfigDetails();
    console.log("Fetched Config Details: ", presentUserConfigDetails);

    const userIdNameMap: { value: string; label: string }[] = await createUserMap();

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Penetration Testing",
                    href: "/pen-test",
                }}
            />
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 1,
                    title: "Network Penetration Testing",
                    href: "/pen-test/network-pen-test",
                }}
            />

            <div>
                <div className='flex items-center justify-between mb-4'>
                    <div className="flex items-center space-x-2">
                        <h3 className="text-widgetHeader text-primary">
                            {presentUserConfigDetails.length > 1 ? `Configured Penetration Tests` : `Configured Penetration Test`}
                        </h3>
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
                            {presentUserConfigDetails.length}
                        </span>
                    </div>
                    {/* <AddPentestBtnWithFormModal /> */}
                </div>
                {presentUserConfigDetails.length === 0 ? <NoSavedPentestTemplate /> :
                    <NetworkPentestWidget allPentestWidgetData={presentUserConfigDetails} userIdNameMap={userIdNameMap} />}
            </div>
        </>
    );
}