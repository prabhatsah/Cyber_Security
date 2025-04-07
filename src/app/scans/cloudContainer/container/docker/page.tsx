"use client";
import { Table, TableBody, TableCaption, TableCell, TableFoot, TableHead, TableHeaderCell, TableRoot, TableRow, } from "@/components/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import { useState, useRef, useEffect } from "react";
import dockerCommands from "../docker-commands.json";
import VulnerabilitiesStats from "./stats";
import CustomPieChart from "./vulnerabilitiesPie";
import { Maximize, Minimize, Play } from "lucide-react";
import * as api from "@/utils/api";
import { Card, Title, Text, Button } from "@tremor/react";
import { TextInput } from "@tremor/react";
import { Badge } from "@tremor/react";
import * as prevScans from "./scanHistory";
import {
  getTotalVulnerabilitiesForImages,
  ScannedImages,
} from "./sideMenuHistory";
import { FaChartPie } from "react-icons/fa6";
import { AiFillDashboard } from "react-icons/ai";
import DynamicResultRendering from "./dynamicResultRendering";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion"; // Update with your actual file path
import DivLoading from "@/components/divLoading";
type CommandKey = keyof typeof dockerCommands;

export default function ContainerDashboard({ onBack }: { onBack: () => void }) {
  const [tableType, setTableType] = useState("");
  const [imageScan, setImageScan] = useState(0);
  const [imageScanLocal, setImageScanLocal] = useState(0);
  const [imageName, setImageName] = useState("");
  const [imageVersion, setImageVersion] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [outputScan, setOutputScan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<CommandKey | null>(null);
  const [scanResults, setScanResults] = useState<Record<string, any>>({});
  const [scanningItem, setScanningItem] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [currSeverity, setCurrSeverity] = useState<
    { severity: string; count: number }[]
  >([]);

  const [fileScan, setFileScan] = useState(0);
  const [imageFiles, setImageFiles] = useState<string | null>(null);
  const [fileSystemResult, setfileSystemResult] = useState<Record<string, any>>(
    {}
  );

  const [scannedImagesDetails, setScannedImagesDetails] = useState<any>();
  const [scannedImages, setScannedImages] = useState<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tableResult, setTableResult] = useState<any>();
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanDetails, setScanDetails] = useState(null);
  function cleanAndFormatJson(jsonString: string): string {
    jsonString = jsonString.replace(/\"\/bin\/sh\"/g, "");
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  }
  useEffect(() => {
    console.log(tableResult);
  }, [tableResult]);

  useEffect(() => {
    if (prevScans.Vulnerabilitiesgetter()) {
      console.log(prevScans.Vulnerabilitiesgetter());
      setScannedImages(prevScans.Vulnerabilitiesgetter());
    }
  }, []);

  useEffect(() => {
    console.log(fileSystemResult);
  }, [fileSystemResult]);

  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "high":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const saveHistoryScans = (command: string | null, data: any | null) => {
    console.log(command, data);
    const name = "image_file_scanning";
    let type = command?.includes("Img") ? "Image" : "File";

    let history = data?.Metadata?.ImageConfig?.history;

    const key =
      type === "Image" ? data?.Metadata?.RepoTags[0] : data?.Results[0].Target;

    if (type === "Image") {
      data.Metadata.ImageConfig.history = history.map((entry: any) => {
        if (entry.created_by) {
          const { created_by, ...rest } = entry;
          return rest;
        }
        return entry;
      });
    }
    console.log(command, data);

    return api.updateColumnGeneralised(name, "data", data, key, "type", type);
  };

  const [logs, setLogs] = useState<any>([]);

  const logsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const runCommand = async (
    commandKey: CommandKey,
    params: Record<string, string> = {},
    itemId: string | null = null,
    flag: number = 0
  ) => {
    let data: any;
    setError(null);
    setLoading(commandKey)
    setScanningItem(itemId)
    const response = await fetch("/api/cloud-container/run-docker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commandKey, params }),
    });

    if (!response.body) {
      console.error("No response body");
      setError("Failed to stream logs.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = "";

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        let lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {

          if (line.trim().startsWith("{") && line.trim().endsWith("}")) {
            const data = JSON.parse(line.trim());
            const timestamp = new Date().toLocaleTimeString();
            if (data.log) {
              setLogs((prevLogs: any) => [...prevLogs, { timestamp, message: `[${timestamp}] ${data.log}`, type: "log" }]);
            }
            if (data.error) {
              setLogs((prevLogs: any) => [...prevLogs, { timestamp, message: `${data.error}`, type: "error" }]);
            }
            if (data.output) {
              console.log("this is the data inside finalOutput ==>");
              console.log(data.output?.result);
              const severity = new Map<string, number>([
                ["LOW", 0],
                ["MEDIUM", 0],
                ["HIGH", 0],
                ["CRITICAL", 0],
              ]);
              if (flag == 1) {
                console.log(data);
                const formattedString = cleanAndFormatJson(data.output.result);
                let finalResult: any;
                console.log("after saveHistory line 187-->")
                finalResult = JSON.parse(formattedString);
                //saveHistoryScans(commandKey, finalResult).then(setTableResult);
                //console.log(finalResult);
                setOutputScan(finalResult);
                setScanResults((prevResults) => ({
                  ...prevResults,
                  [itemId!]: finalResult?.Results ?? finalResult,
                }));
                console.log(scanResults);
                let vul: any;
                if (
                  finalResult &&
                  finalResult.Results &&
                  finalResult.Results.length > 0
                ) {
                  console.log("Entering vul");
                  setLatestResult(finalResult.Results[0]);
                  if (
                    finalResult.Results[0].Vulnerabilities &&
                    finalResult.Results[0].Vulnerabilities.length > 0
                  ) {
                    vul = finalResult.Results[0].Vulnerabilities;
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
                  setCurrSeverity(severityArray);
                  console.log(currSeverity);
                }
              } else if (flag == 2) {
                const formattedString = cleanAndFormatJson(data.output.result);
                let finalResult: any;
                finalResult = JSON.parse(formattedString);
                finalResult["fileName"] = itemId;
                saveHistoryScans(commandKey, finalResult).then(setTableResult);
                //fetchAndProcessHistory();
                setfileSystemResult(finalResult);
              }
              else {
                console.log("Entering else")
                setOutput(null)
                const parsedData = data.output.result
                  .trim()
                  .split("\n")
                  .map((line: any) => JSON.parse(line));
                console.log(parsedData);
                setImageScan(0);
                setOutput(parsedData);
                setScanResults((prevResults: any) => ({
                  ...prevResults,
                  [itemId!]: parsedData,
                }));
              }
            }
          }
        }
      }
      done = streamDone;
    }
    setLoading(null)
  };


  function showImageDetails(imageName: string) {
    console.log("Clicked image:", imageName);
    setScannedImagesDetails(imageName);
    setOutputScan(null);

    const details = prevScans.fetchDetailsOfParticularImage(imageName);
    console.log(details);


    setScanDetails(details);
    console.log(getTotalVulnerabilitiesForImages(details));
  }

  return (
    <>
      <div className="flex justify-start w-full">
        <span
          onClick={onBack}
          className="px-2 text-lg text-bold text-gery-500 cursor-pointer"
        >
          ←
        </span>
      </div>
      <div className="p-4 w-full">

        {/* start from here*/}
        <Text className="!text-2xl !mt-1 !mb-9 flex items-center justify-center !text-center !w-full text-black dark:text-white">
          Docker Security Scanning & Image Analysis
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-full px-3">
          <Card className="p-6 rounded-lg w-full max-h-[270px] flex flex-col justify-between shadow-md bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-500 dark:text-blue-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <Title className="text-primary">List All Images (Local)</Title>
              </div>
            </div>

            <div className="p-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow overflow-hidden text-ellipsis line-clamp-2">
              <Text className="mt-1">
                Use <code>docker scan</code> to check for vulnerabilities. Save
                and transfer images easily with
                <code>docker save</code> and <code>docker load</code>.
              </Text>
            </div>

            <div className="mt-3 flex justify-center">
              <Button
                className="!text-white flex items-center justify-center gap-2 px-5 py-2 text-white font-semibold rounded-lg transition-all bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  runCommand("showALLImgs");
                  setImageScanLocal(0);
                  setImageScan(0);
                  setTableType("Images");
                  setLogs([]);
                  setScanDetails(null);
                }}
                disabled={loading === "showALLImgs"}
              >
                {loading === "showALLImgs" ? (
                  DivLoading()
                ) : (
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-white" />
                    <span>Run</span>
                  </span>
                )}
              </Button>
            </div>
          </Card>
          <Card className="p-6 rounded-lg w-full max-h-[270px] flex flex-col justify-between shadow-md bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-500 dark:text-blue-300"
                >
                  <rect
                    x="4"
                    y="6"
                    width="16"
                    height="12"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                  />
                  <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" />
                  <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" />
                </svg>
                <Title className="text-primary">
                  List All Containers (Local)
                </Title>
              </div>
            </div>

            <div className="p-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow overflow-hidden text-ellipsis line-clamp-2">
              <Text className="mt-1">
                Track container history, troubleshoot issues, and manage
                inactive containers by identifying their status and last run
                time.
              </Text>
            </div>

            <div className="mt-3 flex justify-center">
              <Button
                className="!text-white flex items-center justify-center gap-2 px-5 py-2 text-white font-semibold rounded-lg transition-all bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  runCommand("listDockerContainers");
                  setImageScanLocal(0);
                  setImageScan(0);
                  setTableType("Containers");
                  setLogs([]);
                  setScanDetails(null);
                }}
                disabled={loading === "listDockerContainers"}
              >
                {loading === "listDockerContainers" ? (
                  DivLoading()
                ) : (
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-white" />
                    <span>Run</span>
                  </span>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6 rounded-lg w-full max-h-[270px] flex flex-col justify-between shadow-md bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-500 dark:text-blue-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7V5a2 2 0 0 1 2-2h2M3 17v2a2 2 0 0 0 2 2h2M17 3h2a2 2 0 0 1 2 2v2M17 21h2a2 2 0 0 0 2-2v-2"
                  />
                  <rect x="7" y="7" width="10" height="10" rx="2" />
                  <path d="M10 12h4" />
                </svg>
                <Title className="text-primary">Scan a Remote Image</Title>
              </div>
            </div>

            <div className="p-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow overflow-hidden text-ellipsis line-clamp-2">
              <Text className="mt-1">
                Scan a remote image directly from a registry by specifying the
                image name and tag. Example:{" "}
                <code>docker scan repository/image:tag</code>.
              </Text>
            </div>

            <div className="mt-3 flex justify-center">
              <Button
                className="!text-white flex items-center justify-center px-5 py-2 text-white font-semibold rounded-lg transition-all bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setImageScan(1);
                  setTableType("scanRemote");
                  setLogs([]);
                  setScanDetails(null);
                }}
              >
                {loading === "scanRemoteImg" ? (
                  DivLoading()
                ) : (
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-white" />
                    <span>Run</span>
                  </span>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-6 rounded-lg w-full max-h-[270px] flex flex-col justify-between shadow-md bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-500 dark:text-blue-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 6h4l2-2h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
                  />
                </svg>
                <Title className="text-primary">Scan File System (Local)</Title>
              </div>
            </div>

            <div className="p-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed flex-grow overflow-hidden text-ellipsis line-clamp-2">
              <Text className="mt-1">
                You can scan your system for security issues using a
                container-based tool. If the tool is installed, you can run it
                directly.
              </Text>
            </div>

            <div className="mt-3 flex justify-center">
              <Button
                className="!text-white flex items-center justify-center px-5 py-2 text-white font-semibold rounded-lg transition-all bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setFileScan(1);
                  setImageScan(0);
                  setTableType("FileScanning");
                  setScanDetails(null);
                  setLogs([]);
                }}
              >
                {loading === "scanFileSystem" ? (
                  DivLoading()
                ) : (
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-white" />
                    <span>Run</span>
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/*------------------------------------------- Accordion starts ------------------------------------------------------------*/}

        <Accordion type="single" collapsible className="shadow-md mt-6 p-0 bg-blue-50 dark:bg-gray-900 rounded-lg">
          <AccordionItem value="live-logs">
            <AccordionTrigger className="mt-2 px-3 py-3 dark:text-white rounded-lg text-xl font-semibold">
              <h2 className="text-2xl font-semibold">Live Logs</h2>
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-lg">
                <TableRoot
                  ref={logsContainerRef}
                  className="my-table-container max-h-[300px] overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-gray-800"
                >
                  <Table>
                    <TableHead className="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10 rounded-lg">
                      <TableRow>
                        <TableHeaderCell className="px-6 py-4 w-[30%] text-gray-800 dark:text-gray-200">
                          Timestamp
                        </TableHeaderCell>
                        <TableHeaderCell className="text-center px-6 py-4 w-[70%] text-gray-800 dark:text-gray-200">
                          Log Message
                        </TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {logs.length > 0 ? (
                        logs.map(({ timestamp, message, type }, index) => {
                          return (
                            <TableRow key={index} className="">
                              <TableCell className={type === "error" ? "font-mono text-red-500" : "font-mono text-blue-500"}>[{timestamp}]</TableCell>
                              <TableCell className={`whitespace-normal break-words px-6 py-4 w-[100%] font-mono no-underline ${type === "error" ? "font-mono text-red-500" : "font-mono text-blue-500"}`}>
                                {message}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-gray-500">No logs available yet...</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableRoot>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/*----------------------------------------------------------------------------------------*/}
        <div className="mt-6">
          {fileScan !== 0 && tableType == "FileScanning" && (
            <div className="mt-4 px-3">
              <div className="mb-4 flex items-center space-x-2">
                <div className="w-full">
                  <TextInput
                    id="imagePath"
                    type="text"
                    placeholder="Enter file path"
                    onChange={(e) => setImageFiles(e.target.value)}
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (imageFiles) {
                      console.log(imageFiles);
                      const fileName = imageFiles.split("\\").pop();
                      console.log(fileName);
                      runCommand(
                        "scanFileSystem",
                        { FILE_PATH: imageFiles },
                        fileName,
                        2
                      ); setLogs([]);
                    } else {
                      setError("Please select a directory");
                    }
                  }}
                  disabled={loading === "scanFileSystem"}
                  className={`flex items-center px-4 py-2 text-white font-semibold rounded-lg transition-all ${loading === "scanFileSystem"
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading === "scanFileSystem" ? (
                    "Scanning..."
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-white mr-2"
                      >
                        <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z" />
                      </svg>
                      Scan
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {imageScan !== 0 && (
            <div className="mt-4 px-3">
              <div className="mb-4 flex space-x-2">
                <div className="w-1/2">
                  <TextInput
                    id="imageName"
                    type="text"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder="Enter image name"
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="w-1/2">
                  <TextInput
                    id="imageVersion"
                    type="text"
                    value={imageVersion}
                    onChange={(e) => setImageVersion(e.target.value)}
                    placeholder="Enter image version"
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (imageName) {
                        if (!imageVersion || imageVersion == "")
                          setImageVersion("latest");

                        console.log(`${imageName}:${imageVersion}`);
                        runCommand(
                          "scanRemoteImg",
                          { REMOTE_IMAGE: `${imageName}:${imageVersion}` },
                          `${imageName}:${imageVersion}`,
                          1
                        );
                      } else {
                        setError("Please provide image name");
                      }
                    }}
                    disabled={loading === "scanRemoteImg"}
                    className={`flex items-center px-2 py-2 text-white font-semibold rounded-lg transition-all ${loading === "scanRemoteImg"
                      ? "bg-grey-800 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading === "scanRemoteImg" ? (
                      "Scanning..."
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-white"
                        >
                          <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z" />
                        </svg>
                        Scan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            DivLoading()
          ) : tableType === "Containers" && output ? (
            <div className="bg-blue-50 dark:bg-gray-900 p-5 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Containers</h2>

              <div className="max-h-[500px] overflow-y-auto rounded-lg scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-gray-800">
                <TableRoot className="w-full">
                  <Table className="w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <TableHead className="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10 rounded-lg">
                      <TableRow>
                        <TableHeaderCell className="px-6 py-4 w-[20%] text-gray-800 dark:text-gray-200">
                          ID
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-4 w-[25%] text-gray-800 dark:text-gray-200">
                          Container
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-4 w-[25%] text-gray-800 dark:text-gray-200">
                          Image
                        </TableHeaderCell>
                        <TableHeaderCell className="px-6 py-4 w-[20%] mx-4 text-gray-800 dark:text-gray-200">
                          Action
                        </TableHeaderCell>
                      </TableRow>
                    </TableHead>

                    <TableBody className="divide-y divide-gray-300 dark:divide-gray-700">
                      {output?.map((row: any) => (
                        <TableRow
                          key={row.ID}
                          className="hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-200"
                        >
                          <TableCell className="px-6 py-4 w-[20%] font-mono text-blue-600 dark:text-blue-400">
                            {row.ID}
                          </TableCell>
                          <TableCell className="px-6 py-4 w-[25%] text-gray-700 dark:text-gray-300">
                            {row.Names}
                          </TableCell>
                          <TableCell className="px-6 py-4 w-[25%] text-gray-700 dark:text-gray-300">
                            {row.Image}
                          </TableCell>
                          <TableCell className="px-6 py-4 w-[20%] flex justify-center items-center">
                            <button
                              onClick={() => {
                                runCommand(
                                  "scanLocalImg",
                                  { LOCAL_IMAGE: row.Image },
                                  row.Names,
                                  1
                                ); setLogs([]);
                              }}
                              disabled={loading === row.Image}
                              className={`flex items-center justify-center gap-1 px-2 py-2 w-18 rounded-lg font-xs transition ${loading === row.Image
                                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                } text-white`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5 text-white"
                              >
                                <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z" />
                              </svg>
                              <span>Scan</span>
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableRoot>
              </div>
            </div>
          ) : tableType == "Images" && output ? (
            <div className=" shadow-md bg-blue-50 dark:bg-gray-900 p-5 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Images</h2>

              <TableRoot className="my-table-container max-h-[300px] overflow-y-auto  rounded-lg scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-gray-800">
                <Table className="my-table">
                  <TableHead className="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10 rounded-lg">
                    <TableRow>
                      <TableHeaderCell className="px-6 py-4 w-[30%] text-gray-800 dark:text-gray-200">
                        Image ID
                      </TableHeaderCell>
                      <TableHeaderCell className="px-6 py-4 w-[40%] text-gray-800 dark:text-gray-200">
                        Repository (Name)
                      </TableHeaderCell>
                      <TableHeaderCell className="px-6 py-4 w-[30%] text-gray-800 dark:text-gray-200">
                        Action
                      </TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="">
                    {output!.map((row: any) => (
                      <TableRow
                        key={row.ID}
                        className="hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-200"
                      >
                        <TableCell className="px-6 py-4 w-[30%] font-mono text-blue-600 dark:text-blue-400">
                          {row.ID}
                        </TableCell>
                        <TableCell className="px-6 py-4 w-[40%] text-gray-700 dark:text-gray-300">
                          {row.Repository}
                        </TableCell>
                        <TableCell className="px-6 py-4 w-[30%]">
                          <button
                            onClick={() => {
                              runCommand(
                                "scanLocalImg",
                                { LOCAL_IMAGE: `${row.Repository}` },
                                row.Repository,
                                1
                              ); setLogs([]); setOutputScan(null);
                            }}
                            disabled={loading === row.Repository}
                            className={`bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 ${loading === row.Repository
                              ? "bg-gray-400 cursor-not-allowed"
                              : ""
                              }`}
                          >
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5 text-white"
                              >
                                <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z" />
                              </svg>
                              <span className="text-white">Scan</span>
                            </div>
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableRoot>
            </div>
          ) : error ? (
            <pre className="p-4 bg-red-100 text-red-600 border border-red-300 rounded-lg">
              {error}
            </pre>
          ) : null}


          {Object.keys(scanResults).length > 0 &&
            scanningItem &&
            scanResults[scanningItem!] && outputScan ? (
            <>
              <h1 className="flex text-lg mt-8 font-semibold text-gray-00">
                Scanned Results for{" "}
                <p className="ms-1 font-bold">{scanningItem}</p>
              </h1>
              <div className="mt-3 p-6 rounded-lg shadow-lg">
                <div className="rounded-md bg-grey-500">
                  <div className="bg-gray-100 dark:bg-[#0f172a] p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-gray-00 mb-4">
                      Information
                    </h4>
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
                        {outputScan.Metadata.RepoTags[0]}
                      </p>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] rounded-lg space-x-2">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Architecture:
                      </h3>
                      <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">
                        {outputScan.Metadata.ImageConfig.architecture}
                      </p>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-[#0f172a] rounded-lg space-x-2">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Operating System:{" "}
                      </h3>
                      <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">
                        {outputScan.Metadata.ImageConfig.os}
                      </p>
                    </div>
                  </div>
                </div>

                {latestResult &&
                  latestResult.Vulnerabilities &&
                  latestResult.Vulnerabilities.length > 0 ? (
                  <>
                    <div className="mt-6 bg-gray-100 dark:bg-[#0f172a] p-4 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold text-gray-00 mb-4">
                        Stats
                      </h4>
                      {/* <Tabs tabs={tabs} /> */}

                      <Tabs defaultValue="tab1">
                        <TabsList variant="solid" >
                          <TabsTrigger value="tab1" className="gap-1.5 flex ">
                            <AiFillDashboard className="-ml-1 size-4" aria-hidden="true" />
                            Card
                          </TabsTrigger>
                          <TabsTrigger value="tab2" className="gap-1.5 flex ">
                            <FaChartPie className="-ml-1 size-4" aria-hidden="true" />
                            Visualization
                          </TabsTrigger>
                        </TabsList>
                        <div className="mt-4">
                          <TabsContent value="tab1">
                            <div>
                              <VulnerabilitiesStats severityArray={currSeverity} />
                            </div>
                          </TabsContent>
                          <TabsContent value="tab2">
                            <div>
                              <CustomPieChart data={currSeverity} />
                            </div>
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>

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
                            {latestResult.Vulnerabilities?.map((row: any) => (
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
                    <VulnerabilitiesStats severityArray={currSeverity} />{" "}
                    <pre className="p-4 mt-6 bg-yellow-100 text-green-600 border border-red-300 rounded-lg">
                      There are no vulnearibilities in this image
                    </pre>
                  </>
                )}
              </div>
            </>
          ) : scannedImagesDetails && scanDetails && (
            <DynamicResultRendering
              scanningItem={scannedImagesDetails}
              outputScan={scanDetails}
              latestResult={scanDetails.Results}
            />
          )}

          <h2 className="ms-3 mt-3 text-black dark:text-white">Previosuly Scanned </h2>
          <ScannedImages data={prevScans.Vulnerabilitiesgetter()} onImageClick={showImageDetails} />

          {/* {fileSystemResult && (<>
                  <div className="mt-3 p-6 bg-grey-300  rounded-lg shadow-lg bg-gray-100">
                       <div className="rounded-md bg-grey-500">         
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                              <h4 className="text-lg font-semibold text-gray-00 mb-4">
                                Information
                              </h4> 
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{fileSystemResult.fileName}</p>
                              </div>
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-1">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{fileSystemResult.ArtifactType}</p>
                              </div>   
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Target:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{fileSystemResult.Results[0].Target}</p>
                              </div> 
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cause:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{fileSystemResult.Results[0].Secrets[0].RuleID}</p>
                              </div> 
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Operating System: </h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{fileSystemResult.Results[0].Secrets[0]}</p>
                              </div>
                            </div>
                      </div>
                        
                      {latestResult && latestResult.Vulnerabilities && latestResult.Vulnerabilities.length > 0  ? (<><div className="border mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                      <h4 className="text-lg font-semibold text-gray-00 mb-4">
                        Stats
                      </h4>
                      <Tabs tabs={tabs}/>
                      </div>
          
                      <div className={`border mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md ${isFullScreen ? 'fixed top-0 left-0 w-full h-full z-50 bg-white dark:bg-gray-900 p-8' : ''}`}>
                      <div className="relative">
                      <a 
                        onClick={toggleFullScreen} 
                        className="absolute cursor-pointer top-0 right-0 text-black rounded-md hover:bg-grey-600"
                      >
                        {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                      </a>

                      <div className="flex items-center">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                          Report
                        </h4>
                      </div>
                    </div>
                      <TableRoot className={`overflow-y-auto   overflow-x-auto ${isFullScreen ? 'max-h-[90vh]' : 'max-h-80'}`}> 
                        <Table>
                          <TableCaption className="text-xl mt-6">{scanningItem}</TableCaption>
                          <TableHead>
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
                            {latestResult.Vulnerabilities?.map((row : any) => (
                              <TableRow key={row.VulnerabilityID}>
                                <TableCell>{row.VulnerabilityID}</TableCell>
                                <TableCell>{row.SeveritySource}</TableCell>
                                <TableCell>{row.Severity}</TableCell>
                                <TableCell>
                                  <ul className="list-disc pl-4">
                                    <li><strong>ID:</strong> {row.DataSource.ID}</li>
                                    <li><strong>Name:</strong> {row.DataSource.Name}</li>
                                    <li>
                                      <strong>URL:</strong> 
                                      <a href={row.DataSource.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        {row.DataSource.URL}
                                      </a>
                                    </li>
                                  </ul>
                                </TableCell>
                                <TableCell className="whitespace-normal break-words max-w-xs">{row.Title}</TableCell>
                                <TableCell className="whitespace-normal break-words max-w-s">{row.Description}</TableCell>
                                <TableCell>
                                  <ul className="list-disc pl-4">
                                    {row.References?.map((element : string, index : number) => (
                                      <li key={index}>
                                        <a href={element} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                          {element}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableRoot>
                    </div>
                  </>) : (<><VulnerabilitiesStats severityArray={currSeverity} /> <pre className="p-4 mt-6 bg-yellow-100 text-green-600 border border-red-300 rounded-lg">There are no vulnearibilities in this image</pre>
                          </>)}


                  </div>
                  </>)}  */}
        </div>
      </div>
    </>
  );
}
