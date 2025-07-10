import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import PentestWidget from "./components/PentestWidget";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchData } from "@/utils/api";
import AddPentestBtnWithFormModal from "./components/AddPentestBtnWithFormModal";
import NoSavedPentestTemplate from "./components/NoSavedPentestTemplate";
import { PenTestDefault, PenTestWithoutScanDefault, PenTestWithoutScanModified } from "./components/type";


async function fetchLoggedInUserPentestData() {
    const userId = (await getLoggedInUserProfile()).USER_ID;

    console.log("user id ---------")
    console.log(userId);


    const fetchedData = await fetchData('penetration_testing_history', 'id', null, null, "pentestid, data->'basicDetails' as basicdetails, userid, lastscanon");

    return fetchedData;
}


async function fetchLoggedInUserPentestDataOld() {
    const userId = (await getLoggedInUserProfile()).USER_ID;

    console.log("user id ---------")
    console.log(userId);


    const fetchedData = await fetchData('penetration_testing_history', 'id', null, null);

    return fetchedData;
}

export default async function WebAppPenetrationTesting() {

    const loggedInUserPentestData: PenTestWithoutScanDefault[] = await fetchLoggedInUserPentestData() ? (await fetchLoggedInUserPentestData()).data : [];
    const loggedInUserPentestDataFormatted: PenTestWithoutScanModified[] = loggedInUserPentestData.map((eachPenTestData: PenTestWithoutScanDefault) => {
        return {
            userId: eachPenTestData.userid,
            pentestId: eachPenTestData.pentestid,
            pentestType: eachPenTestData.type,
            basicDetails: { ...eachPenTestData.basicdetails },
            lastUpdated: eachPenTestData.lastscanon,
        }
    });
    console.log("Pentest Data With New Func: ", loggedInUserPentestDataFormatted);

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