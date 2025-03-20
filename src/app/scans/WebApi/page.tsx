
"use client";

import Tabs from "@/components/Tabs";

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
import { LiaSpiderSolid } from "react-icons/lia"; // Ensure this is the correct library
import { FaFire } from "react-icons/fa";
import SpiderScan from "./SpiderScan";
import ActiveScan from "./ActiveScan";

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
    <div className="">
      <p className="font-bold ">Web & API Security</p>
      <SearchBar
        query={query}
        setQuery={setQuery}
        fetchData={fetchData}
        isLoading={isLoading}
      />

      {error && <p className="text-red-600 text-center">{error}</p>}

      <Tabs
        tabs={[
          {
            icon: <LiaSpiderSolid />,
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
      />

      {data && <Dashboard _data={data} />}
      <PastScans />
    </div>
  );
}
