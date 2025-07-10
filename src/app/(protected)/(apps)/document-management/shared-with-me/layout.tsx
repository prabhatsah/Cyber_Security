import React, { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "Shared with me", href: "/document-management/shared-with-me" }} />
            <div className="flex-grow h-full overflow-hidden">
                {children}
            </div>
        </>
    );
}