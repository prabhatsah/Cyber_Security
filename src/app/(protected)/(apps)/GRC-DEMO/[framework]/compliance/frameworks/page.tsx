import ViewFramework from "./components/viewFramework";
import OpenFramework from "./components/openFramework";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { FrameworkData, FrameworkDraftData } from "./components/frameworkCreationForm";
import { getProfileData } from "@/ikon/utils/actions/auth";
import UploadComponent from "./components/uploadSection";
import EditFramework from "./components/FrameworkEditSection/editFramework";

export interface Framework {
  id: string;
  title: string;
  description: string;
  details: string;
  requirements: string[];
}

export async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  return allUsers;
}

export async function CreateUserMap() {
  const allUsers = await getUserDetailMap();
  const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
    .map((user) => {
      if (user.userActive) {
        return {
          value: user.userId,
          label: user.userName
        };
      }
      return undefined;
    })
    .filter((user): user is { value: string; label: string } => user !== undefined);

  return userIdNameMap;
}

export async function getFrameworkDraftData() {
  const profileData = await getProfileData();
  const currentUserAccountId = profileData.USER_ID;

  const draftSavedInstance = await getMyInstancesV2({
    processName: "Framework Draft Save",
    predefinedFilters: {taskName: "View Framework Draft"},
    mongoWhereClause: `this.Data.currentAccountId =="${currentUserAccountId}" && this.Data.saveAsDraft ==${true}`,
  })
  const draftInstanceData = draftSavedInstance.length>0? draftSavedInstance[0].data as FrameworkDraftData | null : null;

  return draftInstanceData;
}

async function fetchControlObjectivesData(): Promise<any[]> {
  try {
    const controlObjInstance = await getMyInstancesV2<any>({
      processName: "Control Objectives V2",
      predefinedFilters: { taskName: "view control objecitve" }
    });
    return controlObjInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Control Objectives V2", error);
    return [];
  }
}

async function fetchAllFrameworkDraftData(): Promise<any[]> {
  try {
    const controlObjInstance = await getMyInstancesV2<any>({
      processName: "Framework Draft Save",
      predefinedFilters: { taskName: "View Framework Draft" }
    });
    return controlObjInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Framework Draft Data", error);
    return [];
  }
}




export default async function ComplianceFrameworksPage() {
  
  const allUsers = await CreateUserMap();
  
  const frameworkDraftData = await getFrameworkDraftData();
  const FrameworkAndControlAndObjjData = await fetchControlObjectivesData();
  const allFrameworkDraftData = await fetchAllFrameworkDraftData();

  console.log("FrameworkAndControlAndObjjData ====>")
  console.log(FrameworkAndControlAndObjjData)
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2 text-foreground">Compliance Frameworks</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and view your organization's compliance frameworks
          </p>
        </div>
        <OpenFramework allUsers={allUsers} frameworkDraftData={frameworkDraftData}/>
        
      </div>

     <EditFramework frameworks={allFrameworkDraftData}  FrameworkAndControlAndObjjData={FrameworkAndControlAndObjjData} allUsers={allUsers}/>

       
    </div>
  );
}