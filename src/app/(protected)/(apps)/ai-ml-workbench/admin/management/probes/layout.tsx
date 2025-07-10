"use client";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { ReactNode } from "react";

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: "Probes",
          href: "/ai-ml-workbench/admin/management/probes",
        }}
      />
      {children}
    </>
  );
}

export default Layout;
