"use client";

import { Tooltip } from "@/ikon/components/tooltip";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

export default function CopyProbeId({ probeId }: { probeId: string }) {
  const [copiedProbeId, setCopiedProbeId] = useState<string | null>(null);

  function copySelectedProbeId(probeId: string) {
    document.querySelector(".copy-probe-id")?.classList.remove("text-primary");
    const selectedProbe = document.getElementById("copy_" + probeId);

    if (selectedProbe) {
      selectedProbe.classList.add("text-primary");
    }

    setCopiedProbeId(probeId);
    try {
      // Try modern clipboard API
      window.focus();
      navigator.clipboard.writeText(probeId);
    } catch (err) {
      console.warn("Clipboard API failed, using fallback:", err);

      const textArea = document.createElement("textarea");
      textArea.value = probeId;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (execErr) {
        console.error("Clipboard fallback failed:", execErr);
        alert("Failed to copy. Please copy manually.");
      }

      document.body.removeChild(textArea);
    }
  }

  return (
    <>
      <span
        className="copy-probe-id"
        id={"copy_" + probeId}
        onClick={() => copySelectedProbeId(probeId)}
      >
        <Tooltip
          tooltipContent={
            copiedProbeId === probeId ? "Probe Id copied" : "Click to copy"
          }
        >
          {copiedProbeId === probeId ? (
            <ClipboardCheck width={20} height={20} />
          ) : (
            <Clipboard width={20} height={20} />
          )}
        </Tooltip>
      </span>
    </>
  );
}
