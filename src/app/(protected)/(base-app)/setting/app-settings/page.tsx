import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getBaseSoftwareId } from "@/ikon/utils/actions/software";
import { getAllRoleForSoftwaresV2 } from "@/ikon/utils/api/roleService";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService";
import AppSettingTable from "./components/appSettingTable";
import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

type UserDetails = {
    userName: string;
    userLogin: string;
    userEmail: string;
    userActive: boolean;
    userId: string;
};

async function SubscribedSoftwareNameMaps() {
    const accountId = await getActiveAccountId();
    return getAllSubscribedSoftwaresForClient({ accountId }) || []; // Ensure it's always an array
}

async function getUserMapForCurrentAccount(parameters = null): Promise<{ [key: string]: UserDetails }> {
    let usersDetailsMap = {};
    try {
        let platformUtilInstances = await getMyInstancesV2({ processName: "User Dashboard Platform Util - All" });
        let taskId = platformUtilInstances[0].taskId;
        usersDetailsMap = await getParameterizedDataForTaskId<{ [key: string]: UserDetails }>({ taskId, parameters });
    } catch (error) {
        console.error(error);
    }
    return usersDetailsMap
}

export default async function AppSettings() {

    const userDetails = await getUserIdWiseUserDetailsMap();
    const activeUserDetails = Object.entries(userDetails).map(([key, value]) => ({
        id: key,
        ...value
    }))
        .filter(item => item.userActive === true)
        .sort((a, b) => a.userName.localeCompare(b.userName));
    let userDetailsArray: UserDetails[] = Object.values(activeUserDetails)
        .map(({ userLogin, userName, userEmail, userActive, userId }) => ({
            userLogin,
            userName,
            userEmail,
            userActive,
            userId
        }));

    let allSubscribedAppsId: string[] = [];
    let appIdWiseAppDetails: Record<string, any> = {}; // Explicitly define type

    const baseSoftwareId = await getBaseSoftwareId();
    const subscribedApps = await SubscribedSoftwareNameMaps();

    if (!Array.isArray(subscribedApps)) {
        console.error("subscribedApps is not an array:", subscribedApps);
        return <div>Error loading app Subscribed App Data</div>;
    }

    subscribedApps
        .filter(e => e?.SOFTWARE_ID && e.SOFTWARE_ID !== baseSoftwareId) // Ensure SOFTWARE_ID exists
        .map(e => {
            allSubscribedAppsId.push(e.SOFTWARE_ID);
            e.displayAppName = e.displayAppName || e.SOFTWARE_NAME;
            e.displayVersion = e.displayVersion || e.SOFTWARE_VERSION;
            appIdWiseAppDetails[e.SOFTWARE_ID] = e;
        });

    let allActiveRoles: any[] = [];

    if (allSubscribedAppsId.length > 0) {
        try {
            const allRoles = await getAllRoleForSoftwaresV2({ softwareIds: allSubscribedAppsId });

            if (Array.isArray(allRoles)) {
                allActiveRoles = allRoles
                    .filter(role => role?.ACTIVE === true && appIdWiseAppDetails[role.SOFTWARE_ID])
                    .map(role => ({
                        ...role,
                        displayAppName: appIdWiseAppDetails[role.SOFTWARE_ID].displayAppName
                    }));
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    // console.log("Active Roles:", allActiveRoles);

    return (
        <>
            <div className="flex flex-col gap-3 overflow-hidden h-full">
                <div>
                    <div className="text-xl font-semibold">App Settings</div>
                    <div>
                        Manage your apps roles and groups.
                    </div>
                </div>
                <div className="grow overflow-hidden">
                    <AppSettingTable data={allActiveRoles} allUserDetails={userDetailsArray} />
                </div>

            </div>
        </>
    );
}