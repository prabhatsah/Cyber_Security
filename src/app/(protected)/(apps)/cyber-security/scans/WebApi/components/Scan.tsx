"use client";

import { useEffect, useMemo, useState } from "react";
import { FaFire, FaSpider } from "react-icons/fa6";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import PastScans from "@/components/PastScans";

import SearchBar from "./SearchBar";
import SpiderScan from "./SpiderScan";
import ActiveScan from "./ActiveScan";
import Dashboard from "./dashboard";
import { usePolling } from "../hooks/usePolling";

import { fetchScannedData } from "@/utils/api";
import { Alert, PastScansData, Site } from "../types/alertTypes";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/webApi/ZAP";

const getRiskAndIssues = (alerts: Alert[]) => {
  let success = 0, warning = 0, critical = 0;

  for (const { riskcode } of alerts) {
    if (riskcode === "0" || riskcode === "1") success++;
    else if (riskcode === "2") warning++;
    else critical++;
  }

  if (critical) return { risk: "critical", issues: critical };
  if (warning) return { risk: "warning", issues: warning };
  return { risk: "success", issues: success };
};

export default function Scan() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<(Site & { scanned_at?: string }) | null>(null);
  const [pastScans, setPastScans] = useState<PastScansData[]>([]);
  const [openTabs, setOpenTabs] = useState(false);
  const [loadingPastScans, setLoadingPastScans] = useState(true);

  const {
    isScanning,
    spiderProgress,
    foundURI,
    scanDetails,
    messages,
    startScan,
  } = usePolling(apiUrl, query, setOpenTabs, setData);

  useEffect(() => {
    const getPastScans = async () => {
      const data = await fetchScannedData("web_api_scan_history", 'id', false, null, null, 0, 10);
      setPastScans(data.data);
      setLoadingPastScans(false);
    };

    getPastScans();
  }, [data]);

  const handleOpenPastScan = (key: string) => {
    const scanData = pastScans.find(scan => scan.data[key])?.data[key];
    if (scanData) {
      setOpenTabs(false);
      setData(scanData);
    }
  };


  const pastScansForWidget = useMemo(() => {
    return pastScans.flatMap(scan =>
      Object.entries(scan.data).map(([key, value]) => {
        const { risk, issues } = getRiskAndIssues(value.alerts);
        return {
          key,
          titleHeading: value["@host"],
          title: value["@name"],
          totalIssue: value.alerts.length,
          noOfIssue: issues,
          status: risk,
          scanOn: value.scanned_at,
          href: '#',
        };
      })
    );
  }, [pastScans]);

  console.log("web and api scan data - ", data);
  console.log("past scans - ", pastScans);


  return <>
    <SearchBar
      query={query}
      setQuery={setQuery}
      fetchData={startScan}
      isLoading={isScanning}
    />

    {openTabs && <Tabs defaultValue="tab1">
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
              progress={scanDetails.activeProgress}
              newAlerts={scanDetails.newAlerts}
              numRequests={scanDetails.numRequests}
              messages={messages}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>}

    {data && <Dashboard _data={data} />}

    <PastScans pastScans={pastScansForWidget} loading={loadingPastScans} onOpenPastScan={handleOpenPastScan} />
  </>
}