import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function uploadedResponseData() {
  const response = await getMyInstancesV2({
    processName: "Response Upload",
    predefinedFilters: { taskName: "View" },
  });
  const responseData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  return responseData;
}
