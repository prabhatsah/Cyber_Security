import { Rfp } from "./types";

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function TemplateData() {
  const response = await getMyInstancesV2({
    processName: "RFP Template",
    predefinedFilters: { taskName: "View" },
  });
  const templates = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  return templates;
}
