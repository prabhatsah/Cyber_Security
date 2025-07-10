import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { ReactNode } from "react";
// import AppLayout from "@/components/ikon-components/layouts/app-layout";
// import { RenderAppBreadcrumb } from "@/components/ikon-components/app-breadcrumb";

const menuitems = [
  {
    title: "Admin",
    iconName: "settings",
    submenu: [
      {
        title: "Dashboard",
        href: "/ai-ml-workbench/admin/dashboard",
        iconName: "layout-dashboard",
      },
      {
        title: "Management",
        href: "/ai-ml-workbench/admin/management",
        iconName: "users",
      },
    ],
  },

  {
    title: "Data Scientists",
    iconName: "atom",
    submenu: [
      {
        title: "Assignments",
        href: "/ai-ml-workbench/data-scientists/assignments",
        iconName: "list",
      },
      {
        title: "Projects",
        href: "/ai-ml-workbench/data-scientists/projects",
        iconName: "square-kanban",
      },
      {
        title: "Environments",
        href: "/ai-ml-workbench/data-scientists/environments",
        iconName: "folder-code",
      },
    ],
  },

  {
    title: "Domain Expert",
    iconName: "user-round-check",
    submenu: [
      {
        title: "Assignments",
        href: "/ai-ml-workbench/domain-expert/assignments",
        iconName: "list",
      },
      {
        title: "Communication Page",
        href: "/ai-ml-workbench/domain-expert/communication-page",
        iconName: "radio",
      },
    ],
  },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "AI-ML Workbench",
          href: "/ai-ml-workbench",
        }}
      />
      {children}
    </>
  );
}

export default layout;
