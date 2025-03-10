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
