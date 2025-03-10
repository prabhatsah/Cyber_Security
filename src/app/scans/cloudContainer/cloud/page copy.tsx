"use client";

import Layout from "@/components/Layout";
import Dashboard from "../dashboard";
import { useEffect, useState } from "react";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

interface CloudContainerData {
  [key: string]: any;
}

interface ApiResponse {
  data: CloudContainerData;
  error?: string;
}

export default function CloudDashboard() {
  const [data, setData] = useState<CloudContainerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cloud-container/scout?query=gcp`);

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result: ApiResponse = await response.json();

        if (result.error) throw new Error(result.error);
        setData(result.data); // Set fetched data
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Handle error
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle loading, error, and display data
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {data ? <Dashboard data={data} /> : <div>No data available</div>}
    </>
  );
}