import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb/index";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
import { ReactNode } from "react";

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppSidebar menuItems={[]}/>
      <RenderAppBreadcrumb breadcrumb={{ level: 1, title: "App Store", href: "/app-store" }} />
      {/* <AppStateProvider> */}
      {children}
      {/* </AppStateProvider> */}
    </>
  )
}

export default Layout