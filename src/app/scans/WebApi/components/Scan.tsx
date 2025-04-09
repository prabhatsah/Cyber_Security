"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFire, FaSpider } from "react-icons/fa6";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import PastScans from "@/components/PastScans";

import SearchBar from "./SearchBar";
import SpiderScan from "./SpiderScan";
import ActiveScan from "./ActiveScan";
import Dashboard from "./dashboard";
import { usePolling } from "../hooks/usePolling";
import { useInterval } from "../hooks/useInterval";
import { apiRequest } from "../utils/api";

import { fetchData, fetchScannedData } from "@/utils/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/webApi/ZAP";

const getRiskAndIssues = (alerts) => {
  const returnObj = {
    risk: "", issues: 0
  }

  const riskCount = {
    critical: 0,
    warning: 0,
    success: 0
  }

  for (let i = 0; i < alerts.length; i++) {
    if (alerts[i].riskcode == "0" || alerts[i].riskcode == "1") {
      riskCount.success += 1;
    } else if (alerts[i].riskcode == "2") {
      riskCount.warning += 1;
    } else {
      riskCount.critical += 1;
    }
  }

  if (riskCount.critical) {
    returnObj.issues = riskCount.critical;
    returnObj.risk = "critical";
  } else if (riskCount.warning) {
    returnObj.issues = riskCount.warning;
    returnObj.risk = "warning";
  } else {
    returnObj.issues = riskCount.success;
    returnObj.risk = "success";
  }

  return returnObj;
};

export default function Scan() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  // const [messages, setMessages] = useState([]);
  const [pastScans, setPastScans] = useState([]);
  const [openTabs, setOpenTabs] = useState(false);

  const {
    isScanning,
    spiderProgress,
    activeProgress,
    foundURI,
    newAlerts,
    numRequests,
    messages,
    startScan,
  } = usePolling(apiUrl, query, setOpenTabs, setData);

  useEffect(() => {
    const getPastScans = async () => {
      const data = await fetchScannedData("web_api_scan", 'userid', false, null, null);
      setPastScans(data.data);
      // if (data && data[0].data) {
      //   setPastScans(data[0].data);
      // }
    };

    getPastScans();
  }, [data]);

  // const fetchMessages = useCallback(async () => {
  //   if (!query || spiderProgress != 100) return; // Stop fetching when not scanning
  //   try {
  //     const messagesData = await apiRequest(
  //       `${apiUrl}/messages?baseurl=${encodeURIComponent(query)}&start=${messages.length}`,
  //     );
  //     // setMessages(messagesData.messages);
  //     setMessages((prev) => [...prev, ...messagesData.messages]);
  //   } catch (err) {
  //     console.error("Error fetching messages:", err);
  //   }
  // }, [query, messages.length, spiderProgress]);

  // Interval runs only when scanning is active
  // useInterval(
  //   () => {
  //     if (isScanning && spiderProgress == 100)
  //       fetchMessages();
  //   },
  //   isScanning && spiderProgress == 100 ? 10000 : null
  // );

  function handleOpenPastScan(key: string) {
    const pastScan = pastScans.find(scan => scan.data[key]);
    if (pastScan) {
      setOpenTabs(false)
      setData(pastScan.data[key]);
    }
  }

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

    {/* {error && <p className="text-red-600 text-center">{error}</p>} */}

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
              progress={activeProgress}
              newAlerts={newAlerts}
              numRequests={numRequests}
              messages={messages}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>}

    {data && <Dashboard _data={data} />}

    <PastScans pastScans={pastScansForWidget} onOpenPastScan={handleOpenPastScan} />
  </>
}