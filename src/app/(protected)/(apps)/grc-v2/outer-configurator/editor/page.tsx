// file: DocEditorTipTap.tsx (Server Component)
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import Tiptap from "./RteEditor"; // Client Component

async function getPolicyEditorData() {
  const policyInstances = await getMyInstancesV2({
    processName: "Policy Editor",
    predefinedFilters: { taskName: "edit policy editor" },
  });

  const policyDatas =
    policyInstances.length > 0
      ? policyInstances.map((policyInstance) => policyInstance.data)
      : [];

  return policyDatas.length > 0 ? policyDatas[0] : null;
}

export default async function DocEditorTipTap() {
  const singleJsonData = await getPolicyEditorData();

  return (
    <div>
      <Tiptap contentData={singleJsonData} />
    </div>
  );
}
