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
          title: "Penetration Testing",
          href: "/pen-test",
        }}
      />
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 1,
          title: "Web Application Penetration Testing",
          href: "/pen-test/web-app-pen-test",
        }}
      />
      <div className=" h-full w-full">{children}</div>
    </>
  );
}
