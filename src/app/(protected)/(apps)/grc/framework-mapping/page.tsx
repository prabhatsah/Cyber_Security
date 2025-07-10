
import { fetchControlsData,fetchFrameworkMappingData } from "./fetchData";
import FrameworkMappingDataTable from "./FrameworkMappingDataTable"; // Import the Client Component

export default async function FrameworkMappingPage() {
  const controlsData = await fetchControlsData(); // Fetch data using the external function
  const frameworkMappingData = await fetchFrameworkMappingData(); // Fetch framework mapping data
  console.log("Fetched Framework Mapping Data from page.tsx ======>>>> ", frameworkMappingData);
  console.log("Fetched Controls Data from page.tsx ======>>>> ", controlsData);

  return (
    <>
      <FrameworkMappingDataTable controlsData={controlsData} frameworkMappingData={frameworkMappingData} /> {/* Pass fetched data */}
    </>
  );
}