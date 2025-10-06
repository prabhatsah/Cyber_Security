import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { FileSystemConfigData } from "@/app/FileSystemType";
import AddFileSystemBtnWithFormModal from "./components/AddFileSystemBtnWithFormModal";
import EachFileSystemWidget from "./components/EachFileSystemWidget";
import { createUserMap } from "../../utils/UserDetailsUtils";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";

const fetchPresentUserConfigDetails = async () => {
    const presentUserId = await getCurrentUserId();
    const softwareId = await getCurrentSoftwareId();
    const pentestAdminGroupDetails = await getUserDashboardPlatformUtilData({ softwareId, isGroupNameWiseUserDetailsMap: true, groupNames: ["Pentest Admin"] });
    const pentestAdminUsers = Object.keys(pentestAdminGroupDetails["Pentest Admin"].users);

    console.log("Pentest Admin Users: ", pentestAdminUsers);

    const configInstances = await getMyInstancesV2<FileSystemConfigData>({
        processName: "File System Configuration",
        predefinedFilters: { taskName: "View Config Details" },
        processVariableFilters: pentestAdminUsers.includes(presentUserId) ? null : { created_by: presentUserId },
        projections: ["Data"],
    });

    let configDataArray: FileSystemConfigData[] = [];
    if (configInstances.length) {
        configDataArray = configInstances.map(eachInstance => eachInstance.data);
    }

    return configDataArray;
}

export default async function FileSystemConfig() {
    const presentUserConfigDetails: FileSystemConfigData[] = await fetchPresentUserConfigDetails();
    console.log("Fetched Config Details: ", presentUserConfigDetails);

    const userIdNameMap: { value: string; label: string }[] = await createUserMap();

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
                    title: "File Systems",
                    href: "/configuration/file-systems",
                }}
            />

            <div className="flex-1">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-blue-400 mb-1">
                                File System Configurations
                                <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-1 rounded-full">{presentUserConfigDetails.length}</span>
                            </h2>
                        </div>

                        <AddFileSystemBtnWithFormModal />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {presentUserConfigDetails.map((config) => (
                            <EachFileSystemWidget key={config.config_id} fileSystemConfigDetails={config} userIdNameMap={userIdNameMap} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}