import { useProbeData } from "../../components/data-collection";
import ProbeDataTable from "./components/probe-datatable";

export default async function Probes() {
  const probeData = await useProbeData();

  return (
    <>
      <ProbeDataTable probeDataTableData={probeData} />
    </>
  );
}
