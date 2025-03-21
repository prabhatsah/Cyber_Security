import { fetchData } from "@/utils/api";

export async function fetchConfigDetails(
  providerName?: string,
  configId?: string
) {
  const providerFilter = providerName
    ? { column: "name", value: providerName }
    : null;

  const dataFilter = configId
    ? [{ column: "data", keyPath: ["configId"], value: configId }]
    : null;

  return await fetchData("cloud_config", "id", providerFilter, dataFilter);
}
