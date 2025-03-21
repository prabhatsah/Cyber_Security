import { fetchData } from "@/utils/api";

export async function fetchParticularConfigDetails(
  providerName: string,
  configId: string
) {
  return await fetchData(
    "cloud_config",
    "id",
    { column: "name", value: providerName },
    [{ column: "data", keyPath: ["configId"], value: configId }]
  );
}
