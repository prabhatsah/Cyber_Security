import * as api from "@/utils/api";

export function createTable() {
  const name = "cloud_config";

  const columnArr: Record<string, string>[] = [
    {
      column: "id",
      dataType: "UUID",
      constraints: "PRIMARY KEY",
      defaultValue: "gen_random_uuid()",
    },
    { column: "name", dataType: "VARCHAR(100)", constraints: "NOT NULL" },

    { column: "data", dataType: "jsonb[]" },
  ];

  return api.createTable(name, columnArr);
}

export function describeTable(name: string) {
  return api.descTable(name);
}

export function addCloudEntry(name: string) {
  const valuesArr: Record<string, any>[] = [
    { column: "id" },
    {
      column: "name",
      value: ["gcp", "aws", "azure", "ibmCloud", "oracleCloud", "alibabaCloud"],
    },
    {
      column: "data",
      value: [[], [], [], [], [], []],
    },
  ];

  api.addColumn(name, valuesArr);
}
