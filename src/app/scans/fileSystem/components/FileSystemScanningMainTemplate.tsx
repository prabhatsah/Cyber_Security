"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import ScanDashboard from "./ScanDashboard";
import { Select, SelectItem } from "@tremor/react"
import { Input } from "@/components/Input"
import { FileSystemConfigData, FileSystemFullInstanceData } from "@/app/globalType";
import { LuRefreshCw } from "react-icons/lu";
import { GiElectric } from "react-icons/gi";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { getMyInstancesV2, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { toast } from "@/lib/toast";
import PastScans from "@/components/PastScans";

interface ErrorState {
    [key: string]: string | Array<string>;
}

export default function FileSystemScanningMainTemplate({ fileSystemConfigDetails }: { fileSystemConfigDetails: FileSystemConfigData[] }) {
    const [selectedProbeId, setSelectedProbeId] = useState<string>("");
    const [filePath, setFilePath] = useState<string>("");
    const [errors, setErrors] = useState<ErrorState>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<any>(null);

    console.log("scannedData", scannedData);

    const validateSearch = (): boolean => {
        const newErrors: ErrorState = {};

        if (!selectedProbeId) {
            newErrors.probeId = "Please select a Configuration";
        } else if (!fileSystemConfigDetails.find(eachConfigDetails => eachConfigDetails.probe_id === selectedProbeId)) {
            newErrors.probeId =
                "Please select a valid Configuration";
        }

        const filePathRegex = /^(?:[a-zA-Z]:\\|\/)(?:[^<>:"|?*\n]+[\\/])*[^<>:"|?*\n]+$/;
        if (!filePath) {
            newErrors.filePath = "File Path cannot be blank. Please provide a valid File Path";
        } else if (!filePath.match(filePathRegex)) {
            newErrors.filePath = "Please provide a valid File Path";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSearch = async (): Promise<void> => {
        setErrors({});
        setIsLoading(true);

        if (!validateSearch()) {
            setIsLoading(false);
            return;
        }

        try {
            let userInfo = await getLoggedInUserProfile()
            let user_id = userInfo?.USER_ID;
            let user_login = userInfo?.USER_LOGIN;
            let file_system_id = uuidv4();
            let scan_path = filePath;

            let processId = await mapProcessName({ processName: "File System Scan" });
            console.log("SUCCESS", processId, scan_path, selectedProbeId);

            await startProcessV2({
                processId: processId,
                data: { user_id: user_id, probe_id: selectedProbeId, user_login: user_login, file_system_id: file_system_id, scan_path: scan_path },
                processIdentifierFields: "file_system_id,user_id,user_login"
            })

            let result;
            while (true) {
                result = await getMyInstancesV2<FileSystemFullInstanceData>({
                    processName: 'File System Scan',
                    processVariableFilters: { 'file_system_id': file_system_id }
                });
                if (result && result[0].data.scan_data) {
                    console.log("result[0].data.scan_data", result[0].data);
                    setScannedData(result[0].data.scan_data);
                    setIsLoading(false);
                    setErrors({});
                    toast.push("File System Scanned Successfully", "success");
                    break;
                }
            }
        }
        catch (err) {
            setIsLoading(false);
            if (err instanceof Error) {
                toast.push(err.message, "error");
            } else {
                toast.push("An unknown error occurred", "error");
            }
        }
    };

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
            <div className="">
                <h2 className="font-bold text-pageheader">File System Scanning</h2>


                <div className="flex justify-between items-center gap-6 w-full">
                    <div className="w-1/2 space-y-2 py-4">
                        <Select
                            id="probeId"
                            name="probeId"
                            value={selectedProbeId}
                            className={
                                errors.probeId
                                    ? "w-full border border-red-500 rounded-md"
                                    : "w-full rounded-md"
                            }
                            onValueChange={(val) => {
                                setSelectedProbeId(val);
                            }}
                            placeholder="Select a Configuration..."
                        >
                            {fileSystemConfigDetails.map((eachConfigDetails, index) => (
                                <SelectItem key={`${eachConfigDetails.config_id}-${index}`} value={eachConfigDetails.probe_id}>
                                    {`${eachConfigDetails.config_name} - (${eachConfigDetails.probe_name})`}
                                </SelectItem>
                            ))}
                        </Select>

                        {errors.probeId && (
                            <p className="text-xs text-red-500">
                                {errors.probeId}
                            </p>
                        )}
                    </div>

                    <div className="w-1/2 space-y-2 py-4">
                        <Input
                            id="filePath"
                            name="filePath"
                            value={filePath}
                            disabled={!selectedProbeId ? true : false}
                            className={
                                errors.filePath
                                    ? "w-full border border-red-500"
                                    : "w-full"
                            }
                            onChange={(event) => {
                                setFilePath(event.target.value);
                            }}
                            placeholder="e.g., C:\Users\KEROSS\Downloads\Example_File_Path"
                        />

                        {errors.filePath && (
                            <p className="text-xs text-red-500">
                                {errors.filePath}
                            </p>
                        )}
                    </div>

                    <div className="py-4">
                        <button
                            onClick={handleSearch}
                            disabled={isLoading || !selectedProbeId}
                            className={`flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg
                                ${isLoading || !selectedProbeId ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? (
                                <span className="animate-spin"><LuRefreshCw /></span>
                            ) : (
                                <GiElectric size={20} style={{ transform: 'rotate(15deg)' }} />
                            )}
                            {isLoading ? "Scanning..." : "Scan"}
                        </button>
                    </div>
                </div>

                <div className="text-gray-900 text-xs dark:text-white">
                    By submitting data above, you are agreeing to our{" "}
                    <a
                        href="https://cloud.google.com/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                        href="https://cloud.google.com/terms/secops/privacy-notice"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        Privacy Notice
                    </a>
                    , and to the{" "}
                    <strong>
                        sharing of your submission with the security community.
                    </strong>{" "}
                    Please do not submit any personal information; we are not responsible
                    for the contents of your submission.{" "}
                    <a
                        href="https://docs.virustotal.com/docs/how-it-works"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        Learn more
                    </a>
                    .
                </div>

                {/* <div>
                    <PastScans pastScans={pastScansForWidget} onOpenPastScan={handleOpenPastScan} />
                </div> */}
            </div>

            {scannedData && <ScanDashboard scanResult={scannedData} />}
        </>
    );
}
