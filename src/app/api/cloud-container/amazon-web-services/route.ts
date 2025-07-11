import { NextRequest, NextResponse } from "next/server";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

export async function POST(req: NextRequest) {
  try {
    const { accessKeyId, secretAccessKey } = await req.json();

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { success: false, error: "Missing AWS credentials" },
        { status: 400 }
      );
    }

    const stsClient = new STSClient({
      region: "us-east-1", // Change to your AWS region
      credentials: { accessKeyId, secretAccessKey },
    });

    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);

    return NextResponse.json(
      {
        success: true,
        message: "AWS credentials are valid",
        identity: response,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid AWS credentials",
        details: (error as Error).message,
      },
      { status: 401 }
    );
  }
}
