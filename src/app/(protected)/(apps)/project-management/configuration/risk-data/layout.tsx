import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function WorkingDaysLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Risk Data", href: "/project-management/configuration/risk-data" }} />
            {children}
        </>
    );
}