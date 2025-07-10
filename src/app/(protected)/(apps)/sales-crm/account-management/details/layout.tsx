import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function LeadDetailsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Details", href: "/sales-crm/account-management/details" }} />
            {children}
        </>
    );
}
