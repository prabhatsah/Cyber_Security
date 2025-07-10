import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { icon } from "@progress/kendo-react-common";
//import { DiscoveryProvider } from '../../discovery/actions/context/DiscoveryContext';
//import './custom-scrollbar.css';
const menuitems = [
  {
    title: "Dashboard",
    href: "/bms/buildings/building-a/floors/floor-1/equipments/equip-1/dashboard",
    iconName: "house",
  },
  {
    title: "Alarm & Events",
    href: "/bms/buildings/building-a/floors/floor-1/equipments/equip-1/alarms",
    iconName: "bell",
  },
  {
    title: "Trend Analysis",
    href: "/bms/buildings/building-a/floors/floor-1/equipments/equip-1/trends",
    iconName: "chart-line",
  },
  {
    title: "Control Interface",
    href: "/bms/buildings/building-a/floors/floor-1/equipments/equip-1/control",
    iconName: "sliders",
  },
  {
    title: "Data Analytics",
    href: "/bms/buildings/building-a/floors/floor-1/equipments/equip-1/analytics",
    iconName: "chart-pie",
  },
  {
    title : "Reports",
    href: "/bms/buildings/building-a/floors/floor-1/equipments/equip-1/reports",
    iconName: "file-text",
  },
  {
    title : "Predictive Analysis",
    href: "/bms/buildings/building-a/floors/floor-1/equipments/equip-1/predictive",
    iconName: "chart-line",
  }
];

export default async function BuildingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string; floorId: string; equipmentId: string };
}) {
  const { id, floorId, equipmentId } = await params;
  return (
    <>
      {/* {children} */}
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 5,
          title: "Equipment",
          href: `/bms/buildings/${id}/floors/${floorId}/equipments/${equipmentId}`,
        }}
      />
      {children}
    </>
  );
}
