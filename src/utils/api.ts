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

  const res = await fetch("/api/dbApi", {
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
  const res = await fetch("/api/dbApi", {
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
  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

//update table with values
export async function addColumn(
  tableName: string,
  values: Record<string, any>[]
) {
  let noOfCols = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i].column && values[i].value) noOfCols++;
  }

  const columnDefinitions = values
    .filter(({ value }) => value !== undefined && value !== null)
    .map(({ column }) => column)
    .join(", ");

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
  const query = `INSERT INTO ${tableName} (${columnDefinitions}) VALUES ${valuesString};`;
  console.log(query);

  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

//delete table
export async function deleteTable(tableName: string) {
  const query = `DROP TABLE IF EXISTS ${tableName};`;
  const res = await fetch("/api/dbApi", {
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

  const custonQuery = `SELECT json_agg(json_build_object('id', id,'name', name,'email', email)) FROM ${tableName} WHERE name = 'Alice';`;

  const res = await fetch("/api/dbApi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}

export async function createIndex(tableName: string, columnName: string) {
  const query = `CREATE UNIQUE INDEX idx_${tableName}_${columnName}_unique ON ${tableName}(${columnName});`;

  const res = await fetch("/api/dbApi", {
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
  const jsonString = JSON.stringify(data).replace(/"/g, '\\"');
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

  const res = await fetch("/api/dbApi", {
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

  const res = await fetch("/api/dbApi", {
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
  provider: string | null,
  column: string | null,
  mainKey: string | null,
  keyValue: Record<string, any> | null
) {
  let query = "";

  if (!provider && !column && !mainKey && !keyValue) {
    query = `SELECT jsonb_agg(t) FROM (SELECT * FROM "${tableName}") t;`;
  } else if (column !== "data" && !mainKey && !keyValue) {
    query = `SELECT jsonb_pretty(jsonb_agg(t))
             FROM (SELECT * FROM "${tableName}" WHERE "${column}" = '${provider}') t;`;
  } else if (mainKey) {
    query = `SELECT jsonb_agg(data->'${mainKey}') 
             FROM "${tableName}" 
             WHERE data ? '${mainKey}';`;
  } else if (keyValue) {
    let conditions: string[] = [];

    for (let key in keyValue) {
      if (Array.isArray(keyValue[key])) {
        const valuesList = keyValue[key]
          .filter((value: any) => value !== null && value !== undefined)
          .map((value: any) => `'${value}'`)
          .join(", ");

        if (valuesList) {
          conditions.push(`value->>'${key}' IN (${valuesList})`);
        }
      }
    }

    if (conditions.length > 0) {
      const conditionString = conditions.join(" AND ");

      query = `
            SELECT jsonb_agg(value)
            FROM "${tableName}", 
            LATERAL jsonb_each(data) AS each_obj(key, value)
            WHERE ${conditionString};
        `;
    }
  }
  console.log(query);

  // Check if running in the server-side (node.js) or client-side (browser)
  const baseUrl = typeof window === "undefined" ? "http://localhost:3000" : "";

  // Use full URL
  const res = await fetch(`${baseUrl}/api/dbApi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  return res.json();
}
