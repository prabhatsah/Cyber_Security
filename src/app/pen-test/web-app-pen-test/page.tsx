import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import PentestWidget from "./components/PentestWidget";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchData } from "@/utils/api";

async function fetchLoggedInUserPentestData() {
    const userId = (await getLoggedInUserProfile()).USER_ID;


    const fetchedData = await fetchData("configured_pentest", "id", [{ column: "userid", value: userId }], null);
    return fetchedData.data;
}

export default async function WebAppPenetrationTesting() {

    const loggedInUserPentestData = await fetchLoggedInUserPentestData();
    console.log("Logged In User Pentest Data: ", loggedInUserPentestData);

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
            <PentestWidget />
        </>
    );
}