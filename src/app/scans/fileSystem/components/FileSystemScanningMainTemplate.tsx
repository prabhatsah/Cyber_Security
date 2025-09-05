"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import ScanDashboard from "./ScanDashboard";
import { Select, SelectItem } from "@tremor/react"
import { Input } from "@/components/Input"
import { FileSystemConfigData } from "@/app/globalType";
import { LuRefreshCw } from "react-icons/lu";
import { GiElectric } from "react-icons/gi";

interface ErrorState {
    [key: string]: string | Array<string>;
}

export default function FileSystemScanningMainTemplate({ fileSystemConfigDetails }: { fileSystemConfigDetails: FileSystemConfigData[] }) {
    const [selectedProbeId, setSelectedProbeId] = useState<string>("");
    const [filePath, setFilePath] = useState<string>("");
    const [errors, setErrors] = useState<ErrorState>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async () => {
        setIsLoading(true);

        setIsLoading(false);
    };

    const fetchData1 = async (searchType: string): Promise<void> => {
        // try {
        //     console.log("SUCCESS");
        // } catch (err) {
        //     if (err instanceof Error) {
        //         setError(err.message);
        //     } else {
        //         setError("An unknown error occurred");
        //     }
        // }
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
                        {/* <SearchBar query={query} setQuery={setQuery} fetchData={fetchData1} /> */}
                        {/* {error && <p className="text-red-600 text-center">{error}</p>} */}
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
                    <strong className="text-white">
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


                {/* {data && (
                    <div className="space-y-8">
                        <Widgets widgetData={data} queryUrl={query} />
                    </div>
                )} */}

                {/* <div>
                    <PastScans pastScans={pastScansForWidget} onOpenPastScan={handleOpenPastScan} />
                </div> */}
            </div>

            <ScanDashboard />
        </>
    );
}
