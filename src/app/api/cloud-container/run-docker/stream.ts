import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const resultId = url.searchParams.get("resultId");

  if (!resultId) {
    return NextResponse.json({ error: "Missing resultId" }, { status: 400 });
  }

  console.log(`Streaming logs for resultId: ${resultId}`);

  const stream = new ReadableStream({
    start(controller) {
      // Here, simulate streaming logs by spawning a dummy Docker command
      const child = spawn("docker", ["ps"]); // Replace with actual logs command

      const sendEvent = (data: string, eventType = "message") => {
        controller.enqueue(`event: ${eventType}\n`);
        controller.enqueue(`data: ${data}\n\n`);
      };

      child.stdout.on("data", (data) => {
        sendEvent(`[LOG]: ${data.toString().trim()}`);
      });

      child.stderr.on("data", (data) => {
        sendEvent(`[ERROR]: ${data.toString().trim()}`);
      });

      child.on("close", (code) => {
        sendEvent(`[LOG]: Process exited with code ${code}`, "close");
        controller.close();
      });

      child.on("error", (err) => {
        sendEvent(`[ERROR]: ${err.message}`);
        controller.close();
      });

      req.signal.addEventListener("abort", () => {
        console.log("Request aborted");
        child.kill();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
