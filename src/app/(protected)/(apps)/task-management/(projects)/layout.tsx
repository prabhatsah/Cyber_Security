import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

function layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "Projects", href: "/task-management/projects" }} />
            {children}
        </>
    )
}

export default layout