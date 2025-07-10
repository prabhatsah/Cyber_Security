import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";

async function dashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>

      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: "Dashboard",
          href: "/customer-support/dashboard",
        }}
      />
      {children}
    </>
  );
}

export default dashboardLayout;
