"use client";
import { useRef, useState } from "react";
import { apiRequest } from "../utils/api";
import { Scan } from "../types/scanTypes";
import { saveScannedData } from "@/utils/api";

function formatTimestamp(timestamp: string) {
  const date = new Date(Number(timestamp));

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const usePolling = (
  apiUrl: string,
  query: string,
  setOpenTabs,
  onComplete: (report: any) => void
) => {
  console.log("query ---------- ", query);
  const [isScanning, setIsScanning] = useState(false);
  const [spiderProgress, setSpiderProgress] = useState(0);
  const [foundURI, setFoundURI] = useState<string[]>([]);
  const [messages, setMessages] = useState([]);
  const [scanDetails, setScanDetails] = useState({
    activeProgress: 0,
    newAlerts: "0",
    numRequests: "0",
  });

  const resetScan = () => {
    setSpiderProgress(() => 0);
    setFoundURI(() => []);
    setScanDetails(() => {
      return {
        activeProgress: 0,
        newAlerts: "0",
        numRequests: "0",
      };
    });
    setMessages(() => []);
    onComplete(() => null);
  };

  const startScan = async () => {
    setOpenTabs(true);
    resetScan();
    setIsScanning(true);
    try {
      const result = await apiRequest(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: query, type: "spider" }),
      });

      if (result.scanId) {
        pollSpiderProgress(result.scanId);
      } else {
        console.error("Failed to start spider scan.");
        setIsScanning(false);
      }
    } catch (err) {
      console.error("Error starting scan:", err);
      setIsScanning(false);
    }
  };

  const pollSpiderProgress = async (spiderScanId: string) => {
    const poll = async () => {
      try {
        const progressData = await apiRequest(
          `${apiUrl}/progress?scanId=${spiderScanId}&type=spider`
        );

        setSpiderProgress(Number(progressData.progress) || 0);

        const urls = await apiRequest(
          `${apiUrl}/spiderResults?scanId=${spiderScanId}`
        );
        setFoundURI(urls.urls || []);

        if (progressData.progress == "100") {
          await startActiveScan();
        } else {
          // Call again after a delay
          setTimeout(poll, 2000); // 2 seconds delay before next poll
        }
      } catch (err) {
        console.error("Error polling spider progress:", err);
      }
    };

    await poll();
  };

  const startActiveScan = async () => {
    try {
      const result = await apiRequest(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: query, type: "ascan" }),
      });

      if (result.scanId) {
        pollActiveScanProgress(result.scanId);
      } else {
        console.error("Failed to start active scan.");
        setIsScanning(false);
      }
    } catch (err) {
      console.error("Error starting active scan:", err);
      setIsScanning(false);
    }
  };

  const pollActiveScanProgress = async (activeScanId: string) => {
    const poll = async () => {
      try {
        const scanDetails = await apiRequest(`${apiUrl}/scanDetails`);
        const scan = scanDetails.scans.find((s: Scan) => s.id === activeScanId);

        if (scan) {
          setScanDetails(() => {
            return {
              activeProgress:
                scan.state === "FINISHED" ? 100 : Number(scan.progress) || 0,
              newAlerts: scan.newAlertCount,
              numRequests: scan.reqCount,
            };
          });

          const messagesData = await apiRequest(
            `${apiUrl}/messages?baseurl=${encodeURIComponent(query)}&start=${
              messages.length
            }`
          );

          setMessages((prev) => [...prev, ...messagesData.messages]);
        }

        if (scan?.state === "FINISHED") {
          const report = await apiRequest(`${apiUrl}/report`);

          // const scanData = report.report.site[0];

          // const uniqueKey = new Date().getTime().toString();
          // console.log("uniqueKey----------", uniqueKey);
          // scanData.scanned_at = formatTimestamp(uniqueKey);

          // const resp = await saveScannedData("web_api_scan_history", {
          //   key: uniqueKey,
          //   value: scanData,
          // });

          // if (resp.error) {
          //   throw new Error(resp.error);
          // }

          const data = report.report.site.filter(
            (item) => item["@name"] === query
          );

          onComplete(() => data[0]);
          setIsScanning(() => false);
        } else {
          setTimeout(poll, 5000);
        }
      } catch (err) {
        console.error("Error polling active scan progress:", err);
      }
    };

    await poll();
  };

  return {
    isScanning,
    spiderProgress,
    foundURI,
    scanDetails,
    messages,
    startScan,
  };
};
