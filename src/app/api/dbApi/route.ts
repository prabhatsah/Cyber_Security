import { NextResponse } from "next/server";
import { NodeSSH } from "node-ssh";
import * as fs from "fs";
import path from "path";
import * as os from "os";
import { randomUUID } from "crypto";

const tableLocks = new Map<string, Promise<void>>();

function extractJson(input: string): any {
  const match = input.match(/\[([\s\S]*)\]/);
  if (!match) throw new Error("No JSON found in the input string.");
  const jsonString = match[0].replace(/\+\n/g, "").trim();
  return JSON.parse(jsonString);
}

async function withTableLock<T>(
  tableName: string,
  fn: () => Promise<T>
): Promise<T> {
  const previous = tableLocks.get(tableName) || Promise.resolve();

  let release: () => void;
  const current = new Promise<void>((res) => (release = res));

  tableLocks.set(
    tableName,
    previous.then(() => current)
  );

  try {
    await previous;
    return await fn();
  } finally {
    release!();
    if (tableLocks.get(tableName) === current) {
      tableLocks.delete(tableName);
    }
  }
}

export async function POST(req: Request) {
  const ssh = new NodeSSH();
  const { query, instruction } = await req.json();
  if (!query) {
    return NextResponse.json(
      { success: false, error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const uniqueId = randomUUID();
  const localFilePath = path.join(os.tmpdir(), `query-${uniqueId}.sql`);
  const remoteFilePath = `/tmp/query-${uniqueId}.sql`;

  let result: any;
  let jsonData: any;

  await ssh.connect({
    host: "77.68.48.96",
    username: "root",
    password: "QR66&4Zq2#",
  });

  if (instruction === "update") {
    await withTableLock(query.tableName, async () => {
      fs.writeFileSync(localFilePath, query, "utf8");
      await ssh.putFile(localFilePath, remoteFilePath);
      result = await ssh.execCommand(
        `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -f "${remoteFilePath}"`
      );
    });
  } else if (instruction === "fetch") {
    const fetchedResult = await withTableLock(query.tableName, async () => {
      return await fetchPaginatedData(
        ssh,
        query.tableName,
        query.orderByColumn,
        null,
        null,
        query.columnFilter,
        query.jsonFilter
      );
    });

    await ssh.dispose();
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

  if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
  await ssh.execCommand(`rm -f ${remoteFilePath}`);
  await ssh.dispose();

  if (result.stdout.includes("json") && instruction !== "update") {
    jsonData = extractJson(result.stdout);
  }

  return NextResponse.json({
    success: true,
    fullData: result,
    data: jsonData || result,
  });
}

async function fetchPaginatedData(
  ssh: NodeSSH,
  tableName: string,
  orderByColumn: string,
  offset: number | null,
  limit: number | null,
  columnFilters?: { column: string; value: string | number }[] | null,
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

    if (columnFilters) {
      columnFilters.forEach((columnFilter) => {
        whereClauses.push(`"${columnFilter.column}" = '${columnFilter.value}'`);
      });
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
