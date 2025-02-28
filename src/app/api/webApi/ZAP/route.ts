// import { NextResponse } from "next/server";
// import { exec } from "child_process";
// import fs from "fs/promises";
// import path from "path";

// // Define the structure of the request body
// interface ScanRequestBody {
//   url: string;
// }

// export async function POST(req: Request) {
//   try {
//     const { url }: ScanRequestBody = await req.json();

//     if (!url) {
//       return NextResponse.json(
//         { message: "Missing target URL" },
//         { status: 400 }
//       );
//     }

//     const projectRoot = process.cwd();
//     const zapYamlPath = path.join(projectRoot, "zap.yaml");

//     // Generate dynamic zap.yaml content
//     const zapYamlContent = `
// env:
//   contexts:
//     - name: "DynamicScan"
//       urls:
//         - "${url}"
//       includePaths:
//         - "${url}/.*"

// jobs:
//   - type: "spider"
//     parameters:
//       context: "DynamicScan"
//       maxDepth: 0
//       maxChildren: 10

//   - type: "activeScan"
//     parameters:
//       context: "DynamicScan"
//       policy: "Default"

//   - type: "report"
//     parameters:
//       template: "traditional-json-plus"
//       reportDir: "/zap/wrk/"
//       reportFile: "zap-report.json"
// `;

//     // Write the dynamic zap.yaml file to the file system
//     await fs.writeFile(zapYamlPath, zapYamlContent, "utf8");

//     // Docker command to execute ZAP scan
//     const zapCommand = `docker run --rm -v "${projectRoot}:/zap/wrk/:rw" -t zaproxy/zap-stable zap.sh -cmd -autorun /zap/wrk/zap.yaml`;

//     return new Promise<NextResponse>((resolve) => {
//       exec(zapCommand, (error, stdout, stderr) => {
//         if (error) {
//           console.error("ZAP Scan Error:", stderr);
//           return resolve(
//             NextResponse.json(
//               { message: "Scan failed", error: stderr },
//               { status: 500 }
//             )
//           );
//         }

//         console.log("ZAP Scan Output:", stdout);
//         resolve(
//           NextResponse.json({
//             message: "Scan completed successfully",
//             stdout,
//           })
//         );
//       });
//     });
//   } catch (error) {
//     console.error("Internal Server Error:", error);
//     return NextResponse.json(
//       { message: "Internal server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { message: "Missing target URL" },
        { status: 400 }
      );
    }

    const projectRoot = process.cwd();
    const reportPath = path.join(projectRoot, "zap-report.json");

    // Run the ZAP scan
    const zapCommand = `docker run --rm -e ZAP_TARGET_URL="${url}" -v "${projectRoot}:/zap/wrk/:rw" -t zaproxy/zap-stable zap.sh -cmd -autorun /zap/wrk/zap.yaml`;

    return new Promise<NextResponse>((resolve) => {
      exec(zapCommand, async (error, stdout, stderr) => {
        if (error) {
          console.error("ZAP Scan Error:", stderr);
          return resolve(
            NextResponse.json(
              { message: "Scan failed", error: stderr },
              { status: 500 }
            )
          );
        }

        console.log("ZAP Scan Output:", stdout);

        // Wait for the report file to be generated
        try {
          const reportContent = await fs.readFile(reportPath, "utf8");
          resolve(
            NextResponse.json({
              message: "Scan completed successfully",
              report: JSON.parse(reportContent),
            })
          );
        } catch (readError) {
          console.error("Error reading report file:", readError);
          resolve(
            NextResponse.json(
              { message: "Report file not found", error: readError },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
