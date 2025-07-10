import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
const menuitems = [
  {
    title: "Projects",
    href: "/task-management",
    iconName: "folder",
  },

];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{ level: 1, title: "Projects", href: "/task-management" }}
      />
      {children}
    </>
  );
}

export default layout;
