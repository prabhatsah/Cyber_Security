import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function LeadActivityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Organization Details", href: "/supplier-management/configuration/organization-details" }} />
            {children}
        </>
    );
}