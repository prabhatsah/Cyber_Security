import pool from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface Column {
  name: string;
  type: string;
}

export async function POST(req: NextRequest) {
  try {
    const { tableName, columns }: { tableName: string; columns: Column[] } = await req.json();
    if (!tableName || !columns || columns.length === 0) {
      return NextResponse.json({ error: "Missing table name or columns" }, { status: 400 });
    }

    const columnDefinitions = columns.map(col => `${col.name} ${col.type}`).join(", ");
    const query = `CREATE TABLE ${tableName} (${columnDefinitions});`;

    await pool.query(query);
    return NextResponse.json({ message: `Table '${tableName}' created successfully` }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2️⃣ UPDATE TABLE (PUT) - Add Column
export async function PUT(req: NextRequest) {
  try {
    const { tableName, columnName, columnType }: { tableName: string; columnName: string; columnType: string } = await req.json();
    if (!tableName || !columnName || !columnType) {
      return NextResponse.json({ error: "Missing table name, column name, or column type" }, { status: 400 });
    }

    const query = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType};`;
    await pool.query(query);

    return NextResponse.json({ message: `Column '${columnName}' added to table '${tableName}'` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3️⃣ DELETE TABLE (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { tableName }: { tableName: string } = await req.json();
    if (!tableName) {
      return NextResponse.json({ error: "Missing table name" }, { status: 400 });
    }

    const query = `DROP TABLE IF EXISTS ${tableName};`;
    await pool.query(query);

    return NextResponse.json({ message: `Table '${tableName}' deleted successfully` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get("type"); // "databases" or "tables"
  
      if (type === "databases") {
        // List all databases
        const dbQuery = `SELECT datname FROM pg_database WHERE datistemplate = false;`;
        const dbResult = await pool.query(dbQuery);
        const databases = dbResult.rows.map((row: { datname: string }) => row.datname);
  
        return NextResponse.json({ databases }, { status: 200 });
      } else if (type === "tables") {
        // List all tables in the current database
        const tableQuery = `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;
        const tableResult = await pool.query(tableQuery);
        const tables = tableResult.rows.map((row: { tablename: string }) => row.tablename);
  
        return NextResponse.json({ tables }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
      }
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  