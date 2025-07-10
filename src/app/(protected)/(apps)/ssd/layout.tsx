import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "SSD Main Page",
    href: "/ssd",
    iconName: "chart-column",
  },
  {
    title: "Datasets",
    submenu: [
      {
        title: "Uploads",
        href: "/ssd/datasets/uploads",
        iconName: "cloud-upload",
      },
      {
        title: "Connectors",
        // href: "",
        iconName: "database",
      },
      {
        title: "Ikon",
        // href: "",
        iconName: "link",
      },
    ],
    iconName: "table-of-contents",
  },
  {
    title: "Configurator",
    submenu: [
      {
        title: "New Connector",
        // href: "",
        iconName: "file-plus",
      },
      {
        title: "Probe",
        // href: "",
        iconName: "cable",
      },
      {
        title: "Association",
        // href: "",
        iconName: "router",
      },
    ],
    iconName: "settings",
  },
  {
    title: "Workspace",
    submenu: [
      {
        title: "Report",
        href: "",
        iconName: "file-check",
      },
      {
        title: "Dashboard",
        href: "",
        iconName: "chart-line",
      },
    ],
    iconName: "square-user-round",
  },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "SSD", href: "/ssd" }}
      />
      {children}
    </>
  );
}

export default layout;
