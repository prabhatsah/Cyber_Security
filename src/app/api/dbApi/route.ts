import { NextResponse } from "next/server";
import { NodeSSH } from "node-ssh";
import * as fs from "fs";
import path from "path";
import { off } from "process";

const ssh = new NodeSSH();
const localFilePath = path.join(__dirname, "query.sql");
const localJsonPath = path.join(__dirname, "resultJson.json");
console.log("this is the directory path ---->" + localFilePath);

const remoteFilePath = "/tmp/query.sql";

function extractJson(input: string): any {
  const match = input.match(/\[([\s\S]*)\]/);

  if (!match) {
    throw new Error("No JSON found in the input string.");
  }
  const jsonString = match[0].replace(/\+\n/g, "").trim();
  return JSON.parse(jsonString);
}

export async function POST(req: Request) {
  try {
    let { query, instruction } = await req.json();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query parameter is required" },
        { status: 400 }
      );
    }

    await ssh.connect({
      host: "77.68.48.96",
      username: "root",
      password: "QR66&4Zq2#",
    });

    let jsonData: any;
    let result: any;

    if (instruction && instruction === "update") {
      fs.writeFileSync(localFilePath, query, { encoding: "utf8" });
      console.log(
        "SQL Query Written to File:",
        fs.readFileSync(localFilePath, "utf8")
      );
      await ssh.putFile(localFilePath, remoteFilePath);
      result = await ssh.execCommand(
        `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -f "${remoteFilePath}"`
      );
      await ssh.execCommand(`rm -f ${remoteFilePath}`);
    } else if (instruction && instruction === "fetch") {
      const fetchedResult = await fetchPaginatedData(
        query.tableName,
        query.orderByColumn,
        null,
        null,
        query.columnFilter,
        query.jsonFilter
      );
      // console.log("this is the fetched result");
      // console.log(fetchedResult);
      return NextResponse.json({
        success: true,
        fullData: result,
        data: fetchedResult ? JSON.parse(fetchedResult) : null,
      });
    } else {
      result = await ssh.execCommand(
        `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -c "${query}"`
      );
    }
    // console.log("Query Result:", result);
    ssh.dispose();

    if (result.stdout.includes("json") && instruction != "update")
      jsonData = extractJson(result.stdout);

    return NextResponse.json({
      success: true,
      fullData: result,
      data: jsonData ? jsonData : result,
    });
  } catch (error: any) {
    console.error("SSH Connection Failed:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function fetchPaginatedData(
  tableName: string,
  orderByColumn: string,
  offset: number | null,
  limit: number | null,
  columnFilter?: { column: string; value: string | number } | null,
  jsonFilters?:
    | { column: string; keyPath: string[]; value: string | number }[]
    | null
) {
  let hasMore = true;
  let jsonParts: string[] = [];

  offset = offset ?? 0;
  limit = limit ?? 1000;

  while (hasMore) {
    let whereClauses: string[] = [];
    let selectClause = "*";
    let fromClause = tableName;

    // Filter by direct column
    if (columnFilter) {
      whereClauses.push(`"${columnFilter.column}" = '${columnFilter.value}'`);
    }

    if (jsonFilters && jsonFilters.length > 0) {
      jsonFilters.forEach((jsonFilter) => {
        const path = jsonFilter.keyPath.map((k) => `'${k}'`).join(",");
        whereClauses.push(
          `"${jsonFilter.column}" #>> ARRAY[${path}] = '${jsonFilter.value}'`
        );
      });
    }

    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      SELECT COALESCE(jsonb_agg(t), '[]') FROM (
        SELECT ${selectClause}
        FROM ${fromClause}
        ${whereClause}
        ORDER BY "${orderByColumn}"
        LIMIT ${limit} OFFSET ${offset}
      ) t;
    `;

    console.log("Query: ", query);

    const result = await ssh.execCommand(
      `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -A -t -c "${query}"`
    );

    try {
      const extractedJson = result.stdout.trim().match(/\[.*\]/s)?.[0] || "[]";
      const innerJson = extractedJson.slice(1, -1).trim();

      if (innerJson) {
        jsonParts.push(innerJson);
        offset += limit;
      } else {
        hasMore = false;
      }
    } catch (error: any) {
      console.error("Error processing JSON string:", error.message);
      hasMore = false;
    }
  }

  return `[${jsonParts.join(",")}]`;
}
