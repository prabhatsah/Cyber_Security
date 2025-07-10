import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "Forecast",
    href: "/resource-management/forecast",
    iconName: "house",
  },
  {
    title: "Summary",
    href: "/resource-management/resource-summary",
    iconName: "eye",
  },
  {
    title: "Configuration",
    submenu: [
      {
        title: "Employee Details",
        href: "/resource-management/configuration/employee-details",
        iconName: "user",
      },
      {
        title: "Company Data",
        href: "/resource-management/configuration/company-data",
        iconName: "landmark",
      },
      {
        title: "Working Days",
        href: "/resource-management/configuration/working-days",
        iconName: "dollar-sign",
      },
    ],
    iconName: "settings",
  },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "Resource Management", href: "/resource-management/forecast" }}
      />
      {children}
    </>
  );
}

export default layout;
