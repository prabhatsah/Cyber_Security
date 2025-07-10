import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function InvoiceDetailsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Invoice Details", href: "/sales-crm/billing/invoice-details" }} />
            {children}
        </>
    );
}
