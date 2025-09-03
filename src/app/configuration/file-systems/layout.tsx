import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

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
          title: "Configuration",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "File Systems",
          href: "/configuration/file-systems",
        }}
      />
      <div className="flex h-full w-full">{children}</div>
    </>
  );
}
