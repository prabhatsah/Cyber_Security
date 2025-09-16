import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import FileSystemScanningMainTemplate from "./components/FileSystemScanningMainTemplate";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software";
import { getUserDashboardPlatformUtilData } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { FileSystemConfigData, FileSystemFullInstanceData } from "@/app/FileSystemType";

const fetchPresentUserConfigDetails = async () => {
    const presentUserId = await getCurrentUserId();
    const softwareId = await getCurrentSoftwareId();
    const pentestAdminGroupDetails = await getUserDashboardPlatformUtilData({ softwareId, isGroupNameWiseUserDetailsMap: true, groupNames: ["Pentest Admin"] });
    const pentestAdminUsers = Object.keys(pentestAdminGroupDetails["Pentest Admin"].users);

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

const fetchPresentUserFileSystemScanDetails = async () => {
    const presentUserId = await getCurrentUserId();
    const softwareId = await getCurrentSoftwareId();
    const pentestAdminGroupDetails = await getUserDashboardPlatformUtilData({ softwareId, isGroupNameWiseUserDetailsMap: true, groupNames: ["Pentest Admin"] });
    const pentestAdminUsers = Object.keys(pentestAdminGroupDetails["Pentest Admin"].users);

    const fileSystemScanInstances = await getMyInstancesV2<FileSystemFullInstanceData>({
        processName: "File System Scan",
        predefinedFilters: { taskName: "File System" },
        processVariableFilters: pentestAdminUsers.includes(presentUserId) ? null : { created_by: presentUserId },
        projections: ["Data"],
    });

    let fileSystemScanDataArray: FileSystemFullInstanceData[] = [];
    if (fileSystemScanInstances.length) {
        fileSystemScanDataArray = fileSystemScanInstances.map(eachInstance => eachInstance.data);
    }

    return fileSystemScanDataArray;
}

export default async function FileSystemScanningDashboard() {
    const presentUserConfigDetails: FileSystemConfigData[] = await fetchPresentUserConfigDetails();
    console.log("Fetched Config Details: ", presentUserConfigDetails);

    // const presentUserFileSystemScanDetails: FileSystemFullInstanceData[] = await fetchPresentUserFileSystemScanDetails();
    // console.log("Fetched File System Scan Details: ", presentUserFileSystemScanDetails);

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

