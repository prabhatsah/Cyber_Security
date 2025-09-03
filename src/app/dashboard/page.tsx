import { Card } from '@/components/ui/card';
import RecentScansCard from './components/RecentScansCard';
import ScanOverviewCard from './components/ScanOverviewCard';

import { getLoggedInUserProfile } from '@/ikon/utils/api/loginService';
import { fetchData } from '@/utils/api';
import { PenTestWithoutScanDefault, PenTestWithoutScanModified } from '../pen-test/web-app-pen-test/components/type';
import SecurityAlertCard from './components/SecurityAlertCard';
import { secureGaurdService } from '@/utils/secureGaurdService';


async function fetchLoggedInUserPentestData() {
  const userId = (await getLoggedInUserProfile()).USER_ID;

  console.log("user id ---------")
  console.log(userId);
  const currentRole = (await secureGaurdService.userDetails.getUserRolesForthisSoftware())[0].ROLE_NAME;
  const currentAccountId = await secureGaurdService.userDetails.getAccountId()
  console.log("user current role-->", currentRole)
  let fetchedData = []
  if (currentRole == "Pentest Admin")
    fetchedData = await fetchData("pentest_data", "last_scan_on", [{ table: "user_membership", column: "generatedby", value: currentAccountId }], null, "pentest_data.pentestid , pentest_data.data->'basicDetails' as basicdetails,pentest_data.last_scan_on");
  else
    fetchedData = await fetchData("pentest_data", "last_scan_on", [{ table: "user_membership", column: "generatedby", value: currentAccountId }, { table: "user_membership", column: "userid", value: userId }], null, "pentest_data.pentestid , pentest_data.data->'basicDetails' as basicdetails,pentest_data.last_scan_on");
  return fetchedData;
}

export default async function Dashboard() {
  const loggedInUserPentestData: PenTestWithoutScanDefault[] = await fetchLoggedInUserPentestData() ? (await fetchLoggedInUserPentestData()).data : [];
  const loggedInUserPentestDataFormatted: PenTestWithoutScanModified[] = loggedInUserPentestData.map((eachPenTestData: PenTestWithoutScanDefault) => {
    return {
      userId: eachPenTestData.userid,
      groupId: eachPenTestData.groupid,
      pentestId: eachPenTestData.pentestid,
      pentestType: eachPenTestData.type,
      basicDetails: { ...eachPenTestData.basicdetails },
      lastUpdated: eachPenTestData.lastscanon,
    }
  });

  console.log("Pentest Data With New Func: ", loggedInUserPentestData);
  const paramsData = {
    id: loggedInUserPentestDataFormatted[0]?.userId,  // Assuming you want to use the first user's ID         
    floorId: loggedInUserPentestDataFormatted[0]?.pentestId,
    equipmentId: "Sidhu"// Assuming you want to use the first pentest ID
  };
  return (
    <div className="space-y-6 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your security status and view recent scan results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-6 h-full">
        {/* <div className="md:col-span-2">
          <ScanOverviewCard />
        </div> */}

        {/* Pass the fetched data as a prop */}
        <div className="md:col-span-1">
          {loggedInUserPentestDataFormatted && (
            <SecurityAlertCard pentestData={loggedInUserPentestDataFormatted} />
          )}
        </div>
        <div className="md:col-span-1">
          <RecentScansCard />
        </div>



      </div>
    </div>
  );
}
