import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import PentestWidget from "./components/PentestWidget";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchData } from "@/utils/api";
import AddPentestBtnWithFormModal from "./components/AddPentestBtnWithFormModal";
import NoSavedPentestTemplate from "./components/NoSavedPentestTemplate";
import { PenTestDefault, PenTestModified } from "./components/type";
import ScanStatus from "./[pentestIdName]/reconnaissance/components/ScanStatus";

async function fetchLoggedInUserPentestData() {
    const userId = (await getLoggedInUserProfile()).USER_ID;

    console.log("user id ---------")
    console.log(userId);


    const fetchedData = await fetchData("penetration_testing_history", "id");

    return fetchedData;
}

export default async function WebAppPenetrationTesting() {

    // const scan_details = await fetchData("scandetails", "scan_id", [{ column: "user_id", value: "38384a69-e2aa-42ad-bc67-47502d563148" }]);

    // console.log("scan detalis ----------------");
    // console.log(scan_details);

    const loggedInUserPentestData: PenTestDefault[] = await fetchLoggedInUserPentestData() ? (await fetchLoggedInUserPentestData()).data : [];
    const loggedInUserPentestDataFormatted: PenTestModified[] = loggedInUserPentestData.map((eachPenTestData: PenTestDefault) => {
        return {
            userId: eachPenTestData.userid,
            pentestId: eachPenTestData.pentestid,
            pentestType: eachPenTestData.type,
            basicDetails: { ...eachPenTestData.data.basicDetails },
            scanData: eachPenTestData.data.scandata ? { ...eachPenTestData.data.scandata } : {},
            lastUpdated: eachPenTestData.lastscanon,
        }
    });
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

            <div>
                <div className='flex items-center justify-between mb-4'>
                    <div className="flex items-center space-x-2">
                        <h3 className="text-widgetHeader text-primary">
                            {loggedInUserPentestData.length > 1 ? `Configured Penetration Tests` : `Configured Penetration Test`}
                        </h3>
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
                            {loggedInUserPentestData.length}
                        </span>
                    </div>
                    <AddPentestBtnWithFormModal />
                </div>
                {loggedInUserPentestData.length === 0 ? <NoSavedPentestTemplate /> : <PentestWidget allPentestWidgetData={loggedInUserPentestDataFormatted} />}
            </div>

            {/* <ScanStatus /> */}
        </>
    );
}