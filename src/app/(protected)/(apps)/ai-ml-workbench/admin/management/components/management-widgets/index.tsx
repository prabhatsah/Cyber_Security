import { WidgetProps } from "@/ikon/components/widgets/type";
import {
  useMlServerData,
  useProbeData,
} from "../../../components/data-collection";
import ManagementWidget from "./management-widget";

export default async function CreateManagementWidgetsData() {
  const mlServerData = await useMlServerData();
  const probeData = await useProbeData();

  const mlManagementWidgetData: WidgetProps[] = [
    {
      id: "totalServers",
      widgetText: "Total Server(s)",
      widgetNumber: JSON.stringify(mlServerData.length),
      iconName: "server",
    },
    {
      id: "readyServers",
      widgetText: "Ready Server(s)",
      widgetNumber: JSON.stringify(
        mlServerData.filter(
          (eachServerData) => eachServerData.status === "Ready"
        ).length
      ),
      iconName: "badge-check",
    },
    {
      id: "totalProbes",
      widgetText: "Total Probe(s)",
      widgetNumber: JSON.stringify(probeData.length),
      iconName: "server",
    },
    {
      id: "readyProbes",
      widgetText: "Probe(s)",
      widgetNumber: JSON.stringify(
        probeData.filter((eachProbeData) => eachProbeData.ACTIVE === true)
          .length
      ),
      iconName: "badge-check",
    },
  ];

  return (
    <>
      <ManagementWidget mlManagementWidgetData={mlManagementWidgetData} />
    </>
  );
}
