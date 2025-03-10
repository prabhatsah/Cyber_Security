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

"use client";

import Dashboard from "./dashboard";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import SearchBar from "./SearchBar";
import PastScans from "@/components/PastScans";

interface webApiData {
  [key: string]: any;
}

interface ApiResponse {
  data: webApiData;
  error?: string;
}

export default function WebApi() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<webApiData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { setItems } = useBreadcrumb();
  useEffect(() => {
    setItems([
      { label: "Scans", href: "/scans" },
      { label: "Web &  API Security", href: "/scans/webApi" },
    ]);
  }, []);

  // Fetch data on component mount
  const fetchData = async (searchType: string): Promise<void> => {
    try {
      const urlToScan = query; // Assuming query holds the URL to scan
      if (!urlToScan) {
        throw new Error("Please provide a valid URL.");
      }

      // Send the scan request
      const response = await fetch("http://localhost:3000/api/webApi/ZAP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlToScan }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      console.log("------------------- response");
      console.log(response);

      const result = await response.json();

      console.log(result);

      if (result.error) {
        throw new Error(result.error);
      }

      // Extract and set the report data
      setData(result.report); // Assuming you have a state `setData`
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  // Handle loading, error, and display data
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="">
      <p className="font-bold text-gray-600">Web & Api Security</p>
      <SearchBar query={query} setQuery={setQuery} fetchData={fetchData} />
      {error && <p className="text-red-600 text-center">{error}</p>}

      {data && <Dashboard _data={data} />}
      <div>
        <PastScans />
      </div>
    </div>
  );
}
