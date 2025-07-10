import React, { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{ level: 2, title: "Device List", href: "bms/deviceList" }}
            />
            <div className="flex-grow h-full overflow-hidden">
                {children}
            </div>
        </>
    );
}