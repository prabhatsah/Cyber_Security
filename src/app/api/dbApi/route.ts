import { NextResponse } from "next/server";
import { NodeSSH } from "node-ssh";
import * as fs from "fs";
import path from "path";


const ssh = new NodeSSH();
const localFilePath = path.join(__dirname, "query.sql");
console.log("this is the directory path ---->" + localFilePath)

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
      let { query } = await req.json();
  
      if (!query) {
        return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 });
      }
      
      await ssh.connect({
        host: "77.68.48.96",
        username: "root",
        password: "QR66&4Zq2#",
      });

      query = query
      fs.writeFileSync(localFilePath, query, { encoding: "utf8" });
      console.log("SQL Query Written to File:", fs.readFileSync(localFilePath, "utf8"));
      await ssh.putFile(localFilePath, remoteFilePath);
  

      const result = await ssh.execCommand(
        `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -f "${remoteFilePath}"`
      );
  
      console.log("Query Result:", result);
      await ssh.execCommand(`rm -f ${remoteFilePath}`);
      ssh.dispose();
      let jsonData : any;
      if(result.stdout.includes('json'))
        jsonData = extractJson(result.stdout)

      return NextResponse.json({ success: true, fullData: result , data : jsonData ? jsonData : null});

    } catch (error: any) {
      console.error("SSH Connection Failed:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
  