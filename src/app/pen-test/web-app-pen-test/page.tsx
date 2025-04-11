import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import PanetestWidget from "./components/PanetestWidget";

export default function WebAppPenetrationTesting() {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Penetration Testing",
                    href: "/pen-test",
                }}
            />
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 1,
                    title: "Web Application Penetration Testing",
                    href: "/pen-test/web-app-pen-test",
                }}
            />
            <PanetestWidget />
        </>
    );
}