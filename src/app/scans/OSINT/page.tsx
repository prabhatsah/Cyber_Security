"use client";

import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Widgets from "./Widgets";
import { ApiResponse, HarvesterData } from "./components/type";
import PastScans from "@/components/PastScans";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { addColumn, updateColumn } from "@/utils/api";
import { saveData } from "@/ikon/utils/api/processRuntimeService";

const getDomainSafetyMessage = (report) => {
  const last_analysis_stats = report.attributes.last_analysis_stats;

  // Thresholds for safety
  const harmlessCount = last_analysis_stats.harmless || 0;
  const maliciousCount = last_analysis_stats.malicious || 0;
  const suspiciousCount = last_analysis_stats.suspicious || 0;

  // Safety conditions
  if (suspiciousCount > 0) {
    // return "⚠️ This domain has suspicious activity. Be careful.";
    return {
      risk: "Critical",
      message: "This domain has suspicious activity. Be careful."
    }
  }
  if (maliciousCount > 0) {
    // return "✅ This is a trusted and safe domain.";
    return {
      risk: "Warning",
      message: "This domain has some malicious activity. Proceed with caution."
    }
  }
  if (harmlessCount > 0) {
    return {
      risk: "No Issue",
      message: "This is a trusted and safe domain."
    }
  }
  return {
    risk: "Unclear",
    message: "Further investigation recommended."
  }
};

// async function addRow() {
//   const values: Record<string, any>[] = [
//     { column: "userId", value: ["K2303109"] },
//     {
//       column: "name",
//       value: ["Rizwan Ansari"],
//     },
//     { column: "scanData", value: [{}] }
//   ];

//   const resp = await addColumn("OSINT_scanData", values);
//   // return await resp.json();
//   return resp;
// }

async function insertScanData(scanData) {

  const uniqueKey = URL.createObjectURL(new Blob()).split('/').pop();
  console.log("uniqueKey----------", uniqueKey);
  let resp;
  if (uniqueKey) {
    resp = await updateColumn("osint_scandata", "scandata", scanData, uniqueKey, "Rizwan Ansari");
  }
  // return await resp.json();
  return resp;
}

async function fetchPastScan() {

  const uniqueKey = URL.createObjectURL(new Blob()).split('/').pop();
  console.log("uniqueKey----------", uniqueKey);
  let resp;
  if (uniqueKey) {
    resp = await updateColumn("osint_scandata", "scandata", scanData, uniqueKey, "Rizwan Ansari");
  }
  // return await resp.json();
  return resp;
}

export default function TheHarvesterDashboard() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<HarvesterData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (searchType: string): Promise<void> => {
    try {
      // const response = await fetch(
      //   `/api/OSINT/theharvester?query=${query}&type=${searchType}`
      // );

      const response = await fetch(
        //`/api/OSINT/theharvester?query=${query}&type=${searchType}`
        // `/api/OSINT/virusTotal?domain=http://malware.wicar.org`
        // `/api/OSINT/virusTotal?domain=amazon.com`
        //`/api/OSINT/virusTotal?domain=${query}`
        `http://localhost:3000/api/OSINT/virusTotal?query=${query}`
      );

      const result: ApiResponse = await response.json();

      if (result.error) throw new Error(result.error);
      // const addRowResp = await addRow();
      // if (addRowResp.error) throw new Error(addRowResp.error);
      const insertScanDataResp = await insertScanData(result.data);
      if (insertScanDataResp.error) throw new Error(insertScanDataResp.error);
      setData(result.data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "OSINT & Threat Intelligence",
          href: "/scans/OSINT",
        }}
      />
      <div className="">
        <p className="font-bold ">OSINT & Threat Intelligence</p>
        <SearchBar query={query} setQuery={setQuery} fetchData={fetchData} />
        {error && <p className="text-red-600 text-center">{error}</p>}

        {data && (
          <div className="space-y-8">
            <Widgets widgetData={data} queryUrl={query} />
          </div>
        )}

        <div>
          <PastScans />
        </div>
      </div>
    </>
  );
}
