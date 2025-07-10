import { useProbeData } from "../../../components/data-collection";
import ProbeDashboardDataTable from "./probe-dashboard-datatable";

export default async function CreateProbeDashboardDataTableData() {
  const probeData = (await useProbeData()).slice(0, 7);

  return (
    <>
      <ProbeDashboardDataTable probeDashboardData={probeData} />
    </>
  );
}
