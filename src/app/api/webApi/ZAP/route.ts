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

// const zapArgs = [
//   "run",
//   "--rm",
//   "-e",
//   `ZAP_TARGET_URL=${url}`,
//   "-v",
//   `${projectRoot}:/zap/wrk/:rw`,
//   "--memory=8g",
//   "--cpus=4",
//   "--ulimit",
//   "nofile=65535:65535",
//   "--network=host",
//   "-t",
//   "zaproxy/zap-stable",
//   "zap.sh",
//   "-cmd",
//   "-autorun",
//   "/zap/wrk/zap.yaml",
// ];

// const zapCommand = `docker ${zapArgs.join(" ")}`;

// import { NextResponse } from "next/server";
// import { exec } from "child_process";
// import fs from "fs/promises";
// import path from "path";

// export async function POST(req: Request) {
//   try {
//     const { url } = await req.json();
//     if (!url) {
//       return NextResponse.json(
//         { message: "Missing target URL" },
//         { status: 400 }
//       );
//     }

//     const projectRoot = process.cwd();
//     const reportPath = path.join(projectRoot, "zap-report.json");

//     // Run the ZAP scan
//     // const zapCommand = `docker run --rm -e ZAP_TARGET_URL="${url}" -v "${projectRoot}:/zap/wrk/:rw" -t zaproxy/zap-stable zap.sh -cmd -autorun /zap/wrk/zap.yaml`;
//     const zapCommand = `docker run --rm -e ZAP_TARGET_URL="${url}" -v "${projectRoot}:/zap/wrk/:rw" -t zaproxy/zap-stable zap.sh -cmd -autorun /zap/wrk/zap.yaml > zap.log 2>&1`;

//     return new Promise<NextResponse>((resolve) => {
//       exec(zapCommand, async (error, stdout, stderr) => {
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

//         // Wait for the report file to be generated
//         try {
//           const reportContent = await fs.readFile(reportPath, "utf8");
//           resolve(
//             NextResponse.json({
//               message: "Scan completed successfully",
//               report: JSON.parse(reportContent),
//             })
//           );
//         } catch (readError) {
//           console.error("Error reading report file:", readError);
//           resolve(
//             NextResponse.json(
//               { message: "Report file not found", error: readError },
//               { status: 500 }
//             )
//           );
//         }
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

// import { NextResponse } from "next/server";

// const zapApiUrl = "http://localhost:8080";

// export async function POST(req: Request) {
//   try {
//     const { url } = await req.json();
//     if (!url) {
//       return NextResponse.json(
//         { message: "Missing target URL" },
//         { status: 400 }
//       );
//     }

//     // Step 1: Start Spider (Crawl the site)
//     await fetch(
//       `${zapApiUrl}/JSON/spider/action/scan/?url=${encodeURIComponent(url)}`
//     );

//     // Step 2: Start Active Scan
//     const response = await fetch(
//       `${zapApiUrl}/JSON/ascan/action/scan/?url=${encodeURIComponent(url)}`
//     );
//     const data = await response.json();

//     return NextResponse.json({
//       message: "Scan started successfully",
//       scanId: data.scan,
//     });
//   } catch (error) {
//     console.error("Internal Server Error:", error);
//     return NextResponse.json(
//       { message: "Internal server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// const zapApiUrl = "http://localhost:8080";

// // Function to check if Spider has finished
// async function waitForSpider(spiderId) {
//   while (true) {
//     const response = await fetch(
//       `${zapApiUrl}/JSON/spider/view/status/?scanId=${spiderId}`
//     );
//     const data = await response.json();

//     if (data.status === "100") {
//       // 100 means completed
//       console.log("Spider scan completed.");
//       break;
//     }

//     console.log("Waiting for Spider scan to complete...");
//     await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 sec
//   }
// }

// async function getZapReport() {
//   const response = await fetch(
//     "http://localhost:8080/OTHER/core/other/jsonreport/"
//   );
//   const report = await response.json();
//   console.log(report);
//   return report;
// }

// export async function POST(req: Request) {
//   try {
//     const { url } = await req.json();
//     if (!url) {
//       return NextResponse.json(
//         { message: "Missing target URL" },
//         { status: 400 }
//       );
//     }

//     // Step 1: Start Spider Scan
//     const spiderResponse = await fetch(
//       `${zapApiUrl}/JSON/spider/action/scan/?url=${encodeURIComponent(url)}`
//     );
//     const spiderData = await spiderResponse.json();

//     if (!spiderData.scan) {
//       throw new Error("Failed to start spider scan");
//     }

//     console.log(`Spider scan started with ID: ${spiderData.scan}`);

//     // Step 2: Wait for Spider Scan to Complete
//     await waitForSpider(spiderData.scan);

//     // Step 3: Start Active Scan
//     const ascanResponse = await fetch(
//       `${zapApiUrl}/JSON/ascan/action/scan/?url=${encodeURIComponent(url)}`
//     );
//     const ascanData = await ascanResponse.json();

//     const scanReport = getZapReport();

//     return NextResponse.json({
//       message: "Scan started successfully",
//       report: scanReport,
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

const zapApiUrl = "http://localhost:8080";

// Function to check if Spider has finished
async function waitForSpider(spiderId) {
  while (true) {
    const response = await fetch(
      `${zapApiUrl}/JSON/spider/view/status/?scanId=${spiderId}`
    );
    const data = await response.json();

    if (data.status === "100") {
      console.log("Spider scan completed.");
      break;
    }

    console.log("Waiting for Spider scan to complete...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 sec
  }
}

// Function to fetch ZAP scan report
async function getZapReport() {
  const response = await fetch(`${zapApiUrl}/OTHER/core/other/jsonreport/`);
  const report = await response.json();
  console.log("Fetched ZAP report.");
  return report;
}

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json(
        { message: "Missing target URL" },
        { status: 400 }
      );
    }

    // Step 1: Start Spider Scan
    const spiderResponse = await fetch(
      `${zapApiUrl}/JSON/spider/action/scan/?url=${encodeURIComponent(url)}`
    );
    const spiderData = await spiderResponse.json();

    if (!spiderData.scan) {
      throw new Error("Failed to start spider scan");
    }

    console.log(`Spider scan started with ID: ${spiderData.scan}`);

    // Step 2: Wait for Spider Scan to Complete
    await waitForSpider(spiderData.scan);

    // Step 3: Start Active Scan
    const ascanResponse = await fetch(
      `${zapApiUrl}/JSON/ascan/action/scan/?url=${encodeURIComponent(url)}`
    );
    const ascanData = await ascanResponse.json();

    if (!ascanData.scan) {
      throw new Error("Failed to start active scan");
    }

    console.log(`Active scan started with ID: ${ascanData.scan}`);

    // Step 4: Wait for Active Scan to Complete
    // while (true) {
    //   const statusResponse = await fetch(
    //     `${zapApiUrl}/JSON/ascan/view/status/?scanId=${ascanData.scan}`
    //   );
    //   const statusData = await statusResponse.json();

    //   console.log("-------------------statusData");
    //   console.log(statusData);

    //   if (statusData.status === "100") {
    //     console.log("Active scan completed.");
    //     break;
    //   }

    //   console.log("Waiting for Active scan to complete...");
    //   await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 sec
    // }

    // Step 5: Fetch the Scan Report
    const scanReport = await getZapReport();

    return NextResponse.json({
      message: "Scan completed successfully",
      report: scanReport,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
