import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";


export default async function PurchaseLayout({
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
    </>
  );
}
