import { fetchControlObjectiveData, fetchFrameworkMappingData } from "../knowledge-new/component/UploadComponent/(backend-calls)";
import KnowledgeBaseTable from "./knowledgeBaseTable";
import KBContextProvider from "./components/knowledgeBaseContext";
import { CreateUserMap } from "../components/createUserMap";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getAllSoftwareGroups, getAllUsersForGroupMembershipV2 } from "@/ikon/utils/api/groupService";
import { getUserDashboardPlatformUtilData, getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getCurrentUserId } from "@/ikon/utils/actions/auth";
// import React, { createContext, useContext, useEffect, useState } from "react";
// const RefreshContext = createContext({
//   refresh: () => {},
// });

// export const useRefresh = () => useContext(RefreshContext);
// export default function KnowledgeBaseNew() {
//   const [dataOfControl, setDataOfControl] = useState([]);
//   const [userIdNameMap, setuserIdNameMap] = useState<
//     { value: string; label: string }[]
//   >([]);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const refresh = () => {
//     setRefreshKey((prev) => prev + 1); // Increment key to trigger re-fetch
//   };

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [objData, users] = await Promise.all([
//           fetchControlObjectiveData(),
//           CreateUserMap(),
//         ]);
//         setDataOfControl(objData);
//         setuserIdNameMap(users);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       }
//     }
//     fetchData();
//   }, [refreshKey]);

// import { useEffect, useState } from "react";

async function getUserForGrpName(groupName: string) {
  const userDetailsMap = await getUserDashboardPlatformUtilData({
    isGroupNameWiseUserDetailsMap: true,
    groupNames: [groupName]
  });
  console.log(userDetailsMap);
  return userDetailsMap[groupName].users
}

export default async function KnowledgeBaseNew() {
  // const [data, setData] = useState([]);
  // const [userIdNameMap,setuserIdNameMap] = useState<{ value: string; label: string }[]>(
  //   []
  // );;
  //  useEffect(() => {
  //       async function fetchData() {
  //         try {
  //           const [data, users] = await Promise.all([
  //             fetchControlObjectiveData(),
  //             CreateUserMap(),
  //           ]);
  //           setData(data);
  //           setuserIdNameMap(users)
  //         } catch (error) {
  //           console.error("Failed to fetch data:", error);
  //         }
  //       }
  //       fetchData();
  //     }, []);
  const dataOfControl = await fetchControlObjectiveData();
  const userIdNameMap = await CreateUserMap();
  const frameworkMappingData = await fetchFrameworkMappingData();
  const currUserId = await getCurrentUserId();
  const centralAdmingGrpMember = await getUserForGrpName('Central Admin Group');
  const isCentralAdminUser = currUserId in centralAdmingGrpMember;

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* <RefreshContext.Provider value={{ refresh }}> */}
        <KBContextProvider>
          <KnowledgeBaseTable
            tableData={dataOfControl}
            userIdNameMap={userIdNameMap}
            frameworkMappingData={frameworkMappingData}
            isCentralAdminUser={isCentralAdminUser}
          />
        </KBContextProvider>
        {/* </RefreshContext.Provider> */}
      </div>
    </>
  );
}
