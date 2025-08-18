import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import NetworkPentestWidget from "./components/NetworkPentestWidget";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { fetchData } from "@/utils/api";
import NoSavedPentestTemplate from "./components/NoSavedPentestTemplate";
import { NetworkPenTestWithoutScanModified } from "./components/type";
// import AddPentestBtnWithFormModal from "./components/AddPentestBtnWithFormModal";


async function fetchLoggedInUserPentestData() {
    const userId = (await getLoggedInUserProfile()).USER_ID;

    console.log("user id ---------")
    console.log(userId);


    const fetchedData = await fetchData('pentest_data', 'last_scan_on', [{table: "user_membership" ,  column: 'type', value: 'network' }], null,
        "pentest_data.pentestid, pentest_data.data->'basicDetails' as basicdetails, pentest_data.last_scan_on");

    return fetchedData;
}

const loggedInUserPentestData: NetworkPenTestWithoutScanModified[] = [
    {
        pentestId: "KER-NET-2507001",
        pentestType: "network",
        networkDetails: {
            pentestId: "KER-NET-2507001",
            clientName: "Carta Worldwide",
            pentestName: "Canadian Internal Network Pentest - Q1 2025",
            scopeType: "CIDR Network Range",
            aggressiveness: "Stealthy",
            progress: 10,
            startDate: "2025-07-25 10:12",
            createdOn: "2025-07-25 10:12",
            createdBy: {
                userId: 'be7a0ece-f3d8-4c5b-84dc-52c32c4adff4',
                userName: "Sayan Roy"
            }
        },
        lastUpdated: "2025-07-25 10:12",
        userId: 'be7a0ece-f3d8-4c5b-84dc-52c32c4adff4',
    },
    {
        pentestId: "KER-NET-2507002",
        pentestType: "network",
        networkDetails: {
            pentestId: "KER-NET-2507002",
            clientName: "TechCorp Solutions",
            pentestName: "External Network Assessment - Q2 2025",
            scopeType: "CIDR Network Range",
            aggressiveness: "Normal",
            progress: 10,
            startDate: "2025-07-25 11:12",
            createdOn: "2025-07-25 11:12",
            createdBy: {
                userId: 'be7a0ece-f3d8-4c5b-84dc-52c32c4adff4',
                userName: "Sayan Roy"
            }
        },
        lastUpdated: "2025-07-25 11:12",
        userId: 'be7a0ece-f3d8-4c5b-84dc-52c32c4adff4',
    }
]

export default async function NetworkPenetrationTesting() {

    // const loggedInUserPentestData: NetworkPenTestWithoutScanDefault[] = await fetchLoggedInUserPentestData() ? (await fetchLoggedInUserPentestData()).data : [];
    // const loggedInUserPentestDataFormatted: NetworkPenTestWithoutScanModified[] = loggedInUserPentestData.map((eachPenTestData: NetworkPenTestWithoutScanDefault) => {
    //     return {
    //         userId: eachPenTestData.userid,
    //         pentestId: eachPenTestData.pentestid,
    //         pentestType: eachPenTestData.type,
    //         basicDetails: { ...eachPenTestData.basicdetails },
    //         lastUpdated: eachPenTestData.lastscanon,
    //     }
    // });
    // console.log("Pentest Data With New Func: ", loggedInUserPentestDataFormatted);

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
                    {/* <AddPentestBtnWithFormModal /> */}
                </div>
                {loggedInUserPentestData.length === 0 ? <NoSavedPentestTemplate /> : <NetworkPentestWidget allPentestWidgetData={loggedInUserPentestData} />}
            </div>
        </>
    );
}