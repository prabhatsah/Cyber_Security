"use client"

import type React from "react"

import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Info, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogPanel, Select, SelectItem, Textarea } from "@tremor/react"
import IpInput from "@/components/IpInput"
import CidrInput from "@/components/CidrInput"
import { FileSystemConfigData, ProbeDetails } from "@/app/globalType"
import { fetchAllProbes } from "./FetchAllProbes"
import GlobalLoader from "@/components/GlobalLoader"
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService"
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService"
import { UUID } from "crypto"
import { toast } from "@/lib/toast"
import { getCurrentSoftwareId } from "@/ikon/utils/actions/software"
import { getActiveAccountId } from "@/ikon/utils/actions/account"
import { getCurrentUserId } from "@/ikon/utils/actions/auth"
import { config } from "googleapis/build/src/apis/config"

interface FileSystemConfigFormProps {
    isFormModalOpen: boolean;
    onClose: () => void;
    savedDataToBePopulated?: FileSystemConfigData
}

interface ErrorState {
    [key: string]: string | Array<string>;
}

export default function FileSystemConfigForm({ isFormModalOpen, onClose, savedDataToBePopulated }: FileSystemConfigFormProps) {
    const [allProbesArray, setAllProbesArray] = useState<ProbeDetails[]>([]);
    const [formData, setFormData] = useState({
        config_name: savedDataToBePopulated?.config_name ?? "",
        probe_id: savedDataToBePopulated?.probe_id ?? "",
        probe_machine_os_type: savedDataToBePopulated?.probe_machine_os_type ?? "",
        ip_address: savedDataToBePopulated?.ip_address ?? "",
        hostname: savedDataToBePopulated?.hostname ?? "",
    });
    const [errors, setErrors] = useState<ErrorState>({});
    const [loading, setLoading] = useState(false);
    const [configId, setConfigId] = useState<string>("");
    const [sysInfo, setSysInfo] = useState<any>(null);

    useEffect(() => {
        const loadProbes = async () => {
            const probes = await fetchAllProbes();
            setAllProbesArray(probes);
        };

        loadProbes();
    }, []);

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: ErrorState = {};

        const checkIpValidOrNot = (ip: string): boolean => {
            return ip.split(".").every(eachPart => eachPart !== "");
        };


        if (!formData.config_name) {
            newErrors.config_name = "Configuration Name cannot be blank. Please provide a valid Configuration Name";
        } else if (formData.config_name.trim().length < 3) {
            newErrors.config_name =
                "Configuration Name must be at least 3 characters long. Please provide a valid Configuration Name";
        }

        if (!formData.probe_id.trim()) {
            newErrors.probe_id = "Please select a Probe!";
        }

        if (!formData.probe_machine_os_type.trim()) {
            newErrors.probe_machine_os_type = "Please mention the OS of the Probe Machine!";
        }

        if (!formData.ip_address.trim()) {
            newErrors.ip_address = "IP Address cannot be blank. Please provide a valid IP Address";
        } else {
            if (!checkIpValidOrNot(formData.ip_address) && !newErrors.ip_address) {
                newErrors.ip_address = "Please provide a valid IP Address";
            }
        }

        if (!formData.hostname.trim()) {
            newErrors.hostname = "Host Name cannot be blank. Please provide a valid Host Name";
        } else if (formData.hostname.trim().length < 3) {
            newErrors.hostname = "Host Name must be at least 3 characters long. Please provide a valid Host Name";
        }
        // else if (!formData.hostname.startsWith("http://") && !formData.hostname.startsWith("https://")) {
        //     newErrors.hostname = "Host Name must start with 'http://' or 'https://'. Please provide a valid Host Name";
        // } else {
        //     try {
        //         new URL(formData.hostname);
        //     } catch (e) {
        //         newErrors.hostname = "Please provide a valid Host Name.";
        //     }
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateUpdateForm = (): boolean => {
        const newErrors: ErrorState = {};
        if (!formData.config_name) {
            newErrors.config_name = "Configuration Name cannot be blank. Please provide a valid Configuration Name";
        } else if (formData.config_name.trim().length < 3) {
            newErrors.config_name =
                "Configuration Name must be at least 3 characters long. Please provide a valid Configuration Name";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // Standard input handler
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement> | any
    ) => {
        const { name, value } = e.target;
        setErrors({});
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIpInputChange = (inputName: string, ip: string, inputIndex: number | undefined) => {
        setErrors({});
        const fieldName = inputName.split("-")[0];

        setFormData((prev) => ({ ...prev, [fieldName]: ip }));
    };

    const getConfigId = async () => {
        const today = new Date();
        const configIdPrefix = "KERCY-FS-" + today.getFullYear().toString().slice(-2) +
            String(today.getMonth() + 1).padStart(2, "0") + String(today.getDate()).padStart(2, "0");

        const configDataWithTodayPrefix = await getMyInstancesV2<FileSystemConfigData>({
            processName: "File System Configuration",
            predefinedFilters: { taskName: "View Config Details" },
            mongoWhereClause: `this.Data.config_id.includes("${configIdPrefix}")`
        });
        console.log(configIdPrefix + String(configDataWithTodayPrefix.length + 1).padStart(3, "0"));
        return configIdPrefix + String(configDataWithTodayPrefix.length + 1).padStart(3, "0");
    }
    useEffect(() => {
        const fetchConfigId = async () => {
            const id = await getConfigId();
            setConfigId(id);
        };
        fetchConfigId();
    }, []);
    console.log("configDataWithTodayPrefix", configId);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const today = new Date();
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const createdByUserId = (await getLoggedInUserProfile()).USER_ID;

        const dataToBeInvoked: FileSystemConfigData = {
            config_id: configId,
            config_name: formData.config_name,
            probe_id: formData.probe_id,
            probe_name: allProbesArray.find(eachProbe => eachProbe.PROBE_ID === formData.probe_id)?.PROBE_NAME ?? "N/A",
            hostname: formData.hostname,
            ip_address: formData.ip_address,
            probe_machine_os_type: formData.probe_machine_os_type,
            created_by: createdByUserId,
            created_on: today.toISOString()
        }

        try {
            const processId = await mapProcessName({
                processName: "File System Configuration"
            });
            await startProcessV2({
                processId: processId,
                data: dataToBeInvoked,
                processIdentifierFields: "config_id,created_by,probe_id"
            });

            handleClose();
            toast.push("File System Configuration Created Successfully", "success");
            setLoading(false);
        } catch (error) {
            console.error("Failed to start the process:", error);
            // throw error;
            toast.push("Error in creating File System Configuration", "error");
            setLoading(false);
        }
    }

    const handleConfigUpdate = async (event: React.FormEvent) => {
        event.preventDefault();

        setLoading(true);

        if (!validateUpdateForm()) {
            setLoading(false);
            return;
        }

        const fileSystemConfigInstance = await getMyInstancesV2<FileSystemConfigData>({
            processName: "File System Configuration",
            predefinedFilters: { taskName: "Edit Config Details" },
            processVariableFilters: { config_id: savedDataToBePopulated?.config_id },
            projections: ["Data.config_name"]
        });

        const invokableTaskId = fileSystemConfigInstance[0].taskId;
        const dataToBeUpdated = fileSystemConfigInstance[0].data;
        dataToBeUpdated.config_name = formData.config_name;
        try {
            await invokeAction({
                taskId: invokableTaskId,
                transitionName: "Update Config Details",
                data: dataToBeUpdated,
                processInstanceIdentifierField: "config_id,created_by,probe_id"
            });

            handleClose();
            toast.push("File System Configuration Updated Successfully", "success");
            setLoading(false);
        } catch (error) {
            console.error("Failed to update date:", error);
            toast.push("Error in updating File System Configuration", "error");
            setLoading(false);
        }
    }

    const handleClose = () => {
        setFormData({
            config_name: savedDataToBePopulated?.config_name ?? "",
            probe_id: savedDataToBePopulated?.probe_id ?? "",
            probe_machine_os_type: savedDataToBePopulated?.probe_machine_os_type ?? "",
            ip_address: savedDataToBePopulated?.ip_address ?? "",
            hostname: savedDataToBePopulated?.hostname ?? "",
        });
        setErrors({});
        setSysInfo(null);
        onClose();
    };

    const fetchSysInfo = async () => {
        let configData: any = await getMyInstancesV2({ processName: "Fetch ip os and hostname", processVariableFilters: { config_id: configId }, projections: ["Data"] });
        console.log("configData inside fetch", configData);

        if (configData && configData.sysInfo) {
            let taskId = configData[0].taskId;
            delete configData.sysInfo
            console.log("after deletion", configData)
            invokeAction({ taskId: taskId, transitionName: "fetch again", data: configData, processInstanceIdentifierField: "config_data" })
        }
        else {
            let processId = await mapProcessName({ processName: "Fetch ip os and hostname" });
            startProcessV2({ processId: processId, data: { config_id: configId, probe_id: formData.probe_id }, processIdentifierFields: "config_id" });
        }

        while (true) {
            let configDataAgain: any = await getMyInstancesV2({ processName: "Fetch ip os and hostname", processVariableFilters: { config_id: configId }, projections: ["Data"] });
            console.log("configDataAgain", configDataAgain);
            setSysInfo(configDataAgain[0].data.sysInfo);
            if (configDataAgain && configDataAgain[0].data.sysInfo)
                break;
        }

    };

    if (!allProbesArray.length || loading) {
        return <GlobalLoader />
    }

    return (
        <Dialog open={isFormModalOpen} onClose={() => { }} static={true}>
            <DialogPanel className="overflow-visible rounded-md p-0 sm:max-w-5xl">
                <TooltipProvider>
                    <form action="#" method="POST">
                        {/* Form Header */}
                        <div className="flex justify-between items-center gap-3 py-4 px-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                File System Configuration
                            </h3>
                            <button type="button" aria-label="Close" onClick={() => handleClose()}
                                className="rounded-sm p-2 text-tremor-content-subtle hover:bg-tremor-background-subtle hover:text-tremor-content
                            dark:text-dark-tremor-content-subtle hover:dark:bg-dark-tremor-background-subtle hover:dark:text-tremor-content">
                                <X className="size-5 shrink-0" aria-hidden={true} />
                            </button>
                        </div>

                        <div className="max-h-[80vh] overflow-y-auto py-4 px-6 space-y-8">
                            {/* Section 1: Basic Information */}
                            <div className="space-y-4">
                                {/* <h3 className="text-lg text-gray-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Basic Information
                                </h3> */}

                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="config_name" className="text-sm font-medium text-widget-mainHeader">
                                        Configuration Name <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="space-y-2">
                                        <Input
                                            id="config_name"
                                            name="config_name"
                                            value={formData.config_name}
                                            className={
                                                errors.config_name
                                                    ? "w-full border border-red-500 rounded-md"
                                                    : "w-full"
                                            }
                                            onChange={handleInputChange}
                                            placeholder="e.g., File System Config - FS1 2025"
                                        />

                                        {errors.config_name && (
                                            <p className="text-xs text-red-500">
                                                {errors.config_name}
                                            </p>
                                        )}
                                    </div>
                                </div>


                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="probe_id" className="text-sm font-medium text-widget-mainHeader">
                                        Probe <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="space-y-2">
                                        <Select
                                            id="probe_id"
                                            name="probe_id"
                                            value={formData.probe_id}
                                            disabled={savedDataToBePopulated ? true : false}
                                            className={
                                                errors.probe_id
                                                    ? "w-full border border-red-500 rounded-md"
                                                    : "w-full"
                                            }
                                            onValueChange={(val) => {
                                                setFormData((prev) => ({ ...prev, probe_id: val }))
                                            }}
                                        >
                                            {allProbesArray.map((eachProbeDetails) => (
                                                <SelectItem key={eachProbeDetails.PROBE_ID} value={eachProbeDetails.PROBE_ID}>
                                                    {eachProbeDetails.PROBE_NAME}
                                                </SelectItem>
                                            ))}
                                        </Select>

                                        {errors.probe_id ? (
                                            <p className="text-xs text-red-500">
                                                {errors.probe_id}
                                            </p>
                                        ) : undefined}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Probe Machine Configuration */}
                            <div className="space-y-4">
                                {/* <h3 className="text-lg text-gray-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Probe Machine Configuration
                                </h3> */}

                                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                                    <h3 className="text-lg text-gray-600 dark:text-slate-300">
                                        Probe Machine Configuration
                                    </h3>
                                    <Button type="button" variant="outline" onClick={fetchSysInfo} className="border-slate-600 text-slate-300 hover:text-white bg-transparent">
                                        Fetch System Info
                                    </Button>
                                </div>
                                <div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="ip_address" className="text-sm font-medium text-widget-mainHeader">
                                                IP Address <span className="text-red-500">*</span>
                                            </Label>

                                            <IpInput
                                                name="ip_address"
                                                id="ip_address"
                                                error={!!errors.ip_address}
                                                value={sysInfo?.ip_address ? sysInfo.ip_address : formData.ip_address}
                                                onChangeFunction={handleIpInputChange}
                                                disabled={savedDataToBePopulated ? true : false}
                                            />

                                            {errors.ip_address && (
                                                <p className="text-xs text-red-500">
                                                    {errors.ip_address}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="hostname" className="text-sm font-medium text-widget-mainHeader">
                                                Host Name <span className="text-red-500">*</span>
                                            </Label>

                                            <Input
                                                id="hostname"
                                                name="hostname"
                                                value={sysInfo?.host_name ? sysInfo.host_name : formData.hostname}
                                                disabled={savedDataToBePopulated ? true : false}
                                                className={
                                                    errors.hostname
                                                        ? "w-full border border-red-500 rounded-md"
                                                        : "w-full"
                                                }
                                                onChange={handleInputChange}
                                                placeholder="e.g., KERLPTP-10"
                                            />

                                            {errors.hostname && (
                                                <p className="text-xs text-red-500">
                                                    {errors.hostname}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="probe_machine_os_type" className="text-sm font-medium text-widget-mainHeader">
                                                Operating System <span className="text-red-500">*</span>
                                            </Label>

                                            <div className="space-y-2">
                                                <Input
                                                    id="probe_machine_os_type"
                                                    name="probe_machine_os_type"
                                                    value={sysInfo?.os_name ? sysInfo.os_name : formData.probe_machine_os_type}
                                                    disabled={savedDataToBePopulated ? true : false}
                                                    className={
                                                        errors.probe_machine_os_type
                                                            ? "w-full border border-red-500 rounded-md"
                                                            : "w-full"
                                                    }
                                                    onChange={handleInputChange}
                                                />

                                                {errors.probe_machine_os_type ? (
                                                    <p className="text-xs text-red-500">
                                                        {errors.probe_machine_os_type}
                                                    </p>
                                                ) : undefined}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 py-4 px-6 border-t border-slate-200 dark:border-slate-700">
                            <Button type="button" variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:text-white bg-transparent">
                                Cancel
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={savedDataToBePopulated ? handleConfigUpdate : handleSubmit}>
                                {`${savedDataToBePopulated ? "Update" : "Save"} Configuration`}
                            </Button>
                        </div>
                    </form>
                </TooltipProvider>
            </DialogPanel>
        </Dialog >
    )
}
