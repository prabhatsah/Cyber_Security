import React, { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default async function DocumentLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "My Drive", href: "/document-management/my-drive" }} />
            <div className="flex-grow h-full overflow-hidden">
                {children}
            </div>
        </>
    );
}