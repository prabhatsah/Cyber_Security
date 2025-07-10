import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

function layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "Billing", href: "/sales-crm/billing" }} />
            {children}
        </>
    )
}

export default layout