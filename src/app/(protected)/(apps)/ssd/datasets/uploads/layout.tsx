import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function UploadsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("layout for uploads");
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 2,
          title: "Uploads",
        }}
      />
      {children}
    </>
  );
}
