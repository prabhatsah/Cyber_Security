import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { ReactNode } from "react";

function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: "Admin",
        }}
      />
      {children}
    </>
  );
}

export default Layout;
