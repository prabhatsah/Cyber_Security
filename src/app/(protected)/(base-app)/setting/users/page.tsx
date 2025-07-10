import React from 'react'
import UsersTable from './components/usersTable';
import { getBaseSoftwareId } from '@/ikon/utils/actions/software';
import { getActiveAccountId } from '@/ikon/utils/actions/account';
import { getAllSubscribedSoftwaresForClient } from '@/ikon/utils/api/softwareService';
import { getAllRoleForSoftwaresV2 } from '@/ikon/utils/api/roleService';
import { getUserDetailsMap } from './components/getUserDetailsMap';

async function SubscribedSoftwareNameMaps() {
    const accountId = await getActiveAccountId();
    return getAllSubscribedSoftwaresForClient({ accountId }) || []; // Ensure it's always an array
}

export default async function UserPage() {
    const userDetailsMap = await getUserDetailsMap();
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
    return (
        <>
            <div className="flex flex-col gap-3 overflow-hidden h-full">
                <div>
                    <div className="text-xl font-semibold">Users</div>
                    <div>
                        Add or edit user and assign them in your app
                    </div>
                </div>
                <div className="grow overflow-hidden">
                    <UsersTable usersDetails={userDetailsMap} membershipDetails={allActiveRoles}/>
                </div>
            </div>
        </>
    )
}