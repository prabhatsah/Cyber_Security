"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";
import Tabs from "@/components/Tabs";
import { useState,useRef,useEffect } from "react";
import dockerCommands from "../docker-commands.json";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import VulnerabilitiesStats from './stats';
import CustomPieChart from './vulnerabilitiesPie';
import { Maximize, Minimize } from "lucide-react";

type CommandKey = keyof typeof dockerCommands;



export default function ContainerDashboard({ onBack }: { onBack: () => void }) {
  const [tableType,setTableType] = useState("");
  const [imageScan,setImageScan] = useState(0);
  const [imageScanLocal,setImageScanLocal] = useState(0);
  const [imageName, setImageName] = useState("");
  const [imageVersion, setImageVersion] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [outputScan, setOutputScan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<CommandKey | null>(null);
  const [scanResults, setScanResults] = useState<Record<string, any>>({});
  const [scanningItem, setScanningItem] = useState<string | null>(null);
  const [latestResult,setLatestResult] =useState<any>(null);
  const [currSeverity, setCurrSeverity] = useState<{ severity: string; count: number }[]>([]);
  const [fileScan,setFileScan] =  useState(0);
  const [imageFiles,setImageFiles] = useState<string | null>(null);
  const [fileSystemResult, setfileSystemResult] = useState<Record<string, any>>({});
  const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
    };

  
  function cleanAndFormatJson(jsonString : string):string {
    jsonString = jsonString.replace(/\"\/bin\/sh\"/g, "");
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  }
  
  useEffect(() => {
    console.log(fileSystemResult);
  }, [fileSystemResult]);

  const runCommand = async (commandKey: CommandKey, params: Record<string, string> = {},itemId: string | null = null, flag : number = 0) => {
    let data:any ;
    try {
      setLoading(commandKey);
      setError(null);
      setScanningItem(itemId);
      const response = await fetch("/api/run-docker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commandKey, params }),
      });
      if (response.ok) {
        data = await response.json();
        
        const severity = new Map<string, number>([
          ["LOW", 0],
          ["MEDIUM", 0],
          ["HIGH", 0],
          ["CRITICAL", 0]
          ]);

        if(flag == 1){
          const formattedString = cleanAndFormatJson(data.output);
          let finalResult : any ;
          finalResult = JSON.parse(formattedString);
          console.log(finalResult)
          setOutputScan(finalResult)
          setScanResults((prevResults) => ({ ...prevResults, [itemId!]: finalResult?.Results ?? finalResult}));
          console.log(scanResults)
          let vul : any;
          if(finalResult && finalResult.Results && finalResult.Results.length>0){
            console.log("Entering vul");
              setLatestResult(finalResult.Results[0]);
              if(finalResult.Results[0].Vulnerabilities && finalResult.Results[0].Vulnerabilities.length>0){
                vul = finalResult.Results[0].Vulnerabilities;
                for(let i =0 ; i< vul.length ;i++){
                      if(!severity.has(vul[i].Severity))
                        severity.set(vul[i].Severity,1);
                    else{
                      let  count : number = severity.get(vul[i].Severity) || 0;
                      severity.set(vul[i].Severity,count+1);
                    }
                }
                      console.log(severity);
            }
            const severityArray = Array.from(severity, ([severity, count]) => ({
              severity,
              count,
            }));
            setCurrSeverity(severityArray);
            console.log(currSeverity)

          }
  
          }
        else if(flag == 2){
        const formattedString = cleanAndFormatJson(data.output);
          let finalResult : any ;
          finalResult = JSON.parse(formattedString);
          finalResult['fileName'] = itemId;
          setfileSystemResult(finalResult);
      }
      else{
        const parsedData = data.output.trim().split('\n') .map((line : any) => JSON.parse(line)) ;
        console.log(parsedData)
        setImageScan(0)
        setOutput(parsedData)
        setScanResults((prevResults) => ({ ...prevResults, [itemId!]: parsedData}));
      }
      }
    } catch (err) {
      setError("Failed to execute command");
    } finally {
      setLoading(null);
    };
     
}

const tabs = [
  {
    label: "Card-based",
    content: <VulnerabilitiesStats severityArray={currSeverity} />,
  },
  {
    label: "Chart-based",
    content: <CustomPieChart data={currSeverity} />,
  },
];

  return (
    <>
      <div className="flex justify-start w-full">
          <span onClick={onBack} className="px-2 text-lg text-bold text-gery-500 cursor-pointer">←</span>
      </div>
      <div className="p-4 w-full">
          {/* start from here*/}
          <h3 className="text-2xl mt-1 mb-9 text-black flex items-center justify-center text-center w-full">
            Docker Security Scanning & Image Analysis
              </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-full px-3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="2" 
                            stroke="currentColor" 
                            className="w-6 h-6 text-blue-500"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                          </svg>

                          </div>
                          <div>
                              <h3 className="text-xl mx-2 font-medium text-primary">
                                List All Images(Local)
                              </h3>
                          </div>
                      </div>
                  </div>
                  <div className="mt-4">
                      <div className="mt-4 mx-3 text-gray-500 text-sm leading-relaxed">
                        <p>The docker images command lists all locally available images, while docker pull downloads an image from a registry. Images can be inspected with docker image inspect, tagged for versioning, and removed using docker rmi.</p>
                        <p>For security, docker scan checks for vulnerabilities. Additionally, images can be saved and loaded with docker save and docker load, making it easier to transfer and manage them across different environments.</p>
                      </div>
                    </div>
                  <div className="mt-6 space-x-3">
                  <div className="flex justify-center items-center h-full">
                      <button
                        onClick={() => {runCommand("showALLImgs");
                          setImageScanLocal(0); console.log(output); setImageScan(0); setTableType("Images"); }}
                        disabled={loading === "showALLImgs"}
                        className={`flex items-center justify-center px-5 py-2 text-white font-semibold rounded-lg transition-all ${
                          loading === "showALLImgs"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {loading === "showALLImgs" ? "Loading..." : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-play h-4 w-4 mr-2"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                            Run
                          </>
                        )}
                      </button>
                    </div>
                  </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6 text-blue-500"
                          >
                            <rect x="4" y="6" width="16" height="12" rx="2" ry="2" stroke="currentColor" />
                            <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" />
                            <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" />
                          </svg>
                          </div>
                          <div>
                              <h3 className="text-xl mx-2 font-medium text-primary">
                                List All Containers
                              </h3>
                          </div>
                      </div>
                  </div>
                  <div className="mt-4">
                    <div className="mt-4 mx-3 text-gray-500 text-sm leading-relaxed">
                      <p>The <code>docker ps -a</code> command displays a complete list of all containers on the system, including both running and stopped instances. It provides key details such as container ID, image, status, ports, and assigned names.</p>
                      <p>This command is useful for tracking container history, troubleshooting, and managing inactive containers. By analyzing its output, users can quickly identify which containers are operational, which have exited, and when they last ran.</p>
                    </div>
                  </div>
                  <div className="mt-6 space-x-3">
                  <div className="flex justify-center items-center h-full">
                      <button
                        onClick={() => {runCommand("listDockerContainers");setImageScanLocal(0); console.log(output); setImageScan(0); setTableType("Containers");}}
                        disabled={loading === "listDockerContainers"}
                        className={`flex items-center justify-center px-5 py-2 text-white font-semibold rounded-lg transition-all ${
                          loading === "listDockerContainers"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {loading === "listDockerContainers" ? "Loading..." : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-play h-4 w-4 mr-2"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                            Run
                          </>
                        )}
                      </button>
                    </div>
                  </div>
              </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-500"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 0 1 2-2h2M3 17v2a2 2 0 0 0 2 2h2M17 3h2a2 2 0 0 1 2 2v2M17 21h2a2 2 0 0 0 2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="2" />
                    <path d="M10 12h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl mx-2 font-medium text-primary">Scan a Remote Image</h3>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mt-4 mx-3 text-gray-500 text-sm leading-relaxed">
                <p>
                  The <code>docker scan</code> command analyzes container images for security vulnerabilities, helping to identify potential risks before deployment. It supports scanning both local and remote images without requiring manual downloads.
                </p>
                <p>
                  To scan a remote image directly from a registry, specify the image name and tag, such as <code>docker scan repository/image:tag</code>. The output provides a detailed security report, allowing developers to address vulnerabilities proactively.
                </p>
              </div>
            </div>
            <div className="mt-6 space-x-3">
              <div className="flex justify-center items-center h-full">
                <button
                  className="flex items-center justify-center px-5 py-2 text-white font-semibold rounded-lg transition-all bg-blue-600 hover:bg-blue-700"
                  onClick={() => {setImageScan(1); setTableType("scanRemote");}}>
                      {loading === "scanRemoteImg" ? "Loading..." : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-play h-4 w-4 mr-2"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                            Run
                          </>
                        )}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6 text-blue-500"
                          >
                            <rect x="4" y="6" width="16" height="12" rx="2" ry="2" stroke="currentColor" />
                            <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" />
                            <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" />
                          </svg>
                          </div>
                          <div>
                              <h3 className="text-xl mx-2 font-medium text-primary">
                                Scan File System
                              </h3>
                          </div>
                      </div>
                  </div>
                  <div className="mt-4">
                    <div className="mt-4 mx-3 text-gray-500 text-sm leading-relaxed">
                      <p>You can scan your system for security issues using a container-based tool. To check the entire system, run a command that mounts the whole file system and scans it.</p>
                      <p>If you only want to scan a specific folder, you can adjust the command to target just that folder. For checking a Docker volume, you can specify the volume name instead. If the tool is already installed on your computer, you can run it directly without using Docker.</p>
                    </div>
                  </div>
                  <div className="mt-6 space-x-3">
                  <div className="flex justify-center items-center h-full">
                  <button
                  className="flex items-center justify-center px-5 py-2 text-white font-semibold rounded-lg transition-all bg-blue-600 hover:bg-blue-700"
                  onClick={() => {setFileScan(1);setImageScan(0); setTableType("FileScanning");}}>
                      {loading === "scanFileSystem" ? "Loading..." : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-play h-4 w-4 mr-2"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                            Run
                          </>
                        )}
                </button>
                    </div>
                  </div>
              </div>
        </div>
        
        

        <div className="mt-6">
          {fileScan !== 0 && (
              <div className="mt-4 px-3">

                  <div className="mb-4 flex items-center space-x-2">
                    <div className="w-full">
                      <input
                        id="imagePath"
                        type="text" 
                        placeholder="Enter file path"
                        onChange={(e) => setImageFiles(e.target.value)}
                        className="block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                      runCommand("scanFileSystem", {FILE_PATH: imageFiles}, fileName, 2);
                    } else {
                      setError("Please select a directory");
                    }
                  }}
                  disabled={loading === "scanFileSystem"}
                  className={`flex items-center px-4 py-2 text-white font-semibold rounded-lg transition-all ${
                    loading === "scanFileSystem"
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading === "scanFileSystem" ? "Scanning..." : (
                    <>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-5 h-5 text-white mr-2"
                      >
                        <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z"/>
                      </svg>
                      Scan
                    </>
                  )}
                </button>
              </div>
              </div>
          
          )}

          {imageScan!==0 && (
                  <div className="mt-4 px-3">
                  <div className="mb-4 flex space-x-2">
                    <div className="w-1/2">
                      <input
                        id="imageName"
                        type="text"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                        placeholder="Enter image name"
                        className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      />
                    </div>
                    <div className="w-1/2">
                      <input
                        id="imageVersion"
                        type="text"
                        value={imageVersion}
                        onChange={(e) => setImageVersion(e.target.value)}
                        placeholder="Enter image version"
                        className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                      />
                    </div>
                    <div className="flex justify-center">
                    <button
                        onClick={() => {
                          if (imageName) {
        
                          if(!imageVersion || imageVersion =="")
                            setImageVersion("latest");
                          
                          console.log(`${imageName}:${imageVersion}`)
                          runCommand("scanRemoteImg", { REMOTE_IMAGE: `${imageName}:${imageVersion}`
                           },`${imageName}:${imageVersion}`,1);
                        } else {
                          setError("Please provide image name");
                          }
                        }}
                        disabled={loading === "scanRemoteImg"}
                        className={`flex items-center px-2 py-2 text-white font-semibold rounded-lg transition-all ${
                          loading === "scanRemoteImg" 
                            ? "bg-grey-800 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {loading === "scanRemoteImg" ? "Scanning..." : (
                          <>
                            <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24" 
                                  fill="currentColor" 
                                  className="w-5 h-5 text-white"
                                >
                                  <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z"/>
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
                  <p>Loading...</p>
                ) : tableType === "Containers" && output ? (
                  <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', maxHeight: '500px' }} className="overflow-y-auto">
                  <TableRoot className="my-table-container">
                    <Table className="my-table">
                      <TableCaption className="text-xl mt-6">Containers</TableCaption>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell>ID</TableHeaderCell>
                          <TableHeaderCell>Container</TableHeaderCell>
                          <TableHeaderCell>Image</TableHeaderCell>
                          <TableHeaderCell>Action</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {output?.map((row: any) => (
                        <TableRow key={row.ID}>
                          <TableCell>{row.ID}</TableCell>
                          <TableCell>{row.Names}</TableCell>
                          <TableCell>{row.Image}</TableCell>
                          <TableCell>
                          <button
                              onClick={() => {runCommand("scanLocalImg", { LOCAL_IMAGE: `${row.Image}` }, row.Names, 1)}}
                            disabled={loading === row.Image}
                            className={`bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 ${
                              loading === row.Image ? "bg-gray-400 cursor-not-allowed" : ""
                            }`}
                            >
                              <div className="flex items-center gap-1">
                              <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24" 
                                  fill="currentColor" 
                                  className="w-5 h-5 text-white"
                                >
                                  <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z"/>
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
                ) :tableType == "Images" && output ? (
                  <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px',maxHeight: '500px'}} className="overflow-y-auto">
                  <TableRoot className="my-table-container">
                  <Table className="my-table">
                    <TableCaption className="text-xl mt-6">Images</TableCaption>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Image ID</TableHeaderCell>
                        <TableHeaderCell>Repository(Name)</TableHeaderCell>
                        <TableHeaderCell>Action</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{ maxHeight: '500px'}} className="overflow-y-auto">
                      {output!.map((row : any) => (
                        <TableRow key={row.ID}>
                          <TableCell>{row.ID}</TableCell>
                          <TableCell>{row.Repository}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => {runCommand("scanLocalImg", { LOCAL_IMAGE: `${row.Repository}` }, row.Repository, 1)}}
                              disabled={loading === row.Repository}
                            className={`bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 ${
                              loading === row.Repository ? "bg-gray-400 cursor-not-allowed" : ""
                            }`}
                            >
                              <div className="flex items-center gap-1">
                              <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24" 
                                  fill="currentColor" 
                                  className="w-5 h-5 text-white"
                                >
                                  <path d="M12 2L4 5v6c0 5 3.84 9.27 8 10 4.16-.73 8-5 8-10V5l-8-3zM6 11V6.3l6-2.25L18 6.3V11c0 3.63-2.62 7-6 7s-6-3.37-6-7zm10.7 6.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4-1.4l-2-2zM12 8a3 3 0 100 6 3 3 0 000-6zm0 2a1 1 0 110 2 1 1 0 010-2z"/>
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
                )
                : error ? (
                  <pre className="p-4 bg-red-100 text-red-600 border border-red-300 rounded-lg">{error}</pre>
                ):null }

                {Object.keys(scanResults).length > 0 && scanningItem && scanResults[scanningItem!] && (
                  <>
                  <h1 className="flex text-lg mt-8 font-semibold text-gray-00">
                            Scanned Results for  <p className="ms-1 font-bold">{scanningItem}</p> :-
                    </h1> 
                  <div className="mt-3 p-6 bg-grey-300  rounded-lg shadow-lg bg-gray-100">
                       <div className="rounded-md bg-grey-500">         
                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                              <h4 className="text-lg font-semibold text-gray-00 mb-4">
                                Information
                              </h4> 
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{outputScan.Results[0].Target}</p>
                              </div>
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-1">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Type:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{outputScan.ArtifactType}</p>
                              </div>   
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Repository:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{outputScan.Metadata.RepoTags[0]}</p>
                              </div> 
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Architecture:</h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{outputScan.Metadata.ImageConfig.architecture}</p>
                              </div> 
                              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg space-x-2">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Operating System: </h3>
                                    <p className="text-md font-mono font-bold text-gray-900 dark:text-white break-all">{outputScan.Metadata.ImageConfig.os}</p>
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
                  </>
                ) }

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
