
import { fetchFrameworkMappingData,getFrameworkDetails } from "./fetchData";
import FrameworkMappingDataTable from "./FrameworkMappingDataTable"; // Import the Client Component

export default async function FrameworkMappingPage() {
  const frameworkMappingData = await fetchFrameworkMappingData(); // Fetch framework mapping data
  const frameworkDetailsData = await getFrameworkDetails();


  return (
    <>
      <FrameworkMappingDataTable  frameworkMappingData={frameworkMappingData} frameworkDetailsData={frameworkDetailsData}/> {/* Pass fetched data */}
    </>
  );
}