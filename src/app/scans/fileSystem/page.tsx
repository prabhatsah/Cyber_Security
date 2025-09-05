import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import FileSystemScanningMainTemplate from "./components/FileSystemScanningMainTemplate";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { FileSystemConfigData } from "@/app/globalType";

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
        projections: ["Data.config_id", "Data.config_name", "Data.probe_id", "Data.probe_name"],
    });

    let configDataArray: FileSystemConfigData[] = [];
    if (configInstances.length) {
        configDataArray = configInstances.map(eachInstance => eachInstance.data);
    }

    return configDataArray;
}

export default async function FileSystemScanningDashboard() {
    const presentUserConfigDetails: FileSystemConfigData[] = await fetchPresentUserConfigDetails();
    console.log("Fetched Config Details: ", presentUserConfigDetails);

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Scans",
                    href: "/scans",
                }}
            />
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 1,
                    title: "File System Scanning",
                    href: "/scans/fileSystem",
                }}
            />

            <FileSystemScanningMainTemplate fileSystemConfigDetails={presentUserConfigDetails} />
        </>
    );
}
