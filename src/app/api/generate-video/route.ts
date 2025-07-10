import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const apiKey = process.env.DID_API_KEY; // Store API key in .env.local

    const options = {
      method: "POST",
      url: "https://api.d-id.com/talks",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik53ek53TmV1R3ptcFZTQjNVZ0J4ZyJ9.eyJodHRwczovL2QtaWQuY29tL2ZlYXR1cmVzIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9zdHJpcGVfcHJvZHVjdF9pZCI6IiIsImh0dHBzOi8vZC1pZC5jb20vc3RyaXBlX2N1c3RvbWVyX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9zdHJpcGVfcHJvZHVjdF9uYW1lIjoidHJpYWwiLCJodHRwczovL2QtaWQuY29tL3N0cmlwZV9zdWJzY3JpcHRpb25faWQiOiIiLCJodHRwczovL2QtaWQuY29tL3N0cmlwZV9iaWxsaW5nX2ludGVydmFsIjoibW9udGgiLCJodHRwczovL2QtaWQuY29tL3N0cmlwZV9wbGFuX2dyb3VwIjoiZGVpZC10cmlhbCIsImh0dHBzOi8vZC1pZC5jb20vc3RyaXBlX3ByaWNlX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9zdHJpcGVfcHJpY2VfY3JlZGl0cyI6IiIsImh0dHBzOi8vZC1pZC5jb20vY2hhdF9zdHJpcGVfc3Vic2NyaXB0aW9uX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9jaGF0X3N0cmlwZV9wcmljZV9jcmVkaXRzIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9jaGF0X3N0cmlwZV9wcmljZV9pZCI6IiIsImh0dHBzOi8vZC1pZC5jb20vcHJvdmlkZXIiOiJnb29nbGUtb2F1dGgyIiwiaHR0cHM6Ly9kLWlkLmNvbS9pc19uZXciOmZhbHNlLCJodHRwczovL2QtaWQuY29tL2FwaV9rZXlfbW9kaWZpZWRfYXQiOiIyMDI1LTAyLTI0VDA1OjM2OjE0LjQ0MFoiLCJodHRwczovL2QtaWQuY29tL29yZ19pZCI6IiIsImh0dHBzOi8vZC1pZC5jb20vYXBwc192aXNpdGVkIjpbIlN0dWRpbyJdLCJodHRwczovL2QtaWQuY29tL2N4X2xvZ2ljX2lkIjoiIiwiaHR0cHM6Ly9kLWlkLmNvbS9jcmVhdGlvbl90aW1lc3RhbXAiOiIyMDI1LTAyLTIwVDEwOjQ4OjU4LjA1MloiLCJodHRwczovL2QtaWQuY29tL2FwaV9nYXRld2F5X2tleV9pZCI6InBxcXk0MHJkbTQiLCJodHRwczovL2QtaWQuY29tL3VzYWdlX2lkZW50aWZpZXJfa2V5IjoiLXJqOWNERW5YWDZqcnJ4Y0Q1Vlg4IiwiaHR0cHM6Ly9kLWlkLmNvbS9oYXNoX2tleSI6InJnWFk3SXlWUXhNNVJVTG1XNHFGeiIsImh0dHBzOi8vZC1pZC5jb20vcHJpbWFyeSI6dHJ1ZSwiaHR0cHM6Ly9kLWlkLmNvbS9lbWFpbCI6InNhbmppYi5kb2xhaUBrZXJvc3MuY29tIiwiaHR0cHM6Ly9kLWlkLmNvbS9jb3VudHJ5X2NvZGUiOiJJTiIsImh0dHBzOi8vZC1pZC5jb20vcGF5bWVudF9wcm92aWRlciI6InN0cmlwZSIsImlzcyI6Imh0dHBzOi8vYXV0aC5kLWlkLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMzMzMjYyNDI1NTQxNzgwMjQ1NyIsImF1ZCI6WyJodHRwczovL2QtaWQudXMuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2QtaWQudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc0MDM3NzA0OCwiZXhwIjoxNzQwNDYzNDQ4LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIHJlYWQ6Y3VycmVudF91c2VyIHVwZGF0ZTpjdXJyZW50X3VzZXJfbWV0YWRhdGEgb2ZmbGluZV9hY2Nlc3MiLCJhenAiOiJHenJOSTFPcmU5Rk0zRWVEUmYzbTN6M1RTdzBKbFJZcSJ9.Uqnlisnh_klkAjPoAEFnf1z1QCVt1R15OMpc9jaB5PTgTwUfUSxd3PWgfmrmPtOd5zd6lr8oIGZFPUa7cIeO01vKg6izrhmH8p9uwYyBs2hJMnCbQQYrTn-1eVhNcm8i4y6ddbaHfrMtmOzVi-CVEiDYzwciFxKS8uBbcYKOCw1MPzbd3t0YPmCrzV7kS9gL61T38QmwMi9ZAhc7t71QPWRwxngeiOoQmRti5jZe1rdHoeeTxELZ6e7FWuR702YK0OqLSeK7GUTXJ9QyTAila8UdJCkvI14acOKBjd0EmOB53WPyhDZaGXRMEePeDQW-KCXBPi4pXNclPD-oX3W2IQ",
      },
      data: {
        source_url:
          "https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg",
        script: {
          type: "text",
          subtitles: "false",
          provider: { type: "microsoft", voice_id: "Sara" },
          input: text,
        },
        config: { fluent: "false" },
      },
    };

    const response = await axios.request(options);
    console.log(response);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error(
      "Error generating video:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
