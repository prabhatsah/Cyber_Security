import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: "License",
          href: "/sales-crm/account-management/license",
        }}
      />
      {children}
    </>
  );
}

export default layout;
