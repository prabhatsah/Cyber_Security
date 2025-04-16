import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";

export default function NetworkPenetrationTesting() {
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
                    title: "Network Penetration Testing",
                    href: "/pen-test/network-pen-test",
                }}
            />
            <h1>Network Penetration Testing</h1>
        </>
    );
}