import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import { CloudCog, FolderCog, GlobeLock, Network, TabletSmartphone } from "lucide-react";
import EachPenTestTypeWidget from "./components/EachPenTestTypeWidget";
import { fetchData } from "@/utils/api";
import { secureGaurdService } from "@/utils/secureGaurdService";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";

export async function getPententCount(pentestType: string) {
    const currentRole = (await secureGaurdService.userDetails.getUserRolesForthisSoftware())[0].ROLE_NAME;
    const currentAccountId = await secureGaurdService.userDetails.getAccountId()
    let pentestData = [];
    const userId = (await getLoggedInUserProfile()).USER_ID;
    if (currentRole == "Pentest Admin")
        pentestData = await fetchData("pentest_data", "last_scan_on", [{ table: "user_membership", column: "generatedby", value: currentAccountId }, { table: "pentest_data", column: "type", value: pentestType }], null, "pentest_data.pentestid");
    else
        pentestData = await fetchData("pentest_data", "last_scan_on", [{ table: "user_membership", column: "generatedby", value: currentAccountId }, { table: "user_membership", column: "userid", value: userId }], null, "pentest_data.pentestid");

    const pentestCount = pentestData.data.length
    return pentestCount;
}


export default async function EndPointToolsConfig() {

    const penTestTypeList = [
        {
            name: "Web Application Penetration Testing",
            description:
                "Web app penetration testing identifies and exploits security vulnerabilities in web applications to assess and improve their security posture.",
            configurationCount: await getPententCount('web_app'),
            icon: <GlobeLock className="size-5" aria-hidden={true} />,
            href: "/pen-test/web-app-pen-test",
        },
        {
            name: "Cloud Security Penetration Testing",
            description:
                "Cloud security pentesting identifies and exploits vulnerabilities in cloud environments to improve security.",
            configurationCount: await getPententCount('cloud_security'),
            icon: <CloudCog className="size-5" aria-hidden={true} />,
            href: "/pen-test/cloud-security-pen-test",
        },
        {
            name: "API Penetration Testing",
            description:
                "API pentesting finds and exploits vulnerabilities in APIs to ensure secure data exchange and functionality.",
            configurationCount: await getPententCount('api'),
            icon: <FolderCog className="size-5" aria-hidden={true} />,
            href: "/pen-test/api-pen-test",
        },
        {
            name: "Network Penetration Testing",
            description:
                "Network pentesting identifies and exploits security weaknesses in network infrastructure to prevent unauthorized access.",
            // configurationCount: await getPententCount('network'),
            configurationCount: 2,
            icon: <Network className="size-5" aria-hidden={true} />,
            href: "/pen-test/network-pen-test",
        },
        {
            name: "Mobile Application Penetration Testing",
            description:
                "Mobile app pentesting identifies security flaws in mobile applications to protect user data and prevent attacks.",
            configurationCount: await getPententCount('mobile'),
            icon: <TabletSmartphone className="size-5" aria-hidden={true} />,
            href: "/pen-test/mobile-app-pen-test",
        },
    ];

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 0,
                    title: "Penetration Testing",
                    href: "/pen-test",
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
