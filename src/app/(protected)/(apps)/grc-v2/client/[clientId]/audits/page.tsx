import { Button } from "@/shadcn/ui/button";
import { Plus } from "lucide-react";
import Audits from "./auditDesign";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export async function subscribeFrameworkData(clientId?: string) {
  const subscribedFrameworkIds = await getMyInstancesV2({
    processName: "Subscribed Frameworks",
    predefinedFilters: { taskName: "View Subscription" },
    mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    projections: ["Data.frameworkId"],
  });

  const frameworkIdsObj = subscribedFrameworkIds.length > 0 ? 
    (subscribedFrameworkIds.map((subscribedFrameworkId) => subscribedFrameworkId.data) as { frameworkId: string }[]) : [];

  const frameworkIds = frameworkIdsObj.map((frameworkIdsObj) => frameworkIdsObj.frameworkId);
  return frameworkIds;
}

export async function auditQuestionnaireData(frameworkIds: string[]) {
  const QuestionnaireIns = await getMyInstancesV2({
    processName: "Audit Questionnaire",
    predefinedFilters: { taskName: "View Questionnaire" },
    // mongoWhereClause: 
  });

  const questionnaireData = Array.isArray(QuestionnaireIns) ? QuestionnaireIns.map((e: any) => e.data) : [];
  return questionnaireData;
}

export default async function AuditPage({ params }: { params: { clientId: string } }) {
  const { clientId } = params;
  const subscribedFrameworkIds = await subscribeFrameworkData(clientId);
  const auditQuestionnaire = await auditQuestionnaireData(subscribedFrameworkIds);
  console.log("Audit Questionnaire Data:", auditQuestionnaire);

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight ">Audit Management</h1>
            <p className="">Track and manage compliance audits across all frameworks</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />Schedule Audit
          </Button>
        </div>
        <Audits/>
      </div>
    </>
  );
}