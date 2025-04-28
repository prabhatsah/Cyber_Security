import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { ReactNode } from "react";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            {/* <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Configuration",
                }}
            /> */}
            {children}
        </>
    );
}