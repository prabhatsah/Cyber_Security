import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getProfileData } from "@/ikon/utils/actions/auth";
import CustomControlTable from "./customControlTable";
import { ProcessedFrameworkData, FrameworkEntry as ClientFrameworkEntry, ParentEntry as ClientParentEntry, TreeNode } from "@/ikon/components/twolevel-dropdown";

export interface FrameworkEntry extends ClientFrameworkEntry {}
export interface ParentEntry extends ClientParentEntry {}
export interface FrameworkEntry {
  id: string;
  index: string;
  title: string;
  description: string;
  parentId: string | null;
  treatAsParent: boolean;
}
export interface FrameworkData {
    name: string;
    id: string;
    entries: Record<string, FrameworkEntry>;
    parentEntries: ParentEntry[];
    processed: ProcessedFrameworkData;
}

async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  return allUsers;
}

export async function createUserMap() {
  const allUsers = await getUserDetailMap();
  const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
    .map((user) => {
      if (user.userActive) {
        return { value: user.userId, label: user.userName };
      }
      return undefined;
    })
    .filter((user): user is { value: string; label: string } => user !== undefined);
  return userIdNameMap;
}

export async function getFrameworkData(): Promise<FrameworkData[]> {
  const status = "published";
  try {
    const frameworkInsData = await getMyInstancesV2({
      processName: "Framework Processes",
      predefinedFilters: { taskName: "Publish" },
      mongoWhereClause: `this.Data.status == "${status}"`,
      projections: ["Data.entries", "Data.parentEntries", "Data.id", "Data.name"],
    });
    // const frameworkData = Array.isArray(frameworkInsData) ? frameworkInsData.map((e: any) => e.data) : [];
    // return frameworkData;

    const rawFrameworkData = Array.isArray(frameworkInsData) ? frameworkInsData.map((e: any) => e.data) : [];
    const processedFrameworkData = rawFrameworkData.map(fw => ({
        ...fw,
        processed: processFramework(fw),
    }));

    return processedFrameworkData;
  } catch (error) {
    console.error("Failed to fetch framework data:", error);
    throw error;
  }
};

function processFramework(framework: Omit<FrameworkData, 'processed'>): ProcessedFrameworkData {
    const { entries, parentEntries } = framework;
    const allItemsMap = new Map<string, FrameworkEntry>(Object.entries(entries));
    const treeNodeMap = new Map<string, TreeNode & { children: TreeNode[] }>();
    const itemMapForClient: ProcessedFrameworkData['itemMap'] = {};

    const buildNode = (id: string, level: number): TreeNode & { children: TreeNode[] } => {
        if (treeNodeMap.has(id)) return treeNodeMap.get(id)!;
        
        const entry = allItemsMap.get(id)!;
        const parentInfo = parentEntries.find(p => p.id === id);
        const childrenIds = parentInfo ? parentInfo.childrenArray : [];

        itemMapForClient[id] = { parentId: entry.parentId, childrenIds };

        const children = childrenIds
            .map(childId => buildNode(childId, level + 1))
            .sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));
        
        const newNode = { ...entry, level, children };
        treeNodeMap.set(id, newNode);
        return newNode;
    };

    const rootNodes = parentEntries
        .filter(p => p.parentId === null)
        .map(p => buildNode(p.id, 0))
        .sort((a, b) => a.index.localeCompare(b.index, undefined, { numeric: true }));

    const flatTree: TreeNode[] = [];
    const flatten = (nodes: (TreeNode & { children: TreeNode[] })[]) => {
      for (const node of nodes) {
        const { children, ...rest } = node;
        flatTree.push(rest);
        flatten(node.children);
      }
    };
    flatten(rootNodes);

    return { flatTree, itemMap: itemMapForClient };
}

export async function getCustomControlData() {
  try {
    const customControlInsData = await getMyInstancesV2({
      processName: "Custom Controls",
      predefinedFilters: { taskName: "Edit Rules" },
    });
    const customControlData = Array.isArray(customControlInsData) ? customControlInsData.map((e: any) => e.data) : [];
    return customControlData;
  } catch (error) {
    console.error("Failed to fetch custom control data:", error);
    throw error;
  }
};

export async function fetchGlobalMetaDomainData() {
  try {
    const doaminInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Domain - Global Account",
      predefinedFilters: { taskName: "View Domain" },
      projections: ["Data.domain"]
    });
    return doaminInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Failed to fetch custom control data:", error);
    throw error;
  }
};

export default async function CustomControlPage() {
  const profileData = await getProfileData();
  const userIdNameMap: { value: string, label: string }[] = await createUserMap();
  const frameWorkData = await getFrameworkData();
  // console.log("Framework Data:", frameWorkData);
  const customControlData = await getCustomControlData();
  const domainData = await fetchGlobalMetaDomainData();

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Custom Controls</h1>
        <p className="text-muted-foreground mt-1">
          Central hub for creating controls that are link to actual framework entries
        </p>
      </div>
      <div className="h-[90%] overflow-y-auto">
        <CustomControlTable 
            userIdNameMap={userIdNameMap} 
            profileData={profileData} 
            customControlData={customControlData} 
            frameWorkData={frameWorkData} 
            domainData={domainData}
        />
      </div>
    </>
  )
}