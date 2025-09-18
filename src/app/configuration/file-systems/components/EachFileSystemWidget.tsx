"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import FileSystemConfigForm from "./FileSystemConfigForm"
import { FileSystemConfigData } from "@/app/FileSystemType"
import { deleteProcessInstance, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { toast } from "@/lib/toast";
import GlobalLoader from "@/components/GlobalLoader";
import { useDialog } from "@/components/alert-dialog/dialog-context";


export default function EachFileSystemWidget({ fileSystemConfigDetails, userIdNameMap }: {
    fileSystemConfigDetails: FileSystemConfigData,
    userIdNameMap: { value: string; label: string }[]
}) {
    const { openDialog } = useDialog();
    const [isEditFormOpen, setEditFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const toggleFormModal = function () {
        setEditFormOpen((prev) => !prev);
    };

    const handleConfirmDelete = async (config_id: string) => {
        setLoading(true);

        const fileSystemConfigInstance = await getMyInstancesV2<FileSystemConfigData>({
            processName: "File System Configuration",
            predefinedFilters: { taskName: "Edit Config Details" },
            processVariableFilters: { config_id: config_id },
            projections: ["Data.config_name, Data.config_id"]
        });

        try {
            await deleteProcessInstance({ processInstanceId: fileSystemConfigInstance[0].processInstanceId });

            toast.push("File System Configuration Deleted Successfully", "success");
            setLoading(false);
        } catch (error) {
            console.error("Failed to update date:", error);
            toast.push("Error in deleting File System Configuration", "error");
            setLoading(false);
        }
    }

    const handleDeleteConfig = async function (config_id: string) {
        openDialog({
            title: "Confirm Delete",
            description: "This will delete this File System Configuration permanently!",
            confirmText: "Delete",
            cancelText: "Cancel",
            onCancel: () => console.log("Delete cancelled"),
            onConfirm: () => handleConfirmDelete(config_id),
            confirmVariant: "red"
        });

    };

    const checkTitleStr = (title: string) => {
        return title.length > 45 ? title.substring(0, 45) + "..." : title;
    }

    if (loading) return <GlobalLoader />;

    return (
        <>
            <Card key={fileSystemConfigDetails.config_id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                <CardHeader className="p-0 px-6 py-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className="text-blue-800 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-tremor-default font-medium"
                                    aria-hidden={true}
                                >
                                    {fileSystemConfigDetails.config_name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")
                                        .slice(0, 2)}
                                </div>
                                <CardTitle title={fileSystemConfigDetails.config_name} className="text-white text-base truncate">
                                    {checkTitleStr(fileSystemConfigDetails.config_name)}
                                </CardTitle>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700">
                                <DropdownMenuItem onClick={toggleFormModal} title="Edit Configuration"
                                    className="text-slate-300 hover:text-white hover:bg-slate-700">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteConfig(fileSystemConfigDetails.config_id)} className="text-red-400 hover:text-red-300
                                hover:bg-slate-700">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        {/* <div className="col-span-2">
                            <p className="text-slate-400">Probe Id</p>
                            <p title={fileSystemConfigDetails.probe_id} className="text-white font-medium truncate overflow-hidden whitespace-nowrap">
                                {fileSystemConfigDetails.probe_id}
                            </p>
                        </div> */}
                        <div className="col-span-3">
                            <p className="text-slate-400">Probe Name</p>
                            <p title={fileSystemConfigDetails.probe_name} className="text-white font-medium truncate overflow-hidden whitespace-nowrap">
                                {fileSystemConfigDetails.probe_name}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                            <p className="text-slate-400 mb-1">OS Type</p>
                            <p className="text-white font-medium truncate overflow-hidden whitespace-nowrap">{fileSystemConfigDetails.probe_machine_os_type}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">IP Address</p>
                            <p className="text-white font-medium truncate overflow-hidden whitespace-nowrap">{fileSystemConfigDetails.ip_address}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Host Name</p>
                            <p className="text-white font-medium truncate overflow-hidden whitespace-nowrap">{fileSystemConfigDetails.hostname}</p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700">
                        <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                            <div className="col-span-2">
                                <p>Created By</p>
                                <p className="text-white">
                                    {userIdNameMap.find((user) => user.value === fileSystemConfigDetails.created_by)?.label || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p>Created On</p>
                                <p className="text-white">{format(fileSystemConfigDetails.created_on, "dd-MMM-yyyy hh:mm:ss")}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            <FileSystemConfigForm
                isFormModalOpen={isEditFormOpen}
                onClose={toggleFormModal}
                savedDataToBePopulated={fileSystemConfigDetails}
            />
        </>
    )
}