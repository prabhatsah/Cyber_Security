import * as api from "@/utils/api";

export default async function fetchConfigurationData(
  tableName: string,
  provider: string
) {
  const configData = await api.fetchData(
    tableName,
    provider,
    "name",
    null,
    null
  );

  return configData;
}
