import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { ReactNode } from "react";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 2,
                    title: "Containers",
                    href: "/scans/cloudContainer/containers",
                }}
            />
            {children}
        </>
    );
}