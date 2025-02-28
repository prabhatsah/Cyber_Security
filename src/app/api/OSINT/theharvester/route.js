import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
import path from "path";

const execPromise = util.promisify(exec);

// Absolute path to theHarvester folder and script
const theHarvesterFolder = "D:/Keross Project/Cyber Security/theHarvester";
const theHarvesterPath = path.join(theHarvesterFolder, "theHarvester.py");

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const limit = searchParams.get("limit") || 100;

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Set working directory using cwd option
    //const command = `python "${theHarvesterPath}" -d ${query} -l ${limit} -b all -f output.json -n`;
    const command = `python "${theHarvesterPath}" -d ${query} -b all -l 100 -f output.json -n`;

    const { stdout, stderr } = await execPromise(command, {
      cwd: theHarvesterFolder,
    });

    if (stderr) {
      console.error("Error:", stderr);
      return NextResponse.json(
        { error: "theHarvester execution failed", stderr },
        { status: 500 }
      );
    }

    // Read the output.json generated in the same directory
    const data = require("fs").readFileSync(
      path.join(theHarvesterFolder, "output.json"),
      "utf-8"
    );
    const parsedData = JSON.parse(data);

    return NextResponse.json({
      message: "Data retrieved successfully",
      data: parsedData,
    });
  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json(
      { error: "Failed to run theHarvester", details: error.message },
      { status: 500 }
    );
  }
}
