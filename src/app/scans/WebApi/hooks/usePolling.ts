"use client";
import { useState } from "react";
import { apiRequest } from "../utils/api";
import { Scan } from "../types/scanTypes";

export const usePolling = (
  apiUrl: string,
  query: string,
  onComplete: (report: any) => void
) => {
  const [isScanning, setIsScanning] = useState(false);
  const [spiderProgress, setSpiderProgress] = useState(0);
  const [activeProgress, setActiveProgress] = useState(0);
  const [foundURI, setFoundURI] = useState<string[]>([]);
  const [newAlerts, setNewAlerts] = useState("");
  const [numRequests, setNumRequests] = useState("");

  const startScan = async () => {
    setIsScanning(true);
    try {
      const result = await apiRequest(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: query, type: "spider" }),
      });

      await pollSpiderProgress(result.scanId);
    } catch (err) {
      console.error("Error starting scan:", err);
      setIsScanning(false);
    }
  };

  const pollSpiderProgress = async (spiderScanId: string) => {
    try {
      let isComplete = false;
      while (!isComplete) {
        const progressData = await apiRequest(
          `${apiUrl}/progress?scanId=${spiderScanId}&type=spider`
        );

        setSpiderProgress(Number(progressData.progress) || 0);

        const urls = await apiRequest(
          `${apiUrl}/spiderResults?scanId=${spiderScanId}`
        );
        setFoundURI(urls.urls || []);

        if (progressData.progress >= 100) {
          isComplete = true;
          const result = await apiRequest(`${apiUrl}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: query, type: "ascan" }),
          });

          await pollActiveScanProgress(result.scanId);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } catch (err) {
      console.error("Error polling spider progress:", err);
    }
  };

  const pollActiveScanProgress = async (activeScanId: string) => {
    try {
      let isComplete = false;
      while (!isComplete) {
        const scanDetails = await apiRequest(`${apiUrl}/scanDetails`);
        const scan = scanDetails.scans.find((s: Scan) => s.id === activeScanId);

        if (scan) {
          setActiveProgress(
            scan.state === "FINISHED" ? 100 : Number(scan.progress) || 0
          );
          setNewAlerts(scan.newAlertCount);
          setNumRequests(scan.reqCount);
        }

        if (scan?.state === "FINISHED") {
          isComplete = true;
          const report = await apiRequest(`${apiUrl}/report`);
          onComplete(report.report);
          setIsScanning(false);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } catch (err) {
      console.error("Error polling active scan progress:", err);
    }
  };

  return {
    isScanning,
    spiderProgress,
    activeProgress,
    foundURI,
    newAlerts,
    numRequests,
    startScan,
  };
};
