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
          title: "Network Penetration Testing",
          href: "/pen-test/network-pen-test",
        }}
      />
      <div className="flex h-full">{children}</div>
    </>
  );
}
