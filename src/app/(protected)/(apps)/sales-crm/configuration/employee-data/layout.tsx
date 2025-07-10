import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function EmployeeDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Employee Data", href: "/sales-crm/configuration/employee-data" }} />
            {children}
        </>
    );
}