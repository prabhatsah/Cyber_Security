import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function FxRateLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 3,
          title: "FX Rates",
          href: "/sales-crm/configuration/fx-rates",
        }}
      />
      {children}
    </>
  );
}


