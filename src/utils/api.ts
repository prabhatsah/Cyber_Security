/*  -------------------example---------------------------------------------
const columnArr: Record<string, string>[] = [
      { column: "id", dataType: "Serial", constraints: "PRIMARY KEY" },
      { column: "name", dataType: "VARCHAR(100)", constraints: "NOT NULL" },
      {
        column: "email",
        dataType: "VARCHAR(255)",
        constraints: "UNIQUE NOT NULL",
      },
      { column: "password", dataType: "TEXT", constraints: "NOT NULL" },
      {
        column: "created_at",
        dataType: "TIMESTAMP",
        defaultValue: "CURRENT_TIMESTAMP",
      },
    ];

    const valuesArr: Record<string, any>[] = [
      { column: "id" },
      {
        column: "name",
        value: ["Zane Whitaker", "Elara Finch", "Kai Montgomery"],
      },
      {
        column: "email",
        value: [
          "zane.whitaker@example.com",
          "elara.finch@example.com",
          "kai.montgomery@example.com",
        ],
      },
      {
        column: "password",
        value: ["Xv9@pLz#3mQ", "!Tg7zY&2wKd", "Rq5*Bn$8vXt"],
      },
      { column: "created_at", value: ["DEFAULT", "DEFAULT", "DEFAULT"] },
    ]; 
 --------------------------------------------------------------------------*/
//create table

import { tableData } from "@/app/scans/WebApi/data";
import { Buffer } from "buffer";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService/index";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  `http://localhost:${process.env.PORT || 3000}`;

export async function createTable(
  tableName: string,
  columns: Record<string, string>[]
) {
  const columnDefinitions = columns
    .map(
      ({ column, dataType, constraints, defaultValue }) =>
        `${column} ${dataType} ${constraints ?? ""} ${
          defaultValue ? `DEFAULT ${defaultValue}` : ""
        }`
    )
    .join(", ");

  const query = `CREATE TABLE IF NOT EXISTS  ${tableName} (${columnDefinitions});`;
  console.log("query - " + query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

// describe table
export async function descTable(tableName: string) {
  const query = `SELECT json_agg(row_to_json(columns_info)) 
                            FROM (
                            SELECT column_name, data_type, is_nullable, column_default
                            FROM information_schema.columns 
                            WHERE table_name = '${tableName}'
                            ) AS columns_info;
                            `;
  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

// show tables
export async function showTables() {
  const query = `SELECT json_agg(row_to_json(tables_info)) 
                    FROM (
                    SELECT table_name
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ) AS tables_info;`;
  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

export async function addColumn(
  tableName: string,
  values: Record<string, any>[]
) {
  const userId = (await getLoggedInUserProfile()).USER_ID;
  console.log("this is the userId---> " + userId);

  let noOfCols = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i].column && values[i].value) noOfCols++;
  }
  console.log(noOfCols);

  const columnDefinitions = values
    .filter(({ value }) => value !== undefined && value !== null)
    .map(({ column }) => column)
    .join(", ");
  console.log(columnDefinitions);

  const valuesArr = values
    .filter(({ value }) => value !== undefined && value !== null)
    .map(({ value }) => (value.jsnob ? JSON.stringify(value.data) : value));

  console.log(valuesArr);

  const largestArray = valuesArr.reduce(
    (maxArr, currentArr) =>
      currentArr.length > maxArr.length ? currentArr : maxArr,
    []
  );

  let valuesString = "";

  for (let i = 0; i < largestArray.length; i++) {
    valuesString += "(";
    for (let j = 0; j < noOfCols; j++) {
      if (typeof valuesArr[j][i] == "string")
        valuesString +=
          valuesArr[j][i] != "DEFAULT"
            ? "'" + valuesArr[j][i] + "',"
            : valuesArr[j][i] + ",";
      else if (typeof valuesArr[j][i] == "object")
        valuesString +=
          valuesArr[j][i] != "DEFAULT"
            ? "'" + JSON.stringify(valuesArr[j][i]) + "',"
            : JSON.stringify(valuesArr[j][i]) + ",";
      else
        valuesString +=
          valuesArr[j][i] != "DEFAULT"
            ? valuesArr[j][i] + ","
            : valuesArr[j][i] + ",";
    }
    valuesString = valuesString.slice(0, -1);
    valuesString += "),";
  }

  valuesString = valuesString.slice(0, -1).replace(/'{}'/g, "'{}'::jsonb");
  const query = `INSERT INTO users (userid) VALUES ('${userId}') ON CONFLICT (userid) DO NOTHING; INSERT INTO ${tableName} (${columnDefinitions}) VALUES ${valuesString};`;
  console.log(query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, instruction: "update" }),
  });

  return res.json();
}

//delete table
export async function deleteTable(tableName: string) {
  const query = `DROP TABLE IF EXISTS ${tableName};`;
  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

//Read Table
export async function getTableValues(tableName: string) {
  const query = `SELECT json_agg(t) 
                    FROM ${tableName} t;`;

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

export async function createIndex(tableName: string, columnName: string) {
  const query = `CREATE UNIQUE INDEX idx_${tableName}_${columnName}_unique ON ${tableName}(${columnName});`;

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

export async function updateColumn(
  tableName: string,
  columnName: string,
  data: any,
  key: string,
  provider: string
) {
  const jsonString = JSON.stringify(data).replace(/'/g, "");
  console.log(jsonString);
  const query = `
    UPDATE "${tableName}"
    SET "${columnName}" = jsonb_set(
      COALESCE("${columnName}", '{}'::jsonb),
      '{${key}}',
      '${jsonString}'::jsonb,
      true
    )
    WHERE name = '${provider}';
  `;

  console.log(query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, instruction: "update" }),
  });

  return res.json();
}

//////////////////////////
export async function updateColumnGeneralised(
  tableName: string,
  columnName: string,
  data: any,
  key: string,
  associatedColumn: string,
  associatedValue: string
) {
  const jsonString = JSON.stringify(data).replace(/'/g, "");
  console.log(jsonString);
  const query = `
    UPDATE "${tableName}"
    SET "${columnName}" = jsonb_set(
      COALESCE("${columnName}", '{}'::jsonb),
      '{${key}}',
      '${jsonString}'::jsonb,
      true
    )
    WHERE ${associatedColumn} = '${associatedValue}';
  `;

  //console.log(query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, instruction: "update" }),
  });

  return res.json();
}

export async function updateDataObject(
  tableName: string,
  object: { key: string; value: any }[] | null,
  fixedKey: string,
  fixedKeyValue: string
) {
  if (!object || object.length === 0) return;

  let jsonbSetExpressions: string = "value";

  object.forEach((eachFilter) => {
    const valueType =
      typeof eachFilter.value === "string"
        ? `'${eachFilter.value}'::text`
        : typeof eachFilter.value === "number"
        ? `${eachFilter.value}::numeric`
        : `to_jsonb('${JSON.stringify(eachFilter.value)}'::jsonb)`;

    jsonbSetExpressions = `jsonb_set(
      ${jsonbSetExpressions}, 
      '{${eachFilter.key}}', 
      to_jsonb(${valueType}), 
      false
    )`;
  });

  let query = `
    UPDATE ${tableName} 
    SET data = (
        SELECT jsonb_object_agg(
            key, 
            CASE 
                WHEN value->>'${fixedKey}' = '${fixedKeyValue}'
                THEN ${jsonbSetExpressions}
                ELSE value 
            END
        )
        FROM jsonb_each(data)
    ) 
    WHERE data::text LIKE '%${fixedKeyValue}%';
  `;

  console.log("Generated Query -->", query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

export async function deleteObjectWithKey(
  key: string,
  tableName: string,
  provider: string
) {
  const query = `
  UPDATE "${tableName}"
    SET "data" = "data" - '${key}'
  WHERE name = '${provider}';`;

  console.log(query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

/*------example------------------------------------------------------------------------------------------------------------------------------------------------
api.fetchData(name,'google-cloud-platform',null,'fe2fd391-22eb-4c0a-af25-d37825794c83',gcp-project-98341);
api.fetchData(name,null,null,null,{'projectId' : ['gcp-project-98341', 'gcp-project-111111'], 'configId' : ["fe2fd391-22eb-4c0a-af25-d37825794c83"]});
-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
export async function fetchData(
  tableName: string,
  orderByColumn: string | null,
  columnFilter?: { column: string; value: string | number }[] | null,
  jsonFilter?:
    | {
        column: string;
        keyPath: string[];
        value: string | number;
      }[]
    | null
) {
  const query = { tableName, orderByColumn, columnFilter, jsonFilter };
  console.log("Sending query to backend:", query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, instruction: "fetch" }),
  });

  const text = await res.text();

  if (!text) {
    console.warn("Empty response from API");
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON response from API:", text);
    return null;
  }
}

export async function deleteConfigWithKey(
  tableName: string,
  key: string,
  value: string
) {
  let query: string = "";
  if (key && value) {
    query = `UPDATE ${tableName}
              SET data = data - key
              FROM (
                  SELECT key
                  FROM ${tableName}, jsonb_each(data)
                  WHERE value->>'${key}' = '${value}'
              ) subquery`;
  }

  console.log(query);
  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

///////////////////////////save data///////////////////////////////////////////
export async function saveScannedData(
  tableName: string,
  values: { key: string; value: any }
) {
  const userId = (await getLoggedInUserProfile()).USER_ID;
  console.log("this is the userId---> " + userId);
  const jsonString = JSON.stringify(values.value).replace(/'/g, "");

  const query = `
                WITH user_data AS (
              SELECT data
              FROM ${tableName}
              WHERE userid = '${userId}'
            ),
            merged AS (
              SELECT 
                (SELECT data FROM user_data) || jsonb_build_object('${values.key}', '${jsonString}'::jsonb) AS merged_data
            ),
            filtered AS (
              SELECT jsonb_object_agg(key, merged_data -> key) AS filtered_data
              FROM (
                SELECT key
                FROM (
                  SELECT key::bigint AS ts_key, key
                  FROM jsonb_object_keys((SELECT merged_data FROM merged)) AS key(key)
                ) sub
                ORDER BY ts_key DESC
                LIMIT 10
              ) AS latest_keys,
              LATERAL (
                SELECT merged_data FROM merged
              ) AS merged_data
            )
            UPDATE ${tableName}
            SET data = (SELECT filtered_data FROM filtered),
                lastscanon = CURRENT_TIMESTAMP
            WHERE userid = '${userId}'
            RETURNING *;
  `;

  console.log(query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, instruction: "update" }),
  });

  return res.json();
}

export async function fetchScannedData(
  tableName: string,
  orderByColumn: string | null,
  allInstances: boolean | false,
  columnFilter?: { column: string; value: string | number } | null,
  jsonFilter?:
    | {
        column: string;
        keyPath: string[];
        value: string | number;
      }[]
    | null
) {
  const userId = (await getLoggedInUserProfile()).USER_ID;
  columnFilter = allInstances ? null : { column: "userid", value: userId };
  const query = { tableName, orderByColumn, columnFilter, jsonFilter };
  console.log(query);

  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, instruction: "fetch" }),
  });

  return res.json();
}
