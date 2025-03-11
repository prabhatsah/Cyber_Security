import { NextResponse } from "next/server";
import { NodeSSH } from "node-ssh";

const ssh = new NodeSSH();


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
      const val = `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -c " ${query}" `;
      console.log("net query is====>" + val)

      const result = await ssh.execCommand(
        `PGPASSWORD="postgres" psql -h localhost -U postgres -p 5436 -d cyber_security -c "${query}"`
      );
  
      console.log("Query Result:", result);
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
  