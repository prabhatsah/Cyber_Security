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
