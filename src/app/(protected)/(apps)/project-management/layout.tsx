import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "Projects",
    href: "/project-management",
    iconName: "house",
  },
  {
    title: "Gantt View",
    href: "/project-management/gantt-view",
    iconName: "eye",
  },
  {
    title: "Configuration",
    submenu: [
      {
        title: "Employee Details",
        href: "/project-management/configuration/employee-details",
        iconName: "user",
      },
      {
        title: "Company Data",
        href: "/project-management/configuration/company-data",
        iconName: "landmark",
      },
      {
        title: "Working Days",
        href: "/project-management/configuration/working-days",
        iconName: "dollar-sign",
      },
      {
        title: "Risk Data",
        href: "/project-management/configuration/risk-data",
        iconName: "warehouse",
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
        breadcrumb={{ level: 1, title: "Project Management", href: "/project-management" }}
      />
      {children}
    </>
  );
}

export default layout;
