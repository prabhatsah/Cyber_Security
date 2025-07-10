import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { ReactNode } from "react";

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: "ML Servers",
          href: "/ai-ml-workbench/admin/management/ml-servers",
        }}
      />
      {children}
    </>
  );
}

export default Layout;
