import type { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";


function layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{ level: 2, title: "Story Book", href: "/bms/storybook" }}

            />
            {children}
        </>
    );
}

export default layout;
