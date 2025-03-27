"use client";

import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import Widgets from "./Widgets";
import { ApiResponse, HarvesterData } from "./components/type";
import PastScans from "@/components/PastScans";
import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { addColumn, fetchData, saveScannedData, updateColumn } from "@/utils/api";
import { saveData } from "@/ikon/utils/api/processRuntimeService";
import { getProfileData } from "@/ikon/utils/actions/auth";


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

  // const uniqueKey = URL.createObjectURL(new Blob()).split('/').pop();
  const uniqueKey = new Date().getTime().toString();
  console.log("uniqueKey----------", uniqueKey);

  scanData.scanned_at = formatTimestamp(uniqueKey);

  const resp = saveScannedData("osint_threat_intelligence_scan", { key: uniqueKey, value: scanData });

  // let resp;
  // if (uniqueKey) {
  //   resp = await updateColumn("osint_threat_intelligence_scan", "scandata", scanData, uniqueKey, "Rizwan Ansari");
  // }
  // return await resp.json();
  return resp;
}

async function fetchPastScan() {

  const resp = await fetchData("osint_scandata", "");

  return resp;
}



export default function TheHarvesterDashboard() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<HarvesterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastScans, setPastScans] = useState([]);
  // const [profileData, setProfileData] = useState<any>();

  // console.log("hello..........");
  // fetchData("osint_scandata", null).then(setPastScans)

  // useEffect(() => {
  //   console.log(pastScans);
  // }, [pastScans])

  useEffect(() => {
    const getPastScans = async () => {
      // const profile = await getProfileData();
      // setProfileData(profile);
      const data = await fetchData("osint_threat_intelligence_scan", null);
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

  console.log("past scans ---------");
  console.log(pastScans);
  console.log("current scan ---------");
  console.log(data);
  // console.log("profile - ", profileData);

  function handleOpenPastScan(key: string) {
    for (let i = 0; i < pastScans.length; i++) {
      if (pastScans[i]?.data[key]) {
        setData(pastScans[i]?.data[key]);
      }
    }
  }

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
        <SearchBar query={query} setQuery={setQuery} fetchData={fetchData1} />
        {error && <p className="text-red-600 text-center">{error}</p>}

        {data && (
          <div className="space-y-8">
            <Widgets widgetData={data} queryUrl={query} />
          </div>
        )}

        <div>
          <PastScans pastScans={pastScans} onOpenPastScan={handleOpenPastScan} />
        </div>
      </div>
    </>
  );
}
