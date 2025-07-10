"use client";

import { ok } from "assert";
import { useState } from "react";
import { toast } from "sonner";

export default function ImportExternalPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>([]);

  const handleImport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/run-puppeteer", { method: "POST" });
      const data = await res.json();
      console.log("Data from Puppeteer:", data);

      if (!res.ok) throw new Error("Failed to fetch data from Puppeteer");

      const content = data.message;

      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook-test/11751fe8-7c86-49aa-b7f4-d73df60f4258",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: content,
          }),
        }
      );

      if (!response.ok) throw new Error("Webhook POST failed");

      const webhookResponse = await response.json();
      console.log("Response from server:", webhookResponse);

      setResult(webhookResponse[0]?.message?.content?.tenders ?? []);
      toast.success("Fetched");
    } catch (err) {
      console.error("Error:", err);
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleImport}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Importing..." : "Import"}
      </button>
      <ul>
        {result.map((res) => (
          <li key={res.id}>{JSON.stringify(res)}</li>
        ))}
      </ul>
    </div>
  );
}   
