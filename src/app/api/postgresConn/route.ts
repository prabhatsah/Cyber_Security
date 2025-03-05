import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { Client } = await import("ssh2");

  try {
    const { host, username, password, command } = await req.json();

    return new Promise((resolve) => {
      const conn = new Client();
      conn
        .on("ready", () => {
          conn.exec(command, (err, stream) => {
            if (err) {
              conn.end();
              return resolve(
                NextResponse.json({ error: err.message }, { status: 500 })
              );
            }

            let output = "";
            let errorOutput = "";

            stream
              .on("close", () => {
                conn.end();
                resolve(NextResponse.json({ output, errorOutput }));
              })
              .on("data", (data : any) => {
                output += data.toString();
              })
              .stderr.on("data", (data) => {
                errorOutput += data.toString();
              });
          });
        })
        .connect({ host, username, password, port: 22 });
    });
  } catch (error : any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
