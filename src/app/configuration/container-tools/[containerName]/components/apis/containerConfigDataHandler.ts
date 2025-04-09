import { TrivyConfiguration } from "@/app/configuration/components/type";
import * as api from "@/utils/api";

const name = "container_config";

export function createTable() {
  const columnArr: Record<string, string>[] = [
    {
      column: "id",
      dataType: "UUID",
      constraints: "PRIMARY KEY",
      defaultValue: "gen_random_uuid()",
    },
    { column: "name", dataType: "VARCHAR(100)", constraints: "NOT NULL" },

    { column: "data", dataType: "jsonb" },
  ];

  return api.createTable(name, columnArr);
}

export function describeTable(name: string) {
  return api.descTable(name);
}

export function addCloudEntry() {
  const valuesArr: Record<string, any>[] = [
    { column: "id" },
    {
      column: "name",
      value: ["trivy"],
    },
    {
      column: "data",
      value: [{}],
    },
  ];

  api.addColumn(name, valuesArr);
}

export function addNewConfiguration(
  newConfigData: TrivyConfiguration,
  containerName: string
) {
  console.log("New Config Data: ", newConfigData);
  api.updateColumn(
    name,
    "data",
    newConfigData,
    newConfigData.configId,
    containerName
  );
}
