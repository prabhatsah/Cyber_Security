import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import commands from "@/app/scans/cloudContainer/containers/docker-commands.json";

type CommandKey = keyof typeof commands;

export async function POST(req: NextRequest) {
  try {
    const { commandKey, params } = await req.json();

    if (!commands[commandKey]) {
      return NextResponse.json({ error: "Invalid command key" }, { status: 400 });
    }


    let command = commands[commandKey];
    if (params) {
      Object.keys(params).forEach((key) => {
        command = command.replace(`\${${key}}`, params[key]);
      });
    }

    console.log("Executing Command:", command);

    // Execute command
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ error: stderr || error.message }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ output: stdout }));
        }
      });
    });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
