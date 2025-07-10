import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { icon } from "@progress/kendo-react-common";
//import { DiscoveryProvider } from '../../discovery/actions/context/DiscoveryContext';
//import './custom-scrollbar.css';
const menuitems = [
  {
    title: "Dashboard",
    href: "/bms",
    iconName: "house",
  },
  {
    title: "Trend Analysis",
    href: "/bms/trends",
    iconName: "chart-pie",
  },
  {
    title: "Predictive Analysis",
    href: "/bms/predictive",
    iconName: "chart-line",
  },
  {
    title: "Reports",
    href: "",
    iconName: "file-text",
  },
  {
    title: "Notification Overview",
    href: "",
    iconName: "bell",
  },
];

export default async function BuildingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string; floorId: string };
}) {
  const { id, floorId } = await params;
  return (
    <>
      {/* {children} */}
      
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: "Floor",
          href: `/bms/buildings/${id}/floors/${floorId}`,
        }}
      />
      {children}
    </>
  );
}
