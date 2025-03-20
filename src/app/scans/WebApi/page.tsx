// "use client";

// import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
// import { useEffect } from "react";
// import Dashboard from "./dashboard";

// export default function WebApi() {
//   const { setItems } = useBreadcrumb();
//   useEffect(() => {
//     setItems([
//       { label: "Scans", href: "/scans" },
//       { label: "Web &  API Security", href: "/scans/webApi" },
//     ]);
//   }, []);

//   return <Dashboard />;
// }

// export default function WebApi() {
//   const [query, setQuery] = useState<string>("");
//   const [data, setData] = useState<webApiData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const [spiderProgress, setSpiderProgress] = useState(0);
//   const [activeProgress, setActiveProgress] = useState(0);
//   const [scanning, setScanning] = useState(false);
//   const [scanIds, setScanIds] = useState({
//     spiderScanId: "",
//     activeScanId: "",
//   });
//   const [foundURI, setFoundURI] = useState([]);

//   const { setItems } = useBreadcrumb();
//   useEffect(() => {
//     setItems([
//       { label: "Scans", href: "/scans" },
//       { label: "Web &  API Security", href: "/scans/webApi" },
//     ]);
//   }, []);

//   // Fetch data on component mount
//   const fetchData = async (searchType: string): Promise<void> => {
//     try {
//       const urlToScan = query; // Assuming query holds the URL to scan
//       if (!urlToScan) {
//         throw new Error("Please provide a valid URL.");
//       }

//       // Send the scan request
//       const response = await fetch("http://localhost:3000/api/webApi/ZAP", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ url: urlToScan }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch: ${response.statusText}`);
//       }

//       console.log("------------------- response");
//       console.log(response);

//       const result = await response.json();

//       console.log(result);

//       if (result.error) {
//         throw new Error(result.error);
//       }

//       // Extract and set the report data
//       setData(result.report); // Assuming you have a state `setData`
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message);
//       } else {
//         setError("An unknown error occurred");
//       }
//     }
//   };

//   // Handle loading, error, and display data
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="">
//       <p className="font-bold text-gray-600">Web & Api Security</p>
//       <SearchBar query={query} setQuery={setQuery} fetchData={fetchData} />
//       {error && <p className="text-red-600 text-center">{error}</p>}
//       <Tabs tabs={tabs} />
//       <div className="w-full mt-8">
//         <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
//           URLs
//         </h1>
//         <TableRoot className="mt-3">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableHeaderCell>Method</TableHeaderCell>
//                 <TableHeaderCell>URI</TableHeaderCell>
//                 <TableHeaderCell>Flags</TableHeaderCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {foundURI.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>
//                     <Badge variant="default">{item.method}</Badge>
//                   </TableCell>
//                   <TableCell>{item.uri}</TableCell>
//                   <TableCell>{item.flags}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableRoot>
//       </div>
//       {data && <Dashboard _data={data} />}
//       <div>
//         <PastScans />
//       </div>
//     </div>
//   );
// }

// export default function WebApi() {
//   const [query, setQuery] = useState<string>("");
//   const [data, setData] = useState<webApiData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   // const [loading, setLoading] = useState<boolean>(false);

//   const [spiderProgress, setSpiderProgress] = useState(0);
//   const [activeProgress, setActiveProgress] = useState(0);
//   // const [scanning, setScanning] = useState(false);
//   // const [scanIds, setScanIds] = useState({
//   //   spiderScanId: "",
//   //   activeScanId: "",
//   // });
//   const [foundURI, setFoundURI] = useState([]);

//   const tabs = [
//     {
//       label: "Spider",
//       content: <SpiderScan progress={spiderProgress} foundURI={foundURI} />,
//     },
//     {
//       label: "Active Scan",
//       content: <ActiveScan progress={activeProgress} />,
//     },
//   ];

//   const { setItems } = useBreadcrumb();

//   useEffect(() => {
//     setItems([
//       { label: "Scans", href: "/scans" },
//       { label: "Web & API Security", href: "/scans/webApi" },
//     ]);
//   }, []);

//   // Function to Start Scan
//   const fetchData = async (): Promise<void> => {
//     try {
//       if (!query) {
//         setError("Please provide a valid URL.");
//         return;
//       }

//       setError(null);
//       // setLoading(true);
//       // setScanning(true);

//       // Start Scan
//       const response = await fetch("/api/webApi/ZAP", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: query, type: "spider" }),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to start scan: ${response.statusText}`);
//       }

//       const result = await response.json();
//       if (result.error) throw new Error(result.error);

//       // Poll scan progress
//       await checkSpiderProgress(result.scanId);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "An unknown error occurred"
//       );
//       // setScanning(false);
//     } finally {
//       // setLoading(false);
//     }
//   };

//   // Function to Check Scan Progress
//   const checkSpiderProgress = async (spiderScanId: string) => {
//     const interval = setInterval(async () => {
//       try {
//         const response = await fetch(
//           `/api/webApi/ZAP/progress?scanId=${spiderScanId}&type=spider`
//         );
//         const progressData = await response.json();

//         setSpiderProgress(Number(progressData.progress));
//         await fetchFoundUrls(spiderScanId);

//         // Stop polling
//         if (progressData.progress === "100") {
//           clearInterval(interval);
//           // fetchFoundUrls(spiderScanId);
//           const response = await fetch("/api/webApi/ZAP", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ url: query, type: "ascan" }),
//           });

//           if (!response.ok) {
//             throw new Error(`Failed to start scan: ${response.statusText}`);
//           }

//           const result = await response.json();
//           if (result.error) throw new Error(result.error);

//           await checkActiveScanProgress(result.scanId);
//         }
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//         clearInterval(interval);
//         // setScanning(false);
//       }
//     }, 1000);
//   };

//   const checkActiveScanProgress = async (activeScanId: string) => {
//     const interval = setInterval(async () => {
//       try {
//         const response = await fetch(
//           `/api/webApi/ZAP/progress?scanId=${activeScanId}&type=ascan`
//         );
//         const progressData = await response.json();

//         setActiveProgress(Number(progressData.progress));

//         // Stop polling
//         if (progressData.progress === "100") {
//           clearInterval(interval);
//           // setScanning(false);
//           await fetchFinalReport();
//         }
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//         clearInterval(interval);
//         // setScanning(false);
//       }
//     }, 5000);
//   };

//   // Fetch URLs Discovered by Spider
//   const fetchFoundUrls = async (spiderScanId: string) => {
//     try {
//       const response = await fetch(
//         `/api/webApi/ZAP/spiderResults?scanId=${spiderScanId}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch Spider results.");

//       const data = await response.json();
//       console.log(data);
//       setFoundURI(data.urls || []);
//     } catch (err) {
//       console.error("Error fetching found URLs:", err);
//     }
//   };

//   // Fetch Final ZAP Report
//   const fetchFinalReport = async () => {
//     try {
//       const response = await fetch(`/api/webApi/ZAP/report`);
//       if (!response.ok) throw new Error("Failed to fetch final report.");

//       const reportData = await response.json();
//       setData(reportData.report);
//     } catch (err) {
//       console.error("Error fetching report:", err);
//     }
//   };

//   return (
//     <div className="p-4">
//       <p className="font-bold text-gray-600">Web & API Security</p>

//       {/* Search Bar */}
//       <SearchBar query={query} setQuery={setQuery} fetchData={fetchData} />
//       {error && <p className="text-red-600 text-center">{error}</p>}

//       <Tabs tabs={tabs} />

//       {/* Progress Indicators */}
//       {/* {scanning && (
//         <div className="mt-4">
//           <p>Spider Scan Progress: {spiderProgress}%</p>
//           <p>Active Scan Progress: {activeProgress}%</p>
//         </div>
//       )} */}

//       {/* Found URLs Table */}
//       {/* <div className="w-full mt-8">
//         <h1 className="text-md font-semibold text-gray-900 dark:text-gray-50">
//           Found URLs
//         </h1>
//         <TableRoot className="mt-3">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableHeaderCell>Method</TableHeaderCell>
//                 <TableHeaderCell>URI</TableHeaderCell>
//                 <TableHeaderCell>Flags</TableHeaderCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {foundURI.length > 0 ? (
//                 foundURI.map((item, index) => (
//                   <TableRow key={index}>
//                     <TableCell>
//                       <Badge variant="default">{item.method || "GET"}</Badge>
//                     </TableCell>
//                     <TableCell>{item.url}</TableCell>
//                     <TableCell>{item.flags || "None"}</TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-center">
//                     No URLs found yet.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableRoot>
//       </div> */}

//       {/* ZAP Report */}
//       {data && <Dashboard _data={data} />}

//       {/* Past Scans */}
//       <div>
//         <PastScans />
//       </div>
//     </div>
//   );
// }

// export default function WebApi() {
//   const [query, setQuery] = useState("");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const [spiderProgress, setSpiderProgress] = useState(0);
//   const [activeProgress, setActiveProgress] = useState(0);
//   const [foundURI, setFoundURI] = useState([]);

//   const [newAlerts, setNewAlerts] = useState("");
//   const [numRequests, setNumRequests] = useState("");

//   const [messages, setMessages] = useState([]);

//   const intervalRef = useRef(null);

//   const { setItems } = useBreadcrumb();

//   useEffect(() => {
//     setItems([
//       { label: "Scans", href: "/scans" },
//       { label: "Web & API Security", href: "/scans/webApi" },
//     ]);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, []);

//   const apiRequest = async (url, options = {}) => {
//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//       return await response.json();
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   };

//   const fetchMessages = async () => {
//     try {
//       const messagesData = await apiRequest(
//         `/api/webApi/ZAP/messages?baseurl=${encodeURIComponent(query)}&start=0`
//       );

//       console.log("ZAP Messages:", messagesData);
//       setMessages(messagesData.messages);
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//     }
//   };

//   const fetchData = useCallback(async () => {
//     if (!query) {
//       setError("Please provide a valid URL.");
//       return;
//     }

//     setError(null);
//     setIsLoading(true);
//     try {
//       const result = await apiRequest("/api/webApi/ZAP", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: query, type: "spider" }),
//       });
//       await checkSpiderProgress(result.scanId);
//     } catch (err) {
//       setError(err.message);
//     }
//   }, [query]);

//   const checkSpiderProgress = async (spiderScanId) => {
//     let delay = 1000;

//     const poll = async () => {
//       try {
//         const progressData = await apiRequest(
//           `/api/webApi/ZAP/progress?scanId=${spiderScanId}&type=spider`
//         );
//         setSpiderProgress(Number(progressData.progress) || 0);
//         await fetchFoundUrls(spiderScanId);

//         if (progressData.progress < 100) {
//           delay = Math.min(delay * 2, 5000);
//           setTimeout(poll, delay);
//         } else {
//           const result = await apiRequest("/api/webApi/ZAP", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ url: query, type: "ascan" }),
//           });
//           await checkActiveScanProgress(result.scanId);
//         }
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//       }
//     };
//     poll();
//   };

//   const checkActiveScanProgress = async (activeScanId) => {
//     // Fetch new messages
//     await fetchMessages();

//     let delay = 1000;

//     const poll = async () => {
//       try {
//         // const progressData = await apiRequest(
//         //   `/api/webApi/ZAP/progress?scanId=${activeScanId}&type=ascan`
//         // );
//         // setActiveProgress(Number(progressData.progress) || 0);

//         // Fetch scan details using the new API route
//         const scanDetails = await apiRequest("/api/webApi/ZAP/scanDetails");
//         const scanInfo = scanDetails.scans.find(
//           (scan) => scan.id === activeScanId
//         );

//         if (scanInfo) {
//           if (scanInfo.state === "FINISHED") {
//             setActiveProgress(100);
//           } else {
//             setActiveProgress(Number(scanInfo.progress) || 0);
//           }
//           setNewAlerts(scanInfo.newAlertCount);
//           setNumRequests(scanInfo.reqCount);
//         }

//         if (scanInfo.state !== "FINISHED") {
//           delay = Math.min(delay * 2, 5000);
//           setTimeout(poll, delay);
//         } else {
//           await fetchFinalReport();
//         }
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//       }
//     };
//     poll();
//   };

//   const fetchFoundUrls = async (spiderScanId) => {
//     try {
//       const data = await apiRequest(
//         `/api/webApi/ZAP/spiderResults?scanId=${spiderScanId}`
//       );
//       setFoundURI(data.urls || []);
//     } catch (err) {
//       console.error("Error fetching found URLs:", err);
//     }
//   };

//   const fetchFinalReport = async () => {
//     try {
//       const reportData = await apiRequest(`/api/webApi/ZAP/report`);
//       setData(reportData.report);
//       setIsLoading(false);
//     } catch (err) {
//       console.error("Error fetching report:", err);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <p className="font-bold text-gray-600">Web & API Security</p>
//       <SearchBar
//         query={query}
//         setQuery={setQuery}
//         fetchData={fetchData}
//         isLoading={isLoading}
//       />
//       {error && <p className="text-red-600 text-center">{error}</p>}
//       <Tabs
//         tabs={[
//           {
//             label: "Spider",
//             content: (
//               <SpiderScan progress={spiderProgress} foundURI={foundURI} />
//             ),
//           },
//           {
//             label: "Active Scan",
//             content: (
//               <ActiveScan
//                 progress={activeProgress}
//                 newAlerts={newAlerts}
//                 numRequests={numRequests}
//                 messages={messages}
//               />
//             ),
//           },
//         ]}
//       />
//       {data && <Dashboard _data={data} />}
//       <PastScans />
//     </div>
//   );
// }

// const checkActiveScanProgress = async (activeScanId) => {
//   let timeoutId;
//   fetchMessages();
//   const poll = async () => {
//     try {
//       const scanDetails = await apiRequest("/api/webApi/ZAP/scanDetails");
//       const scanInfo = scanDetails.scans.find(
//         (scan) => scan.id === activeScanId
//       );
//       if (scanInfo) {
//         setActiveProgress(
//           scanInfo.state === "FINISHED" ? 100 : Number(scanInfo.progress) || 0
//         );
//         setNewAlerts(scanInfo.newAlertCount);
//         setNumRequests(scanInfo.reqCount);
//       }
//       if (scanInfo?.state !== "FINISHED") {
//         timeoutId = setTimeout(poll, 2000);
//       } else {
//         await fetchFinalReport();
//       }
//     } catch (err) {
//       console.error("Error fetching progress:", err);
//     }
//   };
//   poll();
//   return () => clearTimeout(timeoutId);
// };

// export default function WebApi() {
//   const [query, setQuery] = useState("");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [spiderProgress, setSpiderProgress] = useState(0);
//   const [activeProgress, setActiveProgress] = useState(0);
//   const [foundURI, setFoundURI] = useState([]);
//   const [newAlerts, setNewAlerts] = useState("");
//   const [numRequests, setNumRequests] = useState("");
//   const [messages, setMessages] = useState([]);
//   const intervalRef = useRef(null);
//   const { setItems } = useBreadcrumb();

//   useEffect(() => {
//     setItems([
//       { label: "Scans", href: "/scans" },
//       { label: "Web & API Security", href: "/scans/webApi" },
//     ]);
//     return () => clearInterval(intervalRef.current);
//   }, []);

//   const apiRequest = async (url, options = {}) => {
//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//       return await response.json();
//     } catch (error) {
//       setError(error.message);
//       console.error(error);
//       throw error;
//     }
//   };

//   const fetchMessages = useCallback(async () => {
//     if (!query) return;
//     try {
//       const messagesData = await apiRequest(
//         `/api/webApi/ZAP/messages?baseurl=${encodeURIComponent(query)}`
//       );
//       setMessages(messagesData.messages);
//     } catch (err) {
//       console.error("Error fetching messages:", err);
//     }
//   }, [query]);

//   const fetchData = useCallback(async () => {
//     if (!query) {
//       setError("Please provide a valid URL.");
//       return;
//     }
//     setError(null);
//     setIsLoading(true);
//     try {
//       const result = await apiRequest("/api/webApi/ZAP", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url: query, type: "spider" }),
//       });
//       await checkSpiderProgress(result.scanId);
//     } catch (err) {
//       setError(err.message);
//     }
//   }, [query]);

//   const checkSpiderProgress = async (spiderScanId) => {
//     let timeoutId;
//     const poll = async () => {
//       try {
//         const progressData = await apiRequest(
//           `/api/webApi/ZAP/progress?scanId=${spiderScanId}&type=spider`
//         );
//         setSpiderProgress(Number(progressData.progress) || 0);
//         await fetchFoundUrls(spiderScanId);
//         if (progressData.progress < 100) {
//           timeoutId = setTimeout(poll, 2000);
//         } else {
//           const result = await apiRequest("/api/webApi/ZAP", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ url: query, type: "ascan" }),
//           });
//           await checkActiveScanProgress(result.scanId);
//         }
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//       }
//     };
//     poll();
//     return () => clearTimeout(timeoutId);
//   };

//   const checkActiveScanProgress = (activeScanId) => {
//     let timeoutId;

//     // Start fetching messages at a regular interval
//     const messageInterval = setInterval(fetchMessages, 3000);

//     const poll = async () => {
//       try {
//         const scanDetails = await apiRequest("/api/webApi/ZAP/scanDetails");
//         const scanInfo = scanDetails.scans.find(
//           (scan) => scan.id === activeScanId
//         );

//         if (scanInfo) {
//           setActiveProgress(
//             scanInfo.state === "FINISHED" ? 100 : Number(scanInfo.progress) || 0
//           );
//           setNewAlerts(scanInfo.newAlertCount);
//           setNumRequests(scanInfo.reqCount);
//         }

//         if (scanInfo?.state !== "FINISHED") {
//           timeoutId = setTimeout(poll, 2000);
//         } else {
//           clearInterval(messageInterval); // Stop fetching messages when scan completes
//           clearTimeout(timeoutId); // Ensure timeout is cleared
//           await fetchFinalReport();
//         }
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//       }
//     };

//     poll();

//     return () => {
//       clearTimeout(timeoutId);
//       clearInterval(messageInterval);
//     };
//   };

//   const fetchFoundUrls = async (spiderScanId) => {
//     try {
//       const data = await apiRequest(
//         `/api/webApi/ZAP/spiderResults?scanId=${spiderScanId}`
//       );
//       setFoundURI(data.urls || []);
//     } catch (err) {
//       console.error("Error fetching found URLs:", err);
//     }
//   };

//   const fetchFinalReport = async () => {
//     try {
//       const reportData = await apiRequest(`/api/webApi/ZAP/report`);
//       setData(reportData.report);
//     } catch (err) {
//       console.error("Error fetching report:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <p className="font-bold text-gray-600">Web & API Security</p>
//       <SearchBar
//         query={query}
//         setQuery={setQuery}
//         fetchData={fetchData}
//         isLoading={isLoading}
//       />
//       {error && <p className="text-red-600 text-center">{error}</p>}
//       <Tabs
//         tabs={[
//           {
//             label: "Spider",
//             content: (
//               <SpiderScan progress={spiderProgress} foundURI={foundURI} />
//             ),
//           },
//           {
//             label: "Active Scan",
//             content: (
//               <ActiveScan
//                 progress={activeProgress}
//                 newAlerts={newAlerts}
//                 numRequests={numRequests}
//                 messages={messages}
//               />
//             ),
//           },
//         ]}
//       />
//       {data && <Dashboard _data={data} />}
//       <PastScans />
//     </div>
//   );
// }

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"

import Dashboard from "./dashboard";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import SearchBar from "./SearchBar";
import PastScans from "@/components/PastScans";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table";
import SpiderScan from "./SpiderScan";
import ActiveScan from "./ActiveScan";
import { FaFire, FaSpider } from "react-icons/fa6";


interface webApiData {
  [key: string]: any;
}

interface ApiResponse {
  data: webApiData;
  error?: string;
}

const useInterval = (callback, delay, shouldRun) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!shouldRun || !delay) return; // Stop polling when shouldRun is false
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay, shouldRun]);
};

export default function WebApi() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [spiderProgress, setSpiderProgress] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0);
  const [foundURI, setFoundURI] = useState([]);
  const [newAlerts, setNewAlerts] = useState("");
  const [numRequests, setNumRequests] = useState("");
  const [messages, setMessages] = useState([]);
  const [isScanning, setIsScanning] = useState(false); // Track scan status
  const { setItems } = useBreadcrumb();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/webApi/ZAP";

  useEffect(() => {
    setItems([
      { label: "Scans", href: "/scans" },
      { label: "Web & API Security", href: "/scans/webApi" },
    ]);
  }, [setItems]);

  const apiRequest = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      setError(error.message);
      console.error(error);
      throw error;
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!query || !isScanning) return; // Stop fetching when not scanning
    try {
      const messagesData = await apiRequest(
        `${apiUrl}/messages?baseurl=${encodeURIComponent(query)}`
      );
      setMessages(messagesData.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [query, isScanning]);

  // Interval runs only when scanning is active
  useInterval(
    () => {
      fetchMessages();
    },
    3000,
    isScanning
  );

  const fetchData = useCallback(async () => {
    if (!query) {
      setError("Please provide a valid URL.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setIsScanning(true); // Start polling
    try {
      const result = await apiRequest(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: query, type: "spider" }),
      });
      await checkSpiderProgress(result.scanId);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [query]);

  const checkSpiderProgress = async (spiderScanId) => {
    try {
      const poll = async () => {
        const progressData = await apiRequest(
          `${apiUrl}/progress?scanId=${spiderScanId}&type=spider`
        );

        setSpiderProgress(Number(progressData.progress) || 0);
        await fetchFoundUrls(spiderScanId);

        if (progressData.progress < 100) {
          setTimeout(poll, 2000);
        } else {
          const result = await apiRequest(`${apiUrl}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: query, type: "ascan" }),
          });
          await checkActiveScanProgress(result.scanId);
        }
      };

      poll();
    } catch (err) {
      console.error("Error fetching spider progress:", err);
    }
  };

  const checkActiveScanProgress = async (activeScanId) => {
    try {
      const poll = async () => {
        const scanDetails = await apiRequest(`${apiUrl}/scanDetails`);
        const scanInfo = scanDetails.scans.find(
          (scan) => scan.id === activeScanId
        );

        if (scanInfo) {
          setActiveProgress(
            scanInfo.state === "FINISHED" ? 100 : Number(scanInfo.progress) || 0
          );
          setNewAlerts(scanInfo.newAlertCount);
          setNumRequests(scanInfo.reqCount);
        }

        if (scanInfo?.state !== "FINISHED") {
          setTimeout(poll, 2000);
        } else {
          setIsScanning(false); // Stop polling messages once scan finishes
          await fetchFinalReport();
        }
      };

      poll();
    } catch (err) {
      console.error("Error fetching active scan progress:", err);
    }
  };

  const fetchFoundUrls = async (spiderScanId) => {
    try {
      const data = await apiRequest(
        `${apiUrl}/spiderResults?scanId=${spiderScanId}`
      );
      setFoundURI(data.urls || []);
    } catch (err) {
      console.error("Error fetching found URLs:", err);
    }
  };

  const fetchFinalReport = async () => {
    try {
      const reportData = await apiRequest(`${apiUrl}/report`);
      setData(reportData.report);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <p className="font-bold text-gray-600">Web & API Security</p>
      <SearchBar
        query={query}
        setQuery={setQuery}
        fetchData={fetchData}
        isLoading={isLoading}
      />

      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* <Tabs
        tabs={[
          {
            icon: <FaSpider />,
            label: "Spider",
            content: (
              <SpiderScan progress={spiderProgress} foundURI={foundURI} />
            ),
          },
          {
            icon: <FaFire />,
            label: "Active Scan",
            content: (
              <ActiveScan
                progress={activeProgress}
                newAlerts={newAlerts}
                numRequests={numRequests}
                messages={messages}
              />
            ),
          },
        ]}
      /> */}
      <Tabs defaultValue="tab1">
        <TabsList variant="solid" >
          <TabsTrigger value="tab1" className="gap-1.5 flex ">
            <FaSpider className="-ml-1 size-4" aria-hidden="true" />
            Spider
          </TabsTrigger>
          <TabsTrigger value="tab2" className="gap-1.5 flex ">
            <FaFire className="-ml-1 size-4" aria-hidden="true" />
            Active Scan
          </TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="tab1">
            <div>
              <SpiderScan progress={spiderProgress} foundURI={foundURI} />
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div>
              <ActiveScan
                progress={activeProgress}
                newAlerts={newAlerts}
                numRequests={numRequests}
                messages={messages}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {data && <Dashboard _data={data} />}
      <PastScans />
    </div>
  );
}
