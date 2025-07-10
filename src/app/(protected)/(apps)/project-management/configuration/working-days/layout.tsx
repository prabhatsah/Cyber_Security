import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function WorkingDaysLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Working Days", href: "/project-management/configuration/working-days" }} />
            {children}
        </>
    );
}