import {
    Table,
    TableBody,
    TableHead,
    TableHeaderCell,
    TableRow,
    TableCell,
    TableRoot
} from "@/components/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { FaChartPie } from "react-icons/fa6";
import { AiFillDashboard } from "react-icons/ai";
import { useState, useEffect } from "react";
import VulnerabilitiesStats from "./stats";
import CustomPieChart from "./vulnerabilitiesPie";
import { Maximize, Minimize } from "lucide-react";
import { Badge } from "@tremor/react";
import { severity } from "@/app/scans/WebApi/data";

// const getVulnerabiliites = (historyImages: any) => {
//     return severityArray;
// }

const DynamicResultRendering = ({ scanningItem, outputScan, latestResult }) => {
    console.log(latestResult)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [currSeverity, setCurrSeverity] = useState<any>([]);
    let vul: any;
    const severity = new Map<string, number>([
        ["LOW", 0],
        ["MEDIUM", 0],
        ["HIGH", 0],
        ["CRITICAL", 0],
    ]);

    if (
        outputScan.Results[0].Vulnerabilities &&
        outputScan.Results[0].Vulnerabilities.length > 0
    ) {
        vul = outputScan.Results[0].Vulnerabilities;
        for (let i = 0; i < vul.length; i++) {
            if (!severity.has(vul[i].Severity))
                severity.set(vul[i].Severity, 1);
            else {
                let count: number = severity.get(vul[i].Severity) || 0;
                severity.set(vul[i].Severity, count + 1);
            }
        }
        console.log(severity);
    }

    const severityArray = Array.from(severity, ([severity, count]) => ({
        severity,
        count,
    }));
    console.log(severityArray)
    //  console.log(currSeverity);


    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case "High":
                return "bg-red-500 text-white";
            case "Medium":
                return "bg-yellow-500 text-black";
            case "Low":
                return "bg-green-500 text-black";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <div>
            <h1 className="flex text-lg mt-8 font-semibold text-gray-900 dark:text-white">
                Scanned Results for{" "}
                <p className="ms-1 font-bold">{scanningItem}</p> :-
            </h1>

            <div className="mt-3 p-6 rounded-lg shadow-lg">
                <div className="rounded-lg bg-gray-500">
                    <div className="bg-gray-100 dark:bg-[#0f172a] p-4 rounded-md shadow-md">
                        <h4 className="text-lg dark:text-white font-semibold text-gray-900 mb-4">
                            Information
                        </h4>
                        {outputScan && outputScan.Results?.length > 0 ? (
                            <>
                                <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Name:
                                    </h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">
                                        {outputScan.Results[0].Target}
                                    </p>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] rounded-lg space-x-1">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Type:
                                    </h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">
                                        {outputScan.ArtifactType}
                                    </p>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Repository:
                                    </h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">
                                        {outputScan.Metadata?.RepoTags?.[0] || "N/A"}
                                    </p>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Architecture:
                                    </h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">
                                        {outputScan.Metadata?.ImageConfig?.architecture || "N/A"}
                                    </p>
                                </div>
                                <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Operating System:
                                    </h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">
                                        {outputScan.Metadata?.ImageConfig?.os || "N/A"}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-600">No scan data available.</p>
                        )}
                    </div>
                </div>

                {severityArray && severityArray.length > 0 && (
                    <>
                        <div className="mt-6 bg-gray-100 dark:bg-[#0f172a] p-4 rounded-lg shadow-md">
                            <h4 className="text-lg dark:text-white font-semibold text-gray-900 mb-4">
                                Stats
                            </h4>
                            <Tabs defaultValue="tab1">
                                <TabsList variant="solid">
                                    <TabsTrigger value="tab1" className="gap-1.5 flex">
                                        <AiFillDashboard className="-ml-1 size-4" aria-hidden="true" />
                                        Card
                                    </TabsTrigger>
                                    <TabsTrigger value="tab2" className="gap-1.5 flex">
                                        <FaChartPie className="-ml-1 size-4" aria-hidden="true" />
                                        Visualization
                                    </TabsTrigger>
                                </TabsList>
                                <div className="mt-4">
                                    <TabsContent value="tab1">
                                        <VulnerabilitiesStats severityArray={severityArray} />
                                    </TabsContent>
                                    <TabsContent value="tab2">
                                        <CustomPieChart data={severityArray} />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </>
                )}

                {latestResult &&
                    latestResult[0].Vulnerabilities &&
                    latestResult[0].Vulnerabilities.length > 0 ? (
                    <>
                        <div
                            className={`mt-6 bg-gray-100 dark:bg-[#0f172a] p-4 rounded-lg shadow-md ${isFullScreen
                                ? "fixed top-0 left-0 w-full h-full z-50 bg-white dark:bg-[#0f172a] p-8"
                                : ""
                                }`}
                        >
                            <div className="relative">
                                <a
                                    onClick={toggleFullScreen}
                                    className="absolute cursor-pointer top-0 right-0 text-black dark:text-white rounded-md hover:bg-grey-600"
                                >
                                    {isFullScreen ? (
                                        <Minimize size={20} />
                                    ) : (
                                        <Maximize size={20} />
                                    )}
                                </a>

                                <div className="flex items-center">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Report for {scanningItem}
                                    </h4>
                                </div>
                            </div>
                            <TableRoot
                                className={`overflow-x-auto overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-gray-800 ${isFullScreen ? "max-h-[90vh]" : "max-h-[80vh]"
                                    }`}
                            >
                                <Table>
                                    <TableHead className="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10 rounded-lg">
                                        <TableRow>
                                            <TableHeaderCell>ID</TableHeaderCell>
                                            <TableHeaderCell>Source</TableHeaderCell>
                                            <TableHeaderCell>Severity</TableHeaderCell>
                                            <TableHeaderCell>DataSource</TableHeaderCell>
                                            <TableHeaderCell>Cause</TableHeaderCell>
                                            <TableHeaderCell>Description</TableHeaderCell>
                                            <TableHeaderCell>References</TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {latestResult[0].Vulnerabilities?.map((row: any) => (
                                            <TableRow key={row.VulnerabilityID}>
                                                <TableCell>{row.VulnerabilityID}</TableCell>
                                                <TableCell>{row.SeveritySource}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`px-3 py-1 rounded-md font-medium ${getSeverityStyles(
                                                            row.Severity
                                                        )}`}
                                                    >
                                                        {row.Severity}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <ul className="list-disc pl-4">
                                                        <li>
                                                            <strong>ID:</strong> {row.DataSource.ID}
                                                        </li>
                                                        <li>
                                                            <strong>Name:</strong>{" "}
                                                            {row.DataSource.Name}
                                                        </li>
                                                        <li>
                                                            <strong>URL:</strong>
                                                            <a
                                                                href={row.DataSource.URL}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 underline"
                                                            >
                                                                {row.DataSource.URL}
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </TableCell>
                                                <TableCell className="whitespace-normal break-words max-w-xs">
                                                    {row.Title}
                                                </TableCell>
                                                <TableCell className="whitespace-normal break-words max-w-s">
                                                    {row.Description}
                                                </TableCell>
                                                <TableCell>
                                                    <ul className="list-disc pl-4">
                                                        {row.References?.map(
                                                            (element: string, index: number) => (
                                                                <li key={index}>
                                                                    <a
                                                                        href={element}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 underline"
                                                                    >
                                                                        {element}
                                                                    </a>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableRoot>
                        </div>
                    </>
                ) : (
                    <>
                        <pre className="p-4 mt-6 bg-yellow-100 text-green-600 border border-red-300 rounded-lg">
                            There are no vulnearibilities in this image
                        </pre>
                    </>
                )}

            </div>
        </div >
    );
};

export default DynamicResultRendering;
