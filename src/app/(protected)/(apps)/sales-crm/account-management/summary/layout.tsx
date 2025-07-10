import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function AccountSummaryLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Summary", href: "/sales-crm/account-management/summary" }} />
            {children}
        </>
    );
}
