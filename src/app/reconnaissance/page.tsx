import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import ReconnaissanceTabs from "./components/ReconnaissanceTabs";

export default function Reconnaissance() {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Reconnaissance",
                    href: "/reconnaissance",
                }}
            />
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 1,
                    title: "Active Scans",
                    href: "/reconnaissance/active-scans",
                }}
            />
            <ReconnaissanceTabs />
        </>
    )
}