import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getMyInstancesV2, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import ResponsibilityMatrixTable from "./responsibility-matrix-table";
import { getProfileData } from "@/ikon/utils/actions/auth";
import EligibleMatrixFramework from "./eligible-matrix-framework";


type TaskEntry = {
    index: string;
    title: string;
    description: string;
    parentId: string | null;
    treatAsParent: boolean;
    id: string;
};

type ParentEntry = TaskEntry & {
    childrenArray: string[];
};

type Pricing = {
    type: 'free' | 'paid' | string;
};

export type Framework = {
    id: string;
    name: string;
    title: string;
    description: string;
    version: string;
    owners: string[];
    pricing: Pricing;
    entries: Record<string, TaskEntry>;
    parentEntries: ParentEntry[];
    category: string;
    score: number;
    status: 'draft' | 'published' | 'archived' | string;
    isFavorite: boolean;
    activityLog: { createBy: string, createdAt: string, message: string }[];
};

export async function getFrameworkDetails(clientId: string) {
    const frameworkProcessInstances = await getMyInstancesV2({
        processName: "Responsibility Matrix Process",
        predefinedFilters: { taskName: "View Matrix" },
        mongoWhereClause: `this.Data.clientId == "${clientId}"`
    });
    const frameworkProcessDatas = frameworkProcessInstances.length > 0
        ? frameworkProcessInstances.map((frameworkProcessInstance) => frameworkProcessInstance.data) as Framework[]
        : [];
    return frameworkProcessDatas;
}

export default async function ResponsibilityMatrixPage({ params }: { params: { clientId: string }; }) {

    const { clientId } = params;

    // const getSubscribedFrameworkForClient = await getMyInstancesV2({
    //     processName: "Subscribed Frameworks",
    //     predefinedFilters: { taskName: "View Subscription" },
    //     mongoWhereClause: `this.Data.clientId == '${clientId}'`,
    //     projections: ['Data.frameworkId']
    // })

    // const frameworkIdForCurrentClient = getSubscribedFrameworkForClient.length > 0
    //     ? getSubscribedFrameworkForClient.map((subscribeFrameworkInstance) => subscribeFrameworkInstance.data) as { frameworkId: string }[]
    //     : [];

    // console.log(frameworkIdForCurrentClient);

    // const frameworkValues = await Promise.all(
    //     frameworkIdForCurrentClient.map(async (framework: { frameworkId: string }) => {
    //         const frameworkData = await getMyInstancesV2({
    //             processName: "Framework Processes",
    //             predefinedFilters: { taskName: "View Framework" },
    //             mongoWhereClause: `this.Data.id == "${framework.frameworkId}" `
    //         });

    //         const data = frameworkData?.[0]?.data;
    //         if (data) {
    //             return {
    //                 ...data,
    //                 clientId: clientId,
    //             };
    //         }

    //         return null;
    //     })
    // );

    // console.log(frameworkValues)

    // const responsibilityMatrixProcessId = await mapProcessName({processName: "Responsibility Matrix Process"});

    // await startProcessV2({
    //     processId: responsibilityMatrixProcessId,
    //     data: frameworkValues,
    //     processIdentifierFields: ""
    // })

    const frameworkProcessDatas = await getFrameworkDetails(clientId);
    const frameworks = [...frameworkProcessDatas] as Framework[];

    // Extract the framework with the specific id
    // const framework = frameworks.find(f => f.id === "4a077bbb-641e-46ec-8e4f-c1edb03d5c00");

    // Prepare entries and parentsDropdownEntry
    // const entries = framework ? Object.values(framework.entries) : [];
    // const parentsDropdownEntry = framework ? framework.parentEntries : [];

    // console.log("framework", framework);
    const profileData = await getProfileData();

    return (
        // <ResponsibilityMatrixTable
        //     entries={entries}
        //     parentsDropdownEntry={parentsDropdownEntry}
        //     viewselectedFramework={framework}
        //     profileData={profileData}
        // />

        <EligibleMatrixFramework allUsers={[]} frameworks={frameworks} />
    );
}