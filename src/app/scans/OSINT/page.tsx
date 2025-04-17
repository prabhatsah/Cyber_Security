"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Widgets from "./Widgets";
import { ApiResponse, HarvesterData } from "./components/type";
import PastScans from "@/components/PastScans";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { fetchScannedData, saveScannedData } from "@/utils/api";

function formatTimestamp(timestamp: string) {
  const date = new Date(Number(timestamp));

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

async function insertScanData(scanData) {

  const uniqueKey = new Date().getTime().toString();
  console.log("uniqueKey----------", uniqueKey);
  scanData.scanned_at = formatTimestamp(uniqueKey);

  const resp = saveScannedData("osint_threat_intelligence_scan", { key: uniqueKey, value: scanData });
  return resp;
}

const getDomainSafetyMessage = (report) => {
  const last_analysis_stats = report.attributes.last_analysis_stats;

  // Thresholds for safety
  const harmlessCount = last_analysis_stats.harmless || 0;
  const maliciousCount = last_analysis_stats.malicious || 0;
  const suspiciousCount = last_analysis_stats.suspicious || 0;
  const undetected = last_analysis_stats.undetected || 0;

  const returnObj = {
    totalIssue: 0,
    noOfIssue: 0,
    risk: "",
    message: ""
  };
  returnObj.totalIssue = harmlessCount + maliciousCount + suspiciousCount + undetected;

  // Safety conditions
  if (suspiciousCount > 0) {

    returnObj.risk = "critical";
    returnObj.message = `This ${report.type} has suspicious activity. Be careful.`;
    returnObj.noOfIssue = suspiciousCount;
  }
  else if (maliciousCount > 0) {
    returnObj.risk = "warning";
    returnObj.message = `This ${report.type} has some malicious activity. Proceed with caution.`;
    returnObj.noOfIssue = maliciousCount;
  }
  else if (harmlessCount > 0) {
    returnObj.risk = "success";
    returnObj.message = `This is a trusted and safe ${report.type}.`;
    returnObj.noOfIssue = 0;
  }
  else {
    returnObj.risk = "unclear";
    returnObj.message = "Further investigation recommended.";
    returnObj.noOfIssue = undetected;
  }

  return returnObj;
};

export default function TheHarvesterDashboard() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<HarvesterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastScans, setPastScans] = useState([]);

  useEffect(() => {
    const getPastScans = async () => {
      const data = await fetchScannedData("osint_threat_intelligence_scan", 'id', false, null, null);
      if (data && data.data) {
        setPastScans(data.data);
      }
    };

    getPastScans();
  }, [data]);

  const fetchData1 = async (searchType: string): Promise<void> => {
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

  console.log("past scans ---------");
  console.log(pastScans);
  console.log("current scan ---------");
  console.log(data);

  function handleOpenPastScan(key: string) {
    const pastScan = pastScans.find(scan => scan.data[key]);
    if (pastScan) {
      setData(pastScan.data[key]);
    }
  }

  const pastScansForWidget = useMemo(() => {
    return pastScans.flatMap(scan =>
      Object.entries(scan.data).map(([key, value]) => {
        const { totalIssue, noOfIssue, risk, message } = getDomainSafetyMessage(value);
        return {
          key,
          titleHeading: value.id,
          title: message,
          totalIssue,
          noOfIssue,
          status: risk,
          scanOn: value.scanned_at,
          href: '#',
        };
      })
    );
  }, [pastScans]);

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
        <p className="font-bold text-pageheader">OSINT & Threat Intelligence</p>
        <SearchBar query={query} setQuery={setQuery} fetchData={fetchData1} />
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* New Section with Styled Text and Links */}
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
          <strong className="text-white ">
            sharing of your Sample submission with the security community.
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

        {data && (
          <div className="space-y-8">
            <Widgets widgetData={data} queryUrl={query} />
          </div>
        )}

        <div>
          <PastScans pastScans={pastScansForWidget} onOpenPastScan={handleOpenPastScan} />
        </div>
      </div>
    </>
  );
}
