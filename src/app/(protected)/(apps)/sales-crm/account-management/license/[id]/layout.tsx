import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import WidgetData from "./widget-data";


export default async function LicenseLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: any;
}) {
  const id = (await params)?.id || "";
  console.log("identifier ", id);
  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: "Details",
          href: `/sales-crm/account-management/license/${id}`,
        }}
      />
      {children}
      {/* <WidgetData id={id}/> */}
    </>
  );
}
