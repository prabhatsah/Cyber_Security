import { ReactNode } from "react";
import ManagementToggle from "./components/management-toggle";
import ManagementWidgets from "./components/management-widgets";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: "Management",
          href: "/ai-ml-workbench/admin/management",
        }}
      />
      <div className="flex flex-col gap-3 h-full overflow-hidden">
        <ManagementWidgets />
        <ManagementToggle />
        <div className="flex-grow overflow-hidden">{children}</div>
      </div>
    </>
  );
}

export default Layout;
