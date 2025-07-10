import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";


async function layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>

      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: "Tickets",
        }}
      />
      {children}
    </>
  );
}

export default layout;

