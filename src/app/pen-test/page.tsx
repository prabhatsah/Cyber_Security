import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { CloudCog, FolderCog, GlobeLock, Network, TabletSmartphone } from "lucide-react";
import EachPenTestTypeWidget from "./components/EachPenTestTypeWidget";

const penTestTypeList = [
    {
        name: "Web Application Penetration Testing",
        description:
            "Web app penetration testing identifies and exploits security vulnerabilities in web applications to assess and improve their security posture.",
        configurationCount: 1,
        icon: <GlobeLock className="size-5" aria-hidden={true} />,
        href: "/pen-test/web-app-pen-test",
    },
    {
        name: "Cloud Security Penetration Testing",
        description:
            "Cloud security pentesting identifies and exploits vulnerabilities in cloud environments to improve security.",
        configurationCount: 0,
        icon: <CloudCog className="size-5" aria-hidden={true} />,
        href: "/cyber-security/pen-test/cloud-security-pen-test",
    },
    {
        name: "API Penetration Testing",
        description:
            "API pentesting finds and exploits vulnerabilities in APIs to ensure secure data exchange and functionality.",
        configurationCount: 0,
        icon: <FolderCog className="size-5" aria-hidden={true} />,
        href: "/cyber-security/pen-test/api-pen-test",
    },
    {
        name: "Network Penetration Testing",
        description:
            "Network pentesting identifies and exploits security weaknesses in network infrastructure to prevent unauthorized access.",
        configurationCount: 0,
        icon: <Network className="size-5" aria-hidden={true} />,
        href: "/cyber-security/pen-test/network-pen-test",
    },
    {
        name: "Mobile Application Penetration Testing",
        description:
            "Mobile app pentesting identifies security flaws in mobile applications to protect user data and prevent attacks.",
        configurationCount: 0,
        icon: <TabletSmartphone className="size-5" aria-hidden={true} />,
        href: "/cyber-security/pen-test/mobile-app-pen-test",
    },
];

export default async function EndPointToolsConfig() {
    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Penetration Testing",
                    href: "/cyber-security/pen-test",
                }}
            />
            <div className=" flex flex-col relative">
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
                    {penTestTypeList.map((item) => (
                        <EachPenTestTypeWidget key={item.name} item={item} />
                    ))}
                </div>
            </div>
        </>
    );
}
