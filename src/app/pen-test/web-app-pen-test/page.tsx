import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

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
            <h1>Web Application Penetration Testing</h1>
        </>
    );
}