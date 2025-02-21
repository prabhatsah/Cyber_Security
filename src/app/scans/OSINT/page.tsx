// "use client";
// import { useState } from "react";
// import SearchBar from "./SearchBar";
// import Widgets from "./Widgets";
// import GraphView from "./GraphView";
// import MapView from "./MapView";
// import DetailsTable from "./DetailsTable";
// import Layout from '@/components/Layout';

// export default function TheHarvesterDashboard() {
//   const [query, setQuery] = useState("");
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   const fetchData = async (searchType) => {
//     try {
//       const response = await fetch(`/api/theharvester?query=${query}&type=${searchType}`);
//       const result = await response.json();
//       if (result.error) throw new Error(result.error);
//       setData(result.data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
// <Layout>
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Advanced OSINT Dashboard</h1>
//       <SearchBar query={query} setQuery={setQuery} fetchData={fetchData} />
//       {error && <p className="text-red-600 text-center">{error}</p>}

//       {data && (
//         <div className="space-y-8">
//           <Widgets data={data} />
//           <GraphView data={data} />
//           <MapView data={data} />
//           <DetailsTable data={data} />
//         </div>
//       )}
//     </div>
//     </Layout>
//   );
// }


'use client';

import { useState } from 'react';
import SearchBar from './SearchBar';
import Widgets from './Widgets';
import GraphView from './GraphView';
import MapView from './MapView';
import DetailsTable from './DetailsTable';
import Layout from '@/components/Layout';

// Define interfaces for the data structure
interface HarvesterData {
  // Replace these with actual keys from your API response
  [key: string]: any;
}

interface ApiResponse {
  data: HarvesterData;
  error?: string;
}

export default function TheHarvesterDashboard() {
  const [query, setQuery] = useState<string>(''); // Specify string type for query
  const [data, setData] = useState<HarvesterData | null>(null); // Data can be of type HarvesterData or null
  const [error, setError] = useState<string | null>(null); // Error can be a string or null

  // Define the fetchData function with proper typing
  const fetchData = async (searchType: string): Promise<void> => {
    try {
      const response = await fetch(`/api/OSINT/theharvester?query=${query}&type=${searchType}`);
      const result: ApiResponse = await response.json();

      if (result.error) throw new Error(result.error);
      setData(result.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Layout>
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
    </Layout>
  );
}
