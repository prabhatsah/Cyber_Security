import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { ReactNode } from "react";

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: "Dashboard",
          href: "/ai-ml-workbench/admin/dashboard/",
        }}
      />
      {children}
    </>
  );
}

export default Layout;
