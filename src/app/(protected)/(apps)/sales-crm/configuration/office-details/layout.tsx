import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function OfficeDetailsLayout({children,}: Readonly<{children: React.ReactNode;}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Office Details", href: "/sales-crm/configuration/office-details" }} />
            {children}
        </>
    );
}