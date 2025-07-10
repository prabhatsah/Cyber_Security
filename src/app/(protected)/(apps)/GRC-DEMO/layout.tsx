import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import KBContextProvider from "./(context)/KnowledgeBaseContext";

const menuitems = [];

async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <KBContextProvider>
        <RenderAppSidebar menuItems={menuitems} />
        <RenderAppBreadcrumb
          breadcrumb={{ level: 1, title: "GRC DEMO", href: "/GRC-DEMO" }}
        />
        {children}
      </KBContextProvider>
    </>
  );
}

export default layout;
