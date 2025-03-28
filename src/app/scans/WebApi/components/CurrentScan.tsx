"use client";

import { useCallback, useState } from "react";
import { FaFire, FaSpider } from "react-icons/fa6";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";

import SearchBar from "./SearchBar";
import SpiderScan from "./SpiderScan";
import ActiveScan from "./ActiveScan";
import Dashboard from "./dashboard";
import { usePolling } from "../hooks/usePolling";
import { useInterval } from "../hooks/useInterval";
import { apiRequest } from "../utils/api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/webApi/ZAP";

export default function CurrentScan() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([]);

  const {
    isScanning,
    spiderProgress,
    activeProgress,
    foundURI,
    newAlerts,
    numRequests,
    startScan,
  } = usePolling(apiUrl, query, setData);

  const fetchMessages = useCallback(async () => {
    if (!query || spiderProgress != 100) return; // Stop fetching when not scanning
    try {
      const messagesData = await apiRequest(
        `${apiUrl}/messages?baseurl=${encodeURIComponent(query)}&start=${messages.length}`,
      );
      // setMessages(messagesData.messages);
      setMessages((prev) => [...prev, ...messagesData.messages]);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, [query, messages.length, spiderProgress]);

  // Interval runs only when scanning is active
  useInterval(
    () => {
      if (isScanning && spiderProgress == 100)
        fetchMessages();
    },
    isScanning && spiderProgress == 100 ? 5000 : null
  );


  return <>
    <SearchBar
      query={query}
      setQuery={setQuery}
      fetchData={startScan}
      isLoading={isScanning}
    />

    {/* {error && <p className="text-red-600 text-center">{error}</p>} */}

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
  </>
}