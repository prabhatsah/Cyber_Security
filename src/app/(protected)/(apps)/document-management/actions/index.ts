
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2, invokeAction, startProcessV2, mapProcessName, invokeTaskScript } from "@/ikon/utils/api/processRuntimeService";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { toast } from "sonner";
import { getTicket } from '@/ikon/utils/actions/auth';
import { getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import { format } from 'date-fns';
import { da } from "date-fns/locale";

// let userId: any = "user_id";
// export let folderNameSearchMap: any = [];

const uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
// const init = async function () {
//     const profileData = await getProfileData();
//     let userId = profileData.USER_ID;
//     // console.log("userId++++++++++++", userId);
// }
export const getFolderNameSearchMap = async function () {
    let folderNameSearchMap = [];
    const projections = ["Data"];
    const taskNameIdentifier = { "taskName": "Viewer Access" };
    const fileMangaerInstances = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
        accountId: await getActiveAccountId(),
        processName: "Folder Manager - DM",
        projections: projections,
        predefinedFilters: taskNameIdentifier
    });

    for (var i = 0; i < fileMangaerInstances.length; i++) {
        folderNameSearchMap.push(fileMangaerInstances[i].data);
    }
    return folderNameSearchMap;
}

export const renderContentForSideMenu = async function (folderIdentifierType: string | null, folderIdentifier: string): Promise<unknown> {
    // await init();
    await getUserMapForCurrentAccount({ groups: ["Document Management User"] });
    let ref = {
        current_folder_identifier: folderIdentifier,
        currently_SelectedDocument: folderIdentifier,
        currentlySelectedTab: folderIdentifier,
        userSpecificData: {}
    };
    await getFileMangerListData(ref);

    // Fetch data for the data table
    const dataObject = await dataObjectForDataTable(ref, folderIdentifierType);
    return dataObject;
};
export const showFolderAndFileForSelectedFolder = async function (folder_identifier: string) {
    let ref = {
        current_folder_identifier: folder_identifier,
        currently_SelectedDocument: folder_identifier,
        currentlySelectedTab: folder_identifier,
        userSpecificData: {}
    };
    await getFileMangerListData(ref);
    const isSpecialFolder = ['my-drive', 'starred', 'trash', 'shared-with-me', 'storage'].includes(folder_identifier);
    const currentFolderIdentifier = folder_identifier;
    const folderIdentifierForDataTable = isSpecialFolder ? null : folder_identifier;

    ref.current_folder_identifier = currentFolderIdentifier;
    ref.currently_SelectedDocument = currentFolderIdentifier;


    const dataObject = await dataObjectForDataTable(ref, folderIdentifierForDataTable);
    return dataObject;
};


const dataObjectForDataTable = async function (ref: any, folder_identifier: string | null) {
    // const { globalData, setGlobalData } = useGlobalData();
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    // console.log("userIdWiseUserDetailsMap", userIdWiseUserDetailsMap);
    return new Promise(async (resolve, reject) => {
        try {
            let fileArray = [];
            let folderArray = [];

            if (ref.current_folder_identifier === 'shared-with-me') {
                fileArray = await getDataForSharedWithMeFiles();
                folderArray = await getDataForSharedWithMe();
            } else {
                folderArray = await getDataFromFolderProcess(ref, folder_identifier) as any[];
                fileArray = await getDataFromFileProcess(ref, folder_identifier) as any[];
            }

            fileArray = fileArray || [];
            folderArray = folderArray || [];

            const data = [...fileArray, ...folderArray];

            const dataObject = data.map(item => {
                // console.log(item);
                const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
                const formattedDate = new Date(item.data.updatedOn).toLocaleDateString('en-US', dateOptions);
                const ownerName = userIdWiseUserDetailsMap[item.data.createdBy]?.userName || "n/a";
                // const ownerName = Globals.UserIdWiseUserDetailsMap[item.data.createdBy]?.userName || "n/a";
                if (item.data.type === "folder" || item.data.folder_identifier) {
                    return {
                        name: item.data.folderName,
                        owner: ownerName,
                        // owner: "n/a",
                        last_modified: formattedDate,
                        updatedOn: item.data.updatedOn,
                        size: null,
                        folderId: item.data.folder_identifier,
                        folder_identifier: item.data.folder_identifier,
                        type: "folder",
                        resourceId: ""
                    };
                } else {
                    return {
                        name: item.data.uploadResourceDetails[0].fileName,
                        owner: ownerName,
                        // owner: "n/a",
                        last_modified: formattedDate,
                        updatedOn: item.data.updatedOn,
                        size: item.data.uploadResourceDetails[0].resourceSize,
                        folderId: "",
                        type: item.data.uploadResourceDetails[0].fileNameExtension,
                        resourceId: item.data.uploadResourceDetails[0].resourceId,
                        resourceName: item.data.uploadResourceDetails[0].resourceName,
                        resourceType: item.data.uploadResourceDetails[0].resourceType,
                        resource_identifier: item.data.resource_identifier
                    };
                }
            });

            // console.log(dataObject);
            resolve(dataObject);
        } catch (error) {
            console.error('Error in dataObjectForDataTable:', error);
            reject(error);
        }
    });
};


const getDataFromFolderProcess = async function (ref: any, folder_identifier: string | null) {
    // var ref = Globals.GlobalAPI.PreLoader1666205644726;
    // const { globalData, setGlobalData } = useGlobalData();
    const profileData = await getProfileData();
    const userId = profileData.USER_ID;
    var taskNameIdentifier: any = null;
    var isInTrash: boolean = false;
    if (folder_identifier == null) {
        if (ref.current_folder_identifier == 'starred') {
            var mongoclauseForFolderProcess = getWhereClauseToGetStarredFolder(ref, 'folder', 'folder_identifier');
            taskNameIdentifier = { "taskNames": ["Owner Access", "Editor Access", "Viewer Access"] };
        } else if (ref.current_folder_identifier == 'my-drive') {
            taskNameIdentifier = { "taskName": "Owner Access" };
            var mongoclauseForFolderProcess = "this.Data.parentId ==" + null;
        } else if (ref.current_folder_identifier == 'shared-with-me') {
            taskNameIdentifier = { "taskNames": ["Owner Access", "Viewer Access"] };
            var mongoclauseForFolderProcess = "";
        } else if (ref.current_folder_identifier == 'trash') {
            taskNameIdentifier = { "taskName": "Deleted Resource" };
            var mongoclauseForFolderProcess = "this.Data.extraDetails.wasSelectedAndDeleted == true";
            isInTrash = true;
        } else {
            var mongoclauseForFolderProcess = "this.Data.parentId == " + folder_identifier;
        }
    } else {
        var mongoclauseForFolderProcess = "this.Data.parentId == '" + folder_identifier + "'";
    }
    return new Promise(async (resolve, reject) => {
        try {
            const projections = ["Data"];
            const data: any = await getMyInstancesV2({
                softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
                accountId: await getActiveAccountId(),
                processName: "Folder Manager - DM",
                mongoWhereClause: mongoclauseForFolderProcess,
                projections: projections,
                predefinedFilters: taskNameIdentifier,
            });
            var folderArryIns = data;
            // console.log(data);
            // var folderArryIns = data.filter((item: any) => item.data.createdBy === userId);
            // console.log(folderArryIns);
            let existingFolder = [];
            let existingFolderIdentifiers: any[] = [];
            if (folderArryIns) {
                for (let i in folderArryIns) {
                    if (!existingFolderIdentifiers.includes((folderArryIns[i] as any).data.folder_identifier)) {
                        existingFolder.push(folderArryIns[i]);
                        existingFolderIdentifiers.push((folderArryIns[i] as any).data.folder_identifier);
                        // ref.fileMangerMap[folderArryIns[i].data.folder_identifier] = folderArryIns[i].data;
                    }
                }

                // console.log(existingFolder);

            }
            // .folderItems = arguments[0];

            resolve(existingFolder);

            // return data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    });
}

const getDataFromFileProcess = async function (ref: any, folder_identifier: string | null) {
    const profileData = await getProfileData();
    const userId = profileData.USER_ID;

    var taskNameIdentifier: any = null;
    var isInTrash: boolean = false;
    var mongoclauseForFileProcess: any;
    if (ref.current_folder_identifier == "storage") {
        folder_identifier = null;
    }
    if (folder_identifier == null) {
        if (ref.current_folder_identifier == 'starred') {
            mongoclauseForFileProcess = getWhereClauseToGetStarredFolder(ref, 'file', 'resource_identifier');
            // taskNameIdentifier = {"taskName" : "Owner Access"};
            taskNameIdentifier = { "taskNames": ["Owner Access", "Editor Access", "Viewer Access"] };
        } else if (ref.current_folder_identifier == 'my-drive') {
            taskNameIdentifier = { "taskName": "Owner Access" };
            //var mongoclauseForFolderProcess = null;
            mongoclauseForFileProcess = "this.Data.folder_identifier ==" + null;
        } else if (ref.current_folder_identifier == 'shared-with-me') {
            taskNameIdentifier = { "taskNames": ["Owner Access", "Viewer Access"] };
            mongoclauseForFolderProcess = null;
        } else if (ref.current_folder_identifier == 'storage') {
            taskNameIdentifier = { "taskName": "Owner Access" };
            var mongoclauseForFolderProcess = null;
        } else if (ref.current_folder_identifier == 'trash') {
            taskNameIdentifier = { "taskName": "Deleted Resource" };
            mongoclauseForFileProcess = "this.Data.extraDetails.wasSelectedAndDeleted == true";
            isInTrash = true;
        } else {
            mongoclauseForFileProcess = "this.Data.folder_identifier == " + folder_identifier;
        }
    } else {
        mongoclauseForFileProcess = "this.Data.folder_identifier == '" + folder_identifier + "'";
    }
    // return new Promise(async (resolve, reject) => {
    // try {
    const projections = ["Data"];
    const data = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
        accountId: await getActiveAccountId(),
        processName: "File Manager - DM",
        mongoWhereClause: mongoclauseForFileProcess,
        projections: projections,
        predefinedFilters: taskNameIdentifier,
    });
    var fileArryIns = data;
    // var fileArryIns = data.filter((item: any) => item.data.createdBy === userId);

    let existingFile = [];
    let existingFileIdentifier: any[] = [];
    if (fileArryIns) {
        for (let i in fileArryIns) {
            if (!existingFileIdentifier.includes((fileArryIns[i] as any).data.resource_identifier)) {
                existingFile.push(fileArryIns[i]);
                existingFileIdentifier.push((fileArryIns[i] as any).data.resource_identifier);
            }
        }
    }
    return existingFile;
}

const getWhereClauseToGetStarredFolder = function (ref: any, type: string, identifier_type: string) {

    var wherClause = "";

    var obj = ref.userSpecificData[type];
    for (var ident in obj) {
        if (obj[ident].starred) {

            wherClause += "this.Data." + identifier_type + " == '" + ident + "' || "
        }
    }
    wherClause = wherClause.slice(0, wherClause.length - 4)

    if (wherClause == "") {
        wherClause = "this.Data." + identifier_type + " == 'starred'"
    }

    return wherClause;
}

const getFileMangerListData = async function (ref: any) {
    try {
        ref.userSpecificData = {};
        const profileData = await getProfileData();
        const userId = profileData.USER_ID
        var predefinedFilters = { "taskName": "View Details" };
        var projections = ["Data"];
        var processVariableFilters = { "user_id": userId };
        const instanceData = await getMyInstancesV2({
            softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
            accountId: await getActiveAccountId(),
            processName: "User Specific Folder and File Details - DM",
            processVariableFilters: processVariableFilters,
            projections: projections,
            predefinedFilters: predefinedFilters,
        });
        if (instanceData?.length > 0) {
            ref.userSpecificData = instanceData[0].data;
            if (!ref.userSpecificData['folder']) {
                ref.userSpecificData['folder'] = {};
            }
            if (!ref.userSpecificData['file']) {
                ref.userSpecificData['file'] = {};
            }
        } else {
            ref.userSpecificData['folder'] = {};
            ref.userSpecificData['file'] = {};
        }
        // return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }

}

export const addToStarred = async function (itemType: any, resourceId: any, folderId: any, parameterType: any, parameterValue: any) {
    // var ref = Globals.GlobalAPI.PreLoader1666205644726;

    let ref = {
        userSpecificData: {}
    };
    await getFileMangerListData(ref);
    parameterValue = parameterValue == 'true' ? true : false;

    if (itemType == "folder") {
        try {
            await invokeUserSpecificDetails(ref, itemType, folderId, parameterType, parameterValue);
            if (parameterValue) {
                toast.success("Folder added to Starred");
            } else {
                toast.success("Folder removed from Starred");
            }
            // const currentUrl: any = window.location.href;
            // res.redirect(currentUrl);
            // Use client-side redirection
            // window.location.href = window.location.href;
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    } else {
        try {
            await invokeUserSpecificDetails(ref, 'file', resourceId, parameterType, parameterValue);
            if (parameterValue) {
                toast.success("File added to Starred");
            } else {
                toast.success("File removed from Starred");
            }
            // const currentUrl: any = window.location.href;
            // res.redirect(currentUrl);
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}

const invokeUserSpecificDetails = async function (ref: any, itemType: any, identifier: any, parameterType: any, parameterValue: any) {
    const profileData = await getProfileData();
    const userId = profileData.USER_ID
    var predefinedFilters = { "taskName": "Edit Details" };
    var processVariableFilters = { "user_id": userId };
    const projections = ["Data"];
    //var mongoWhereClasue = "this.Data.folder_identifier == 'folder_identifier' "
    const instanceData = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
        accountId: await getActiveAccountId(),
        processName: "User Specific Folder and File Details - DM",
        projections: projections,
        predefinedFilters: predefinedFilters,
        processVariableFilters: processVariableFilters
    });
    if (instanceData.length > 0) {
        var taskId = instanceData[0].taskId;
        var itemData = instanceData[0].data as { [key: string]: any };

        //var itemData = userSpecificData[itemType];
        if (!itemData[itemType]) {
            itemData[itemType] = {};
        }
        if (!itemData[itemType][identifier]) {
            itemData[itemType][identifier] = {};
        }
        if (!itemData[itemType][identifier][parameterType]) {
            itemData[itemType][identifier][parameterType] = "";
        }

        itemData[itemType][identifier][parameterType] = parameterValue;
        //itemData[identifier][parameterType] = parameterValue
        const result = await invokeAction({
            taskId: taskId,
            transitionName: "Update Edit Details",
            data: itemData,
            processInstanceIdentifierField: ""
        });
    } else {
        var userWithObject: any = {}
        userWithObject[identifier] = {}
        userWithObject[identifier][parameterType] = parameterValue;
        var obj = {
            "user_id": userId,
            [itemType]: userWithObject
        }
        const processId = await mapProcessName({ processName: "User Specific Folder and File Details - DM", });
        await startProcessV2({ processId, data: obj, processIdentifierFields: "user_id", });
    }
}

export const deleteItem = async function (itemType: string, folderId: string, resourceId: string) {

    if (itemType == "folder") {
        await getConfirmationToDeleteFolderAndItsResources(folderId);
        // toast.success("Folder move to Trash");
    } else {
        await getConfirmationToDeleteResources(resourceId);
        // toast.success("File move to Trash");
    }

}

const getConfirmationToDeleteFolderAndItsResources = async function (folder_identifier: string) {
    //     var isConfirm = false;
    //  	sweetalertOkCancel("All folder and SubFolder will be deleted along with files. Are you sure you want to delete it?",function(isConfirm) {
    //         var folderListSize = $(".folder-lists").children()
    //         if(folderListSize.length == 1){
    //             $(`.classification-tag-folders`).remove();
    //         }
    //         $(`#folder_container_${folder_identifier}`).parent().remove();
    // openDialog({
    //     title: "Delete Folder Confirmation",
    //     description: "All folder and SubFolder will be deleted along with files. Are you sure you want to delete it?",
    //     confirmText: "Delete",
    //     cancelText: "Cancel",
    //     onConfirm: () => deleteFolderAndItsResources(folder_identifier),
    //     onCancel: () => console.log("Cancel action executed!"),
    // });
    await deleteFolderAndItsResources(folder_identifier);
}

const deleteFolderAndItsResources = async function (folder_identifier: string) {
    // const router = useRouter();
    // const [isPending, startTransition] = useTransition();
    var deletedfolder_identifier = folder_identifier;
    var predefinedFilters = { "taskName": "Editor Access" };
    var processVariableFilters = { "folder_identifier": folder_identifier };
    const fileMangerInstance = await getMyInstancesV2({
        softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
        accountId: await getActiveAccountId(),
        processName: "Folder Manager - DM",
        processVariableFilters: processVariableFilters,
        projections: ["Data.folder_identifier", "Data.parentId"],
        predefinedFilters: predefinedFilters,
    });
    // var fileMangerInstance = arguments[0];

    var doesUserHaveDeleteAccess = fileMangerInstance.find(x => (x.data as any).folder_identifier === folder_identifier);

    if (!doesUserHaveDeleteAccess) {
        toast.error("You are not authorized to delete this Folder. Please contact system Admin.")
    } else {
        const profileData = await getProfileData();
        const userId = profileData.USER_ID
        var parentId = (fileMangerInstance[0].data as { parentId: string }).parentId;
        const processId = await mapProcessName({ processName: "Delete Folder Structure - DM" });
        var obj = {
            "delete_identifier": uuid(),
            "identifier": folder_identifier,
            "detetedBy": userId,
            "deletedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "folderOrFile": "folder",
            "parentFolderId": parentId,
        };

        await startProcessV2({ processId, data: obj, processIdentifierFields: "folder_identifier,delete_identifier,parentFolderId" });
        toast.success("Folder move to Trash");
        // startTransition(() => {
        //     router.refresh();
        // });
    }
}

const getConfirmationToDeleteResources = async function (resource_identifier: string) {
    // var ref = Globals.GlobalAPI.PreLoader1666205644726;
    // var landingPageRef = eval(ref.landingPageRefString);
    // var isConfirm = false;

    //sweetalertOkCancel("Files will be deleted. Are you sure you want to delete it?",function(isConfirm) {

    // var fileListSize = $(".fileLists").children()
    // if(fileListSize.length == 1){
    //     $(`.classification-tag-files`).remove();
    // }
    // $(`#file_container_${resource_identifier}`).parent().remove();
    await deleteSelectedFiles(resource_identifier);
    /* 		},function() {
            console.log("Cancelled")
        }); */

}

const deleteSelectedFiles = async function (resource_identifier: string) {
    // const router = useRouter();
    // const [isPending, startTransition] = useTransition();
    var deletedResource_identifier = resource_identifier;
    var predefinedFilters = { "taskName": "Editor Access" };
    var processVariableFilters = { "resource_identifier": resource_identifier };
    const fileMangerInstance = await getMyInstancesV2({
        processName: "File Manager - DM",
        processVariableFilters: processVariableFilters,
        projections: ["Data.resource_identifier", "Data.folder_identifier"],
        predefinedFilters: predefinedFilters,
    });

    var doesUserHaveDeleteAccess = fileMangerInstance.find(x => (x.data as any).resource_identifier === resource_identifier);
    if (!doesUserHaveDeleteAccess) {
        toast.error("You are not authorized to delete this File. Please contact system Admin.")
    } else {
        const profileData = await getProfileData();
        const userId = profileData.USER_ID
        const processId = await mapProcessName({ processName: "Delete Folder Structure - DM" });
        var parentId = (fileMangerInstance[0].data as { folder_identifier: string }).folder_identifier;
        var obj = {
            "delete_identifier": uuid(),
            "identifier": resource_identifier,
            "detetedBy": userId,
            // "deletedOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "deletedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "folderOrFile": "file",
            "parentFolderId": parentId,
        };
        // console.log("formated Date" + obj.deletedOn);
        await startProcessV2({ processId, data: obj, processIdentifierFields: "identifier,delete_identifier,parentFolderId" });
        toast.success("File move to Trash");
        // startTransition(() => {
        //     router.refresh();
        // });
    }
}

export const restoreOrPermanentlyDeleteSelectItemType = async function (itemType: string, resourceId: string, folderId: string, deleteOrRestore: any) {

    if (itemType == "folder") {
        await restoreOrPermanentlyDeleteResourceFromTrash(folderId, itemType, deleteOrRestore)
    } else {
        await restoreOrPermanentlyDeleteResourceFromTrash(resourceId, itemType, deleteOrRestore)
    }
}

const restoreOrPermanentlyDeleteResourceFromTrash = async function (identifier: string, folderOrFiles: string, deleteOrRestore: string) {
    const profileData = await getProfileData();
    const userId = profileData.USER_ID

    if (folderOrFiles == "folder") {
        var processName = "Folder Manager - DM";
        var processIdertifierFilter: { folder_identifier?: string; resource_identifier?: string } = { "folder_identifier": identifier };
    } else {
        var processName = "File Manager - DM";
        var processIdertifierFilter: { folder_identifier?: string; resource_identifier?: string } = { "resource_identifier": identifier };
    }
    var predefinedFilters = { "taskName": "Deleted Resource" };
    var projections = ["Data.folder_identifier", "Data.resource_identifier", "Data.new_folder_identifier"];
    const instanceData: any = await getMyInstancesV2({
        // softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
        // accountId: await getActiveAccountId(),
        processName,
        projections: projections,
        predefinedFilters: predefinedFilters,
        processVariableFilters: processIdertifierFilter
    });
    var deletedInstanceTaskId = await instanceData[0].taskId;
    var params = {
        "deleteOrRestore": deleteOrRestore,
        "userId": userId,
        // "currentDateAndTime" : moment().format("YYYY-MM-DD'T'HH:mm:ss'Z'"),
        "activityId": uuid(),
        "eventId": uuid(),
    };
    await invokeTaskScript({
        taskId: deletedInstanceTaskId,
        accountId: await getActiveAccountId(),
        parameters: params
    })
}

export const preview = async function (resourceDetails: any) {

    var downloadUrl = "https://ikoncloud-dev.keross.com/download";
    const globalTicket = await getTicket()
    var { resourceId, resourceName, resourceType } = resourceDetails;
    // resourceId = resourceId?.resourceId;
    if (resourceType == 'image/jpeg' || resourceType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || resourceType == 'image/png' || resourceType == 'text/plain' || resourceType == 'text/html' || resourceType == 'text/css' || resourceType == 'text/javascript' || resourceType == 'application/pdf' || resourceType == 'video/mp4' || resourceType == 'image/gif' || resourceType == 'text/csv') {
        if (resourceType == 'application/pdf') {
            var url = downloadUrl + "?ticket=" + globalTicket + "&resourceId=" + resourceId + "&resourceType=" + resourceType;
            //var url = "https://view.officeapps.live.com/op/embed.aspx?src="+encodeURIComponent(downloadUrl + "?ticket="+globalTicket+"&resourceId="+resourceId+"&resourceName="+resourceName+"&resourceType="+resourceType)+"&embedded=true";
        } else if (resourceType == 'text/html') {
            var url = downloadUrl + "?ticket=" + globalTicket + "&resourceId=" + resourceId + "&resourceType=" + "text/plain";
        } else if (resourceType == 'text/csv') {
            var url = downloadUrl + "?ticket=" + globalTicket + "&resourceId=" + resourceId + "&resourceType=" + resourceType;
        } else if (resourceType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            var url = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(downloadUrl + "?ticket=" + globalTicket + "&resourceId=" + resourceId + "&resourceName=" + resourceName + "&resourceType=" + resourceType);
        } else {
            var url = downloadUrl + "?ticket=" + globalTicket + "&resourceId=" + resourceId + "&resourceType=" + resourceType;
        }
    } else {
        var url = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(downloadUrl + "?ticket=" + globalTicket + "&resourceId=" + resourceId + "&resourceName=" + resourceName + "&resourceType=" + resourceType);
    }
    // console.log("resource-Type", resourceType)
    // console.log("url", url);
    return url;
}


export const handleCreateFolder = async (folderName: string, folder_identifier: string) => {
    try {
        const profileData = await getProfileData();
        const userId = profileData.USER_ID
        let obj: {
            folderName: string;
            folder_identifier: string;
            parentId: string;
            createdBy: string;
            createdOn: string;
            updatedBy: string;
            updatedOn: string;
            type: string;
            userDetails?: any;
            groupDetails?: any;
            extraDetails?: any;
        } = {
            "folderName": folderName,
            "folder_identifier": uuid(),
            "parentId": folder_identifier,
            "createdBy": userId,
            // "createdOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "createdOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "updatedBy": userId,
            // "updatedOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "updatedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "type": "folder"
            //"isCreated" : true,
        }
        var accessGroupUser = {
            "editFolderAccess": [],
            "viewFolderAccess": [],
            "ownerFolderAccess": [userId],
            "removedUserFolderAccess": [],
            "parentEditFolderAccess": [],
            "parentViewFolderAccess": [],
            "parentOwnerFolderAccess": [],
        };

        obj["userDetails"] = accessGroupUser;

        var roleAccess = {
            "editFolderGrpAccess": [],
            "viewFolderGrpAccess": [],
            "ownerFolderGrpAccess": [],
            "removedFolderGrpAccess": [],
            "parentEditFolderGrpAccess": [],
            "parentViewFolderGrpAccess": [],
            "parentOwnerFolderGrpAccess": [],
        };

        obj["groupDetails"] = roleAccess;
        obj["extraDetails"] = {
            "isCreated": true,
        }
        const processId = await mapProcessName({ processName: "Folder Manager - DM", });
        await startProcessV2({ processId, data: obj, processIdentifierFields: "folder_identifier" });
        toast.success("folder created successfully");
    }
    catch (error) {
        toast.error("Failed to create folder");
    }
}

export const updateFolderDetails = async function (folder_identifier: string, folderName: string) {

    var predefinedFilters = { "taskName": "Editor Access" };
    var processVariableFilters = { "folder_identifier": folder_identifier };
    const projections = ["Data"];
    const fileMangerData = await getMyInstancesV2({
        processName: "Folder Manager - DM",
        processVariableFilters: processVariableFilters,
        projections: projections,
        predefinedFilters: predefinedFilters,
    });
    if (fileMangerData.length > 0) {
        var taskId = fileMangerData[0].taskId;
        const profileData = await getProfileData();
        const userId = profileData.USER_ID
        var obj = {
            "folderName": folderName,
            "updatedBy": userId,
            // "updatedOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "updatedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        };
        const result = await invokeAction({
            taskId: taskId,
            transitionName: "Update Editor Access",
            data: obj,
            processInstanceIdentifierField: "",
        });
        toast.success("Folder updated successfully");
    }
    else {
        // alert("You are not authorized to edit this Folder. Please contact system Admin.")
        toast.error("You are not authorized to edit this Folder. Please contact system Admin.")
    }
}

export const customUploadFiles = async function (folder_identifier: string, extraDetails: any) {
    //upload started
    // console.log("upload started");

    let file = extraDetails.storeSelFiles;
    let fileInfo: any = {};
    const result = await singleFileUpload(file);
    // return result;
    //upload successful
    // console.log("upload success");
    fileInfo = result;
    // fileInfo["resourceName"] = file.name;
    // fileInfo["resourceSize"] = file.size;
    // fileInfo["resourceType"] = file.type;
    // fileInfo["identifier"] = file.identifier
    // fileInfo["inputControl"] = file.inputControl

    // ref.currentlyUploadingFiles++;
    // ref.totalUploadedFiles++;
    // ref.updateUploadProgressTitle(true);
    if (fileInfo["resourceType"] == "application/x-msdownload") {
        //sweetalertValidate("You Can not upload executable Files")
        toast.error("You Can not upload executable Files")
        return;

        // this.upload.cancel();
        // $(`.upload-cancel-${this.fileInfo.inputControl}`).removeClass("svg-circle-close").addClass("svg-circle-exclamation")
        // ref.currentlyUploadingFiles--;
        // ref.totalUploadedFiles--;
        // ref.cancelledUploadingFiles++;
    }
    // console.log("ref.calculatedSize" ,ref.calculatedSize)
    // if(this.fileInfo["resourceSize"] + ref.calculatedSize > ref.totalValue){
    //     //sweetalertValidate("You Can not Upload More File As You Reach Your Uploading Limit")
    //     bootstrapModalAlert({
    //         text:'You Can not Upload More File As You Reach Your Uploading Limit',
    //         icon:"warning",
    //         confirmButtonText:"OK",
    //         onConfirm: async function () {
    //         }
    //     })
    //     this.upload.cancel();
    //     $(`.upload-cancel-${this.fileInfo.inputControl}`).removeClass("svg-circle-close").addClass("svg-circle-exclamation")
    //     ref.currentlyUploadingFiles--;
    //     ref.totalUploadedFiles--;
    //     ref.cancelledUploadingFiles++;
    // }
    let maxUploadSize = 1000000000;
    if (fileInfo["resourceSize"] > maxUploadSize) {
        //sweetalertValidate(`${this.fileInfo["resourceName"]} File is too big to Upload`)
        toast.error(`${fileInfo["resourceName"]} File is too big to Upload`);
        return;
        // this.upload.cancel();
        // $(`.upload-cancel-${this.fileInfo.inputControl}`).removeClass("svg-circle-close").addClass("svg-circle-exclamation")
        // ref.currentlyUploadingFiles--;
        // ref.totalUploadedFiles--;
        // ref.cancelledUploadingFiles++;
    }

    // if(!ref.fileUploadFlag){
    //     var hb_hbfragment =  Handlebars.compile(ref.hbFragmentsMap["Upload Progress Container Main Div Template"]);
    //     var hbcontent = hb_hbfragment({
    //         "landingPageRef": ref.landingPageRefString,
    //         "preLoaderRef" : "Globals.GlobalAPI.PreLoader1666205644726",
    //         //"longParagraghText" : ref.longParagraghText,
    //     });
    //     $("#upload-progress-container-main-Div").html(hbcontent);
    //     $("#upload-progress-container-main-Div").show();
    //     ref.fileUploadFlag = true
    // }else{
    //     clearTimeout(ref.settingModalToCloseInSpecifiedTime)
    // }


    //$(".upload-progress-container").show();
    // console.log("fileInfo" ,fileInfo)
    // $(".upload-progress-box-appender").append(ref.progressBarFrgmentsFn(this.fileInfo));

    // $("#FormFieldUploadProgressBar" + this.fileInfo.inputControl).css("width", "0%");
    // $("#txtFileName").text("Uploading " + file.name); 

    // $("#IkonFormModal").modal("hide");

    // var curentUpload = this;
    // $(`.upload-cancel-${this.fileInfo.inputControl}`).on("click",function(){
    //     curentUpload.upload.cancel();
    // });

    // const result = await singleFileUpload(file);
    // // return result;
    // //upload successful
    // console.log("upload success");
    // fileInfo["resourceId"] = result;
    var obj = {
        f_id: folder_identifier,
        r_id: extraDetails && extraDetails.resource_identifier ? extraDetails.resource_identifier : null,
    };
    customDropzoneCallback(fileInfo, obj);
}

const customDropzoneCallback = async function (fileDetailsObj: any, extraDetails: any) {

    const profileData = await getProfileData();
    const userId = profileData.USER_ID;

    // console.log(fileDetailsObj);
    if (!fileDetailsObj) {
        // this will never be true just wrote it so that it does not get error below if this fails.
        //sweetalertMessage("Sorry upload Failed");
        toast.error("Sorry upload Failed");
        return;

    }

    var folderId = extraDetails.f_id;
    var resource_identifier = extraDetails.r_id;
    if (folderId == null) {
        folder_identifier = "my-drive"
    } else {
        var folder_identifier = folderId.replace("folder_container_", "");
    }
    //console.log(folder_identifier);
    if (folder_identifier == "my-dropzone" || folder_identifier == "my-drive" || folder_identifier == "shared-with-me" || folder_identifier == "trash" || folder_identifier == "starred" || folder_identifier == "storage") {
        var folder_identifier = null;
    }

    var predefinedFilters = { "taskName": "Editor Access" };
    var processVariableFilters = { "resource_identifier": resource_identifier };
    const projections = ["Data"];
    const instanceData = await getMyInstancesV2({
        processName: "File Manager - DM",
        processVariableFilters: processVariableFilters,
        projections: projections,
        predefinedFilters: predefinedFilters,
    });
    // IkonService.getMyInstancesV2("File Manager - DM",globalAccountId, {"taskName" : "Editor Access"}, {"resource_identifier" : resource_identifier}, null,null, ["Data"],false, function(data){
    if (instanceData.length > 0) {
        var taskId = instanceData[0].taskId;
        var data: any = instanceData[0].data;
        // console.log("uploadResourceDetails", data)
        var newData = {
            "resourceName": fileDetailsObj.resourceName,
            "resourceSize": fileDetailsObj.resourceSize,
            "resourceType": fileDetailsObj.resourceType,
            "resourceId": fileDetailsObj.resourceId,
            //"inputControl" :  fileDetailsObj.inputControl,
            "uploadedBy": userId,
            // "uploadedOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "uploadedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "fileName": fileDetailsObj.resourceName.substring(0, fileDetailsObj.resourceName.lastIndexOf(".")),
            "fileNameExtension": fileDetailsObj.resourceName.substring(fileDetailsObj.resourceName.lastIndexOf(".") + 1),
        };
        // console.log("uploadResourceDetails", data.uploadResourceDetails)
        var uploadResourceDetails = [...data.uploadResourceDetails, newData];
        var finaleData = {
            "uploadResourceDetails": uploadResourceDetails,
            "updatedBy": userId,
            // "updatedOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
            "updatedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        }
        const result = await invokeAction({
            taskId: taskId,
            transitionName: "Update Editor Access",
            data: finaleData,
            processInstanceIdentifierField: "",
        });
        // IkonService.invokeAction(
        //     taskId,
        //     "Update Editor Access",
        //     finaleData,
        //     null,
        //     function(){
        //         ref.getFolderAndFileOfSelectedFolder(ref.current_folder_identifier);
        //         console.log("reupload")
        //     },
        //     function(){
        //         console.log("Failure in invokeAction");
        //     }
        // )

    } else {
        const processId = await mapProcessName({ processName: "File Manager - DM", });
        // IkonService.mapProcessName(
        //     ref.FileManagerProcessName, globalAccountId,
        //     function(){
        // var processId = arguments[0];

        var resourceData = {
            "resourceName": fileDetailsObj.resourceName,
            "resourceSize": fileDetailsObj.resourceSize,
            "resourceType": fileDetailsObj.resourceType,
            "resourceId": fileDetailsObj.resourceId,
            //"inputControl" :  fileDetailsObj.inputControl,
            "uploadedBy": userId,
            // "uploadedOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "uploadedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "fileName": fileDetailsObj.resourceName.substring(0, fileDetailsObj.resourceName.lastIndexOf(".")),
            "fileNameExtension": fileDetailsObj.resourceName.substring(fileDetailsObj.resourceName.lastIndexOf(".") + 1),
        };
        var fileInfo: any = {};
        fileInfo["resourceName"] = resourceData.resourceName;
        fileInfo["resourceSize"] = resourceData.resourceSize;
        fileInfo["resourceType"] = resourceData.resourceType;

        var uploadedResource = [resourceData];

        var obj: any = {
            "uploadResourceDetails": uploadedResource,
            "resource_identifier": uuid(),
            "folder_identifier": folder_identifier,
            "createdBy": userId,
            // "createdOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "createdOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "updatedBy": userId,
            // "updatedOn": moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
            "updatedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            "type": "file",
            "isCreated": true,

        };

        var accessGroupUser = {
            "editFileUserAccess": [],
            "viewFileUserAccess": [],
            "ownerFileAccess": [userId],
            "removedFileUserAccess": [],
            "folderEditUserAccess": [],
            "folderViewUserAccess": [],
            "folderOwnerUserAccess": [],
        };

        obj["userDetails"] = accessGroupUser;

        var roleAccess = {
            "editFileGrpAccess": [],
            "viewFileGrpAccess": [],
            "ownerFileGrpAccess": [],
            "removedFileGrpAccess": [],
            "folderEditGrpAccess": [],
            "folderViewGrpAccess": [],
            "folderOwnerGrpAccess": [],
        };

        obj["groupDetails"] = roleAccess;

        obj["extraDetails"] = {
            "isCreated": true,
        }
        //console.log(obj)
        if (fileInfo.resourceType == 'image/jpeg' || fileInfo.resourceType == 'image/png' || fileInfo.resourceType == 'text/plain' || fileInfo.resourceType == 'text/html' || fileInfo.resourceType == 'text/css' || fileInfo.resourceType == 'text/javascript' || fileInfo.resourceType == 'application/pdf' || fileInfo.resourceType == 'video/mp4' || fileInfo.resourceType == 'image/gif' || fileInfo.resourceType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileInfo.resourceType == 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || fileInfo.resourceType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            // console.log("you can take Screenshot")
            //ref.screenshotExecution(fileInfo,obj.resource_identifier)
        } else {
            // console.log("FileType Not Supported For Taking Screenshot")
        }
        // ref.hideLoadingScreen();
        await startProcessV2({ processId, data: obj, processIdentifierFields: "resource_identifier" });
        // IkonService.startProcessV2(processId, obj, "resource_identifier", function(){
        //     ref.getFolderAndFileOfSelectedFolder(ref.current_folder_identifier);

        // }, function(){});
        // },
        //     function(e){
        //         //sweetalertValidate("Please refresh the page");
        //         bootstrapModalAlert({
        //             text:'Please refresh the page',
        //             icon:"warning",
        //             confirmButtonText:"OK",
        //             onConfirm: async function () {
        //             }
        //         })
        //     }
        // );
    }
}
interface Ref {
    cutOrCopiedIdentifier: string;
    cutOrCopied: string;
    folderOrFile: string;
    isCutOrCopied: boolean;
}
let ref: Ref = {
    cutOrCopiedIdentifier: "",
    cutOrCopied: "",
    folderOrFile: "",
    isCutOrCopied: false
}
export const cutOrCopyDocument = function (folderId: string, resource_identifier: string, cutOrCopied: any, itemType: string) {

    if (itemType == "folder") {
        var copied_identifier = folderId;

    } else {
        var copied_identifier = resource_identifier;
    }

    ref.cutOrCopiedIdentifier = copied_identifier;
    ref.cutOrCopied = cutOrCopied;
    ref.folderOrFile = itemType;
    ref.isCutOrCopied = true;

    // Globals.BaseAPI.PreLoader1719481805489.addNotification({
    //     type : "success",
    //     description : `Successfully ${cutOrCopied} the item`,
    //     created_from : 'UI/UX',
    //     priority : "medium",
    //     group_name : ["ADMIN"],
    //     notification_name : cutOrCopied
    // });
}

export const pasteInSelectedFolder = async function (destination_folder_identifiers: string | null) {
    // var destination_folder_identifier = ref.current_folder_identifier;
    var destination_folder_identifier = destination_folder_identifiers;

    if (destination_folder_identifier == "my-drive") {
        destination_folder_identifier = null;
    }

    if (!ref.cutOrCopiedIdentifier) {
        //sweetalertMessage("No Folder or File is Cut or Copied yet.")
        // bootstrapModalAlert({
        //     text:'No Folder or File is Cut or Copied yet.',
        //     icon:"warning",
        //     confirmButtonText:"OK",
        //     onConfirm: async function () {
        //     }
        // })
        toast.error("No Folder or File is Copied yet.");
        return;
    }
    if (ref.cutOrCopied == "cut" && ref.folderOrFile == "folder") {
        // var allChildrenList = ref.getAllChildrenListOfSelectedFolder(ref.cutOrCopiedIdentifier);
        // if(allChildrenList.includes(destination_folder_identifier) || ref.cutOrCopiedIdentifier ==  destination_folder_identifier){
        //     alert("The Destination Folder is a subfolder of the source Folder.")
        //     return;
        // }else{
        //     var processVariableFilters = {"folder_identifier" : ref.cutOrCopiedIdentifier};
        //     IkonService.getMyInstancesV2(ref.FolderManagerProcessName, globalAccountId, {"taskName": "Sharing Activity"} , processVariableFilters,null,null,["Data.parentId","Data.updatedBy","Data.updatedOn","Data.userDetails","Data.groupDetails","Data.extraDetails"],false,function(){
        //         var cutFolderData = arguments[0][0];
        //         var taskId = cutFolderData.taskId;
        //         var folderData = cutFolderData.data;
        //         folderData.parentId = destination_folder_identifier;
        //         folderData.extraDetails.isMoved = true;
        //         folderData.updatedBy = Globals.profile.value.USER_ID.value;
        //         folderData.updatedOn = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        //         console.log(folderData);

        //         IkonService.invokeAction(
        //             taskId,
        //             "Update Sharing Activity",
        //             folderData,
        //             null,
        //             function(){
        //                 console.log("Invoke Successfull");
        //                 Globals.BaseAPI.PreLoader1719481805489.addNotification({
        //                     type : "success",
        //                     description : "Successfully Pasted",
        //                     created_from : 'UI/UX',
        //                     priority : "medium",
        //                     group_name : ["ADMIN"],
        //                     notification_name : "Paste"
        //                 });
        //                 setTimeout(()=>{
        //                     openLandingPage('1665581154042')
        //                 },100);
        //             },
        //             function(){
        //                 console.log("Failure in invokeAction");
        //             }
        //         );

        //     },function(){});
        // }
    } else if (ref.cutOrCopied == "cut" && ref.folderOrFile != "folder") {
        // var processVariableFilters = {"resource_identifier" : ref.cutOrCopiedIdentifier};
        //     IkonService.getMyInstancesV2(ref.FileManagerProcessName, globalAccountId, {"taskName": "Sharing Activity"} , processVariableFilters,null,null,["Data.folder_identifier","Data.updatedBy","Data.updatedOn","Data.userDetails","Data.groupDetails","Data.extraDetails"],false,function(){
        //         var cutFolderData = arguments[0][0];
        //         var taskId = cutFolderData.taskId;
        //         var folderData = cutFolderData.data;
        //         folderData.folder_identifier = destination_folder_identifier;
        //         folderData.extraDetails.isMoved = true;
        //         folderData.updatedBy = Globals.profile.value.USER_ID.value;
        //         folderData.updatedOn = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        //         console.log(folderData);

        //         IkonService.invokeAction(
        //             taskId,
        //             "Update Sharing Activity",
        //             folderData,
        //             null,
        //             function(){
        //                 console.log("Invoke Successfull");
        //                 Globals.BaseAPI.PreLoader1719481805489.addNotification({
        //                     type : "success",
        //                     description : "Successfully Pasted",
        //                     created_from : 'UI/UX',
        //                     priority : "medium",
        //                     group_name : ["ADMIN"],
        //                     notification_name : "Paste"
        //                 });
        //                 setTimeout(()=>{
        //                     //openLandingPage('1665581154042')
        //                 },100);
        //             },
        //             function(){
        //                 console.log("Failure in invokeAction");
        //             }
        //         );

        //     },function(){});

    } else {
        var obj = {
            "destination_folder_identifier": destination_folder_identifier,
            "copied_identifier": ref.cutOrCopiedIdentifier,
            "FolderManagerProcessName": "Folder Manager - DM",
            "FileManagerProcessName": "File Manager - DM",
            "folderOrFile": ref.folderOrFile,
        };
        const processId = await mapProcessName({ processName: "Folder And Files Copy Paste System - DM" });
        await startProcessV2({ processId, data: obj, processIdentifierFields: null });
        ref = {
            cutOrCopiedIdentifier: "",
            cutOrCopied: "",
            folderOrFile: "",
            isCutOrCopied: false
        };
        toast.success("Successfully Pasted");

    }
}

const getDataForSharedWithMe = async function (): Promise<any[]> {
    //let taskNameIdentifier = {"taskNames" : ["Owner Access","Viewer Access"]};
    const profileData = await getProfileData();
    const userId = profileData.USER_ID;
    return new Promise(async (resolve, reject) => {
        try {
            var taskNameIdentifier = { "taskName": "Sharing Activity" }
            const projections = ["Data"];
            const dataFromFolderManager: any = await getMyInstancesV2({
                softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
                accountId: await getActiveAccountId(),
                processName: "Folder Manager - DM",
                projections: projections,
                predefinedFilters: taskNameIdentifier
            });
            let sharedWithMeFolderData = [];
            // console.log("Data", dataFromFolderManager);
            for (var i in dataFromFolderManager) {
                let userAccess = dataFromFolderManager[i].data.userDetails;
                if (userAccess.ownerFolderAccess[0] != userId &&
                    (userAccess.editFolderAccess.includes(userId) || userAccess.viewFolderAccess.includes(userId) || userAccess.parentEditFolderAccess.includes(userId) || userAccess.parentViewFolderAccess.includes(userId))) {

                    sharedWithMeFolderData.push(dataFromFolderManager[i]);
                }
            }

            // console.log("Share-Data", sharedWithMeFolderData);
            resolve(sharedWithMeFolderData)
        } catch (error) {
            console.error('Error in Folder :', error);
            reject(error);
        }
    });
}

const getDataForSharedWithMeFiles = async function (): Promise<any[]> {
    const profileData = await getProfileData();
    const userId = profileData.USER_ID;

    return new Promise(async (resolve, reject) => {

        try {
            // let taskNameIdentifier = { "taskNames": ["Owner Access", "Viewer Access"] };
            var taskNameIdentifier = { "taskName": "Sharing Activity" };
            const projections = ["Data"];
            const dataFromFileManager: any = await getMyInstancesV2({
                softwareId: await getSoftwareIdByNameVersion("Document Management", "1.0"),
                accountId: await getActiveAccountId(),
                processName: "File Manager - DM",
                projections: projections,
                predefinedFilters: taskNameIdentifier
            });
            let sharedWithMeFileData = [];
            // console.log(dataFromFileManager);
            for (var i in dataFromFileManager) {
                let userAccess = dataFromFileManager[i].data.userDetails;;

                if (userAccess.ownerFileAccess[0] != userId &&
                    (userAccess.editFileUserAccess.includes(userId) || userAccess.viewFileUserAccess.includes(userId) || userAccess.folderEditUserAccess.includes(userId) || userAccess.folderViewUserAccess.includes(userId))) {

                    sharedWithMeFileData.push(dataFromFileManager[i]);
                }
            }

            // console.log("Share-Data", sharedWithMeFileData);
            resolve(sharedWithMeFileData)
        } catch (error) {
            console.error('Error in Folder :', error);
            reject(error);
        }

    });
}
let sharedWithMeData: any = [];
export const getSharedWithMeData = function () {
    return sharedWithMeData;
}

export const getUserMapForCurrentAccount: any = async function (parameters: any) {
    let usersDetailsMap: any = {};
    try {
        const profileData = await getProfileData();
        const userId = profileData.USER_ID;
        const softwareId = "cbfc7c21-af73-4844-9f42-d830480f874b";
        const accountId = await getActiveAccountId();
        // console.log("SoftwareId", softwareId);
        // console.log("AccountId", accountId);
        const platformUtilInstances = await getMyInstancesV2({
            softwareId,
            accountId,
            processName: "User Dashboard Platform Util - All",
            projections: ["Data"],
        });
        let taskId = platformUtilInstances[0].taskId;
        usersDetailsMap = await getParameterizedDataForTaskId({ taskId, parameters });

        var dataObject = [];

        for (var key in usersDetailsMap) {
            if (usersDetailsMap.hasOwnProperty(key) && (key != userId)) {
                var user = usersDetailsMap[key];
                dataObject.push({
                    name: user.userName,
                    email: user.userEmail,
                    userId: key
                });
            }
        }
        sharedWithMeData = dataObject;
        // return usersDetailsMap;
        return dataObject;
    } catch (error) {
        console.error(error);
    }
}
interface FormData {
    folderToggleArray: string[];
    folderCheckBoxArray: string[];
}
export const sharedFns = async function (data: FormData, rowData: any) {
    let processName, identifierId, identifierName, docData: any, processVariableFilters;
    if (rowData.type === "folder" || rowData.folder_identifier) {
        processName = "Folder Manager - DM";
        identifierId = rowData.folder_identifier;
        // identifierName = "folder_identifier";
        processVariableFilters = { "folder_identifier": identifierId};
    } else {
        processName = "File Manager - DM";
        identifierId = rowData.resource_identifier;
        // identifierName = "resource_identifier";
        processVariableFilters = { "resource_identifier": identifierId};
    }
    const projections = ["Data"];
    var taskNameIdentifier = { "taskName": "Owner Access" };
    var mongoclauseForFileProcess = "this.Data.resource_identifier ==" + "668e626a-ac16-43ac-aad0-62969707027d";
    const docArryIns: any = await getMyInstancesV2({
        processName,
        // mongoWhereClause: mongoclauseForFileProcess,
        projections: projections,
        predefinedFilters: taskNameIdentifier,
        processVariableFilters
    });
    // for (let i = 0; i < docArryIns.length; i++) {
    //     if (docArryIns[i].data[identifierName] === identifier) {
    //         console.log(docArryIns[i].data);
    //         docData = docArryIns[i].data;
    //         break;
    //     }
    // }
    docData = docArryIns[0].data;
    docData = getUserSpecificAccessData(data.folderCheckBoxArray, docData);

    const profileData = await getProfileData();
    const userId = profileData.USER_ID;
    var obj: any = {
        "updatedBy": userId,
        "updatedOn": format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
    };

    let sendTransmittal = false;
    var transMittedMessage = " ";
    obj["userDetails"] = docData.userDetails;
    obj["groupDetails"] = docData.groupDetails;
    obj["sendTransmittal"] = sendTransmittal;
    obj["transMittedMessage"] = transMittedMessage;

    var predefinedFilters = { "taskName": "Sharing Activity" };
    const fileMangerData = await getMyInstancesV2({
        processName,
        processVariableFilters,
        projections,
        predefinedFilters,
    });
    if (fileMangerData.length > 0) {
        var taskId = fileMangerData[0].taskId;
        const result = await invokeAction({
            taskId,
            transitionName: "Update Sharing Activity",
            data: obj,
            processInstanceIdentifierField: "",
        });
        toast.success("Document shared successfully");
    }
    else {
        // alert("You are not authorized to edit this Folder. Please contact system Admin.")
        toast.error("You are not authorized to edit this Folder. Please contact system Admin.")
    }
}

const findSimilarities = function (checkBoxArray: any[], toggleArray: any[]) {
    var similarities: any[] = [];
    // var checkBoxStrippedIds = checkBoxArray.map(id => id.replace('checkBox_', ''));
    // var toggleStrippedIds = toggleArray.map(id => id.replace('toggleId_', ''));
    checkBoxArray.forEach(id => {
        if (toggleArray.includes(id)) {
            similarities.push(id);
        }
    });
    return similarities;
}

const getUserSpecificAccessData = function (folderCheckBoxArray: any[], docData: any) {
    let accessKey: string = "";
    for (var userId of folderCheckBoxArray) {
        docData.userDetails["editFileUserAccess"] = removeElementFromElement(docData.userDetails["editFileUserAccess"], userId);
        docData.userDetails["viewFileUserAccess"] = removeElementFromElement(docData.userDetails["viewFileUserAccess"], userId);
        docData.userDetails["folderEditUserAccess"] = removeElementFromElement(docData.userDetails["folderEditUserAccess"], userId);
        docData.userDetails["folderViewUserAccess"] = removeElementFromElement(docData.userDetails["folderViewUserAccess"], userId);
        docData.userDetails["removedFileUserAccess"] = removeElementFromElement(docData.userDetails["removedFileUserAccess"], userId);

        let checkbox: any = document.getElementById('toggleId_' + userId);
        let isChecked = checkbox ? checkbox.getAttribute("aria-checked") === "true": null;

        if (isChecked) {
            accessKey = "editFileUserAccess";
        } else {
            accessKey = "viewFileUserAccess";
        }

        docData.userDetails[accessKey].push(userId);
    }
    // console.log(docData.userDetails);
    return docData;
}

const removeElementFromElement = function (array: any[], element: any) {
    if (!array) {
        array = [];
    }
    const index = array.indexOf(element);
    if (index > -1) { // only splice array when item is found
        array.splice(index, 1); // 2nd parameter means remove one item only
    }
    return array;
}