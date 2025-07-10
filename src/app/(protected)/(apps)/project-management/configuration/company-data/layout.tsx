import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function CompanyDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Company Data", href: "/project-management/configuration/company-data" }} />
            {children}
        </>
    );
}