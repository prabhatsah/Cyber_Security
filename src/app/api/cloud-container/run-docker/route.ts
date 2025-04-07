import { NextRequest } from "next/server";
import { spawn } from "child_process";
import commands from "@/app/scans/cloudContainer/container/docker-commands.json";

export async function POST(req: NextRequest) {
  const { commandKey, params } = await req.json();

  if (!commands[commandKey]) {
    return new Response(JSON.stringify({ error: "Invalid command key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let command = commands[commandKey];

  if (params) {
    Object.keys(params).forEach((key) => {
      command = command.replace(`\${${key}}`, params[key]);
    });
  }

  console.log(`Executing Command: ${command}`);

  const encoder = new TextEncoder();
  let logs: string[] = [];
  let errors: string[] = [];
  let outputData = "";

  return new Response(
    new ReadableStream({
      start(controller) {
        const child = spawn(command, { shell: true });

        child.stdout?.on("data", (data) => {
          const text = data.toString();
          logs.push(text);
          outputData += text;
          controller.enqueue(
            encoder.encode(JSON.stringify({ log: text.trim() }) + "\n")
          );
        });

        child.stderr?.on("data", (data) => {
          const text = data.toString();
          errors.push(text);
          controller.enqueue(
            encoder.encode(JSON.stringify({ error: text.trim() }) + "\n")
          );
        });

        child.on("close", (code) => {
          console.log(`Process exited with code ${code}`);
          const output =
            code === 0
              ? { result: outputData.trim() }
              : { error: `Process exited with code ${code}` };

          controller.enqueue(encoder.encode(JSON.stringify({ output }) + "\n"));
          controller.close();
        });

        child.on("error", (err) => {
          console.error(`Execution Error: ${err.message}`);
          controller.enqueue(
            encoder.encode(JSON.stringify({ error: err.message }) + "\n")
          );
          controller.close();
        });
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  );
}
