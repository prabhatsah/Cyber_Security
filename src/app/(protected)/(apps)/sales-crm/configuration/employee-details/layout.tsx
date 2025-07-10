import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function EmployeeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 3, title: "Employee Details", href: "sales-crm/configuration/employee-details" }} />
            {children}
        </>
    );
}