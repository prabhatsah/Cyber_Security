import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { MenuItem } from "@/ikon/components/app-sidebar/type";
import { ReactNode } from "react";

const menuitems: MenuItem[] = [
  {
    title: "Workspace",
    iconName: "bot",
    href: "/ai-workforce/workspace",
  },
  {
    title: "Dashboard",
    iconName: "bar-chart",
    href: "/ai-workforce/dashboard",
  },
  {
    title: "Agent Studio",
    iconName: "workflow",
    href: "/ai-workforce/agent-studio",
  },
  {
    title: "Knowledge Base",
    iconName: "book",
    href: "/ai-workforce/knowledge-base",
  },
];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={menuitems} />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "AI Workforce",
          href: "/ai-workforce",
        }}
      />
      {children}
    </>
  );
}

export default layout;
