import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";


export default function OpenTicketsLayout({ children }: { children: React.ReactNode }) {
    return <>
          <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: "Open Tickets",
        }}
      />
      {children}</>;
}
