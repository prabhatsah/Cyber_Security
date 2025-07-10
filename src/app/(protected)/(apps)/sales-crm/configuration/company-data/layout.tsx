import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function LeadActivityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Company Data", href: "/sales-crm/configuration/company-data" }} />
            {children}
        </>
    );
}