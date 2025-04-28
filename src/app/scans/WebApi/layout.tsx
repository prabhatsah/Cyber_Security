import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Web & API Security",
          href: "/scans/WebApi",
        }}
      />
      <div className="flex flex-col h-full">
        {children}
      </div>
    </>
  );
}
