"use client";
import { useState } from "react";
import SearchBar from "./SearchBar";
import Widgets from "./Widgets";
import GraphView from "./GraphView";
import MapView from "./MapView";
import DetailsTable from "./DetailsTable";

export default function TheHarvesterDashboard() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async (searchType) => {
    try {
      const response = await fetch(`/api/theharvester?query=${query}&type=${searchType}`);
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setData(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Advanced OSINT Dashboard</h1>
      <SearchBar query={query} setQuery={setQuery} fetchData={fetchData} />
      {error && <p className="text-red-600 text-center">{error}</p>}

      {data && (
        <div className="space-y-8">
          <Widgets data={data} />
          <GraphView data={data} />
          <MapView data={data} />
          <DetailsTable data={data} />
        </div>
      )}
    </div>
  );
}
