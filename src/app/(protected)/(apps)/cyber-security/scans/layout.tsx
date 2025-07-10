import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Cloud & Container",
          href: "/scans/cloudContainer",
        }}
      /> */}
      <div className="flex flex-col h-full">
        {children}
      </div>
    </>
  );
}
