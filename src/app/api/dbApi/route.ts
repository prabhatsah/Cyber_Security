import { NextResponse } from "next/server";
import { NodeSSH } from "node-ssh";
import * as fs from "fs";
import path from "path";
import * as os from "os";
import { randomUUID } from "crypto";
//import { IncomingForm } from "formidable";

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
    host: "77.68.30.54",
    username: "root",
    password: "G18_*Y#7st",
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
    console.log("this is query inside fetch--> ");
    console.log(query);
    const fetchedResult = await withTableLock(query.tableName, async () => {
      return await fetchPaginatedData(
        ssh,
        query.tableName,
        query.orderByColumn,
        query.offset,
        query.limit,
        query.allColumnFilter,
        query.jsonFilter,
        query.selectCondition
      );
    });

    await ssh.dispose();
    return NextResponse.json({
      success: true,
      fullData: result,
      data: fetchedResult ? JSON.parse(fetchedResult) : null,
    });
  } else if (instruction === "imageUpload") {
    console.log(query.pentestid, query.cweId, query.imageBase64);
    const fetchedResult = await insertProofScreenshot(
      ssh,
      query.imageBase64,
      query.pentestid,
      query.cweId,
      query.title,
      query.description
    );

    ssh.dispose();

    return NextResponse.json({
      success: true,
      data: fetchedResult ?? null,
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
  offset?: number | null,
  limit?: number | null,
  columnFilters?: { column: string; value: string | number }[] | null,
  jsonFilters?:
    | { column: string; keyPath: string[]; value: string | number }[]
    | null,
  selectCondition?: string | null
) {
  let hasMore = true;
  let jsonParts: string[] = [];

  offset = offset ?? 0;
  limit = limit ?? 1000;

  while (hasMore) {
    let whereClauses: string[] = [];
    let selectClause = selectCondition ? selectCondition : "*";
    let fromClause = tableName;
    if (columnFilters && columnFilters.length > 0) {
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
        ORDER BY "${orderByColumn}" DESC
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

async function insertProofScreenshot(
  ssh: NodeSSH,
  imageBase64: string,
  pentestid: string,
  cweId: string,
  title: string,
  description: string
) {
  const safeBase64 = imageBase64.replace(/'/g, "''");

  const query = `
    INSERT INTO vulnerabilities_images (pentestid, cweid, image, title, description)
    VALUES ('${pentestid}', '${cweId}', decode('${safeBase64}', 'base64'),'${title}', '${description}');
  `;

  const result = await ssh.execCommand(
    `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -c "${query}"`
  );

  return result;
}
