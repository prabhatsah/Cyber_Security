import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import formidable from "formidable";

export const config = {
  api: { bodyParser: false },
};

// Required to disable Next.js' default body parsing for formidable
export const POST = async (req: NextRequest) => {
  const form = formidable({ fileWriteStreamHandler: () => null });

  const buffer = await req.arrayBuffer();
  const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });

  const text = result.value;
  console.log("server result text ankit ----", text);
  const policyTitle = extractLine(text, /Policy Title\s*\n(.*)/);
  const policyOwner = extractLine(text, /Policy Owner\s*\n(.*)/);
  const dateCreated = extractLine(text, /Date Created\s*\n(.*)/);
  const risks = extractRiskTable(text);

  return NextResponse.json({
    policyTitle,
    policyOwner,
    dateCreated,
    risks,
  });
};

function extractLine(text: string, regex: RegExp) {
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractRiskTable(text: string) {
  const tableStart = text.indexOf(
    "Appendix A - Risks Addressed by this Policy"
  );
  if (tableStart === -1) return [];

  const slice = text.slice(tableStart);

  const rows = [
    ...slice.matchAll(
      /(?<=\n)([^:\n]+):\s*\n(.+?)\n(High|Medium|Low)\n(High|Medium|Low)\n([\s\S]+?)(?=\n\n|\n[A-Z])/g
    ),
  ];

  return rows.map(([, risk, desc, impact, prob, strategy]) => ({
    risk,
    desc,
    impact,
    prob,
    strategy: strategy.trim(),
  }));
}
