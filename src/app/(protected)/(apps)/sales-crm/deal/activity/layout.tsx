import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function LeadActivityLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Activity", href: "/sales-crm/deal/activity" }} />
            {children}
        </>
    );
}
