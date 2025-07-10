import {
  useMlServerData,
  useProbeData,
} from "../../../components/data-collection";
import ServerDashboardDataTable from "./server-dashboard-datatable";

export default async function CreateServerDashboardDataTableData() {
  const mlServerData = await useMlServerData();
  const probeData = await useProbeData();

  const serverDashboardData = [
    { heading: "Total Servers", value: mlServerData.length },
    {
      heading: "Ready Servers",
      value: mlServerData.filter(
        (eachServerData) => eachServerData.status === "Ready"
      ).length,
    },
    { heading: "Total Probes", value: probeData.length },
    {
      heading: "Active Probes",
      value: probeData.filter((eachProbeData) => eachProbeData.ACTIVE === true)
        .length,
    },
  ];

  return (
    <>
      <ServerDashboardDataTable serverDashboardData={serverDashboardData} />
    </>
  );
}
