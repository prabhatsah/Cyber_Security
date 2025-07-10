import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";


async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
        <RenderAppSidebar menuItems={[]} />
        <RenderAppBreadcrumb
          breadcrumb={{ level: 1, title: "GRC", href: "/grc-v2" }}
        />
        {children}
    </>
  );
}

export default layout;
