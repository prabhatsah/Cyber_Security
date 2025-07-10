import React, { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default async function Layout({ children }: { children: ReactNode }) {
    return (
        <>
             <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "Starred", href: "/document-management/starred" }} />
            <div className="flex-grow h-full overflow-hidden">
                {children}
            </div>
        </>
    );
}