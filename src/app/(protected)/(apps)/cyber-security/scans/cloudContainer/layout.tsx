import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import CloudContainerTabs from "./components/CloudContainerTabs";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 0,
          title: "Scans",
          href: "/cyber-security/scans",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Cloud & Container",
          href: "/cyber-security/scans/cloudContainer",
        }}
      />
      <div className="flex flex-col h-full">
        <CloudContainerTabs />
        {children}
      </div>
    </>
  );
}





