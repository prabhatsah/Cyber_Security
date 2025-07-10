import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getProfileData } from "@/ikon/utils/actions/auth";
import AuditQuestionnaireTable from "./auditQuestionnaireTable";

interface ControlObjective {
  objectiveDescription: string;
  objectiveIndex: string;
  objectiveName: string;
}

export interface PolicyControl {
  controlObjectives: ControlObjective[];
  controlName: string;
  policyIndex: string;
  type: string;
  controlDescription: string;
}

export interface FrameworkDraftData {
  controls: PolicyControl[];
  frameworkName: string;
  description: string;
  owners: string[];
  frameworkId: string;
  lastUpdatedOn: Date | undefined;
  effectiveDate: Date | undefined;
  version: string;
  currentAccountId: string;
  saveAsDraft: boolean;
}

async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  // console.log(allUsers);
  return allUsers;
}
export async function createUserMap() {
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

export async function CustomControlData() {
  try {
    const customControlInsData = await getMyInstancesV2({
      processName: "Custom Controls",
      predefinedFilters: { taskName: "Edit Rules" },
    });
    const customControlData = Array.isArray(customControlInsData) ? customControlInsData.map((e: any) => e.data) : [];
    return customControlData;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};

export async function AuditQuestionaireData(controlId: string) {
  try {
    const questionnaireInsData = await getMyInstancesV2({
      processName: "Audit Questionnaire",
      predefinedFilters: { taskName: "View Questionnaire" },
      mongoWhereClause: `this.Data.controlId == '${controlId}'`
    });
    const questionnaireData = Array.isArray(questionnaireInsData) ? questionnaireInsData.map((e: any) => e.data) : [];
    return questionnaireData;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};

export default async function CustomControlPage() {
  const profileData = await getProfileData();
  const userIdNameMap: { value: string, label: string }[] = await createUserMap();
  const customControlData = await CustomControlData();
//  const questionnaireData = await AuditQuestionaireData("controlId"); 
 // console.log("questionnaireData ------ ", questionnaireData);
  // console.log("dropDownControl", dropDownControl);

  return (
    <>
      <div className="mb-5">

        <h1 className="text-2xl font-semibold">Audit Questionnaire</h1>

        <p className="text-muted-foreground mt-1">

          Audit Questionnaire Description

        </p>

      </div>
      <div className="h-[90%] overflow-y-auto">
        <AuditQuestionnaireTable userIdNameMap={userIdNameMap} customControlData={customControlData} />
      </div>
    </>
  )
}