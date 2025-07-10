import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";


export default function SummaryLayout({ children }: { children: React.ReactNode }) {
    return <>
          <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: "Summary",
        }}
      />
      {children}</>;
}
