use client";
import { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent } from "@/shadcn/ui/card";
// import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Label } from "@/shadcn/ui/label";

export default function GRCForm() {
  const [fields, setFields] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/parse-docx", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to parse .docx");

    const data = await res.json();
    setFields(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    alert("Saved to DB (simulated)");
    setSubmitted(true);
  };

  function updateRisk(index: number, key: string, value: string) {
    const updated = [...fields.risks];
    updated[index][key] = value;
    setFields({ ...fields, risks: updated });
  }

  if (submitted)
    return <p className="text-green-600">✅ Form submitted successfully!</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Upload GRC Policy (.docx)</h1>
      <Input type="file" accept=".docx" onChange={handleUpload} />

      {loading && <p className="text-muted">📄 Parsing document...</p>}

      {fields && (
        <form className="space-y-6">
          <div className="space-y-3">
            <Label>Policy Title</Label>
            <Input
              value={fields.policyTitle}
              onChange={(e) =>
                setFields({ ...fields, policyTitle: e.target.value })
              }
            />

            <Label>Policy Owner</Label>
            <Input
              value={fields.policyOwner}
              onChange={(e) =>
                setFields({ ...fields, policyOwner: e.target.value })
              }
            />

            <Label>Date Created</Label>
            <Input
              value={fields.dateCreated}
              onChange={(e) =>
                setFields({ ...fields, dateCreated: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">📋 Risk Register</h3>
            {fields.risks.map((risk: any, index: number) => (
              <Card key={index} className="p-4">
                <CardContent className="space-y-3">
                  <Label>Risk Title</Label>
                  <Input
                    value={risk.risk}
                    onChange={(e) => updateRisk(index, "risk", e.target.value)}
                  />

                  <Label>Description</Label>
                  <Textarea
                    value={risk.desc}
                    onChange={(e) => updateRisk(index, "desc", e.target.value)}
                  />

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Impact</Label>
                      <Select
                        value={risk.impact}
                        onValueChange={(value) =>
                          updateRisk(index, "impact", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
                      <Label>Probability</Label>
                      <Select
                        value={risk.prob}
                        onValueChange={(value) =>
                          updateRisk(index, "prob", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select probability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Label>Strategy</Label>
                  <Textarea
                    value={risk.strategy}
                    onChange={(e) =>
                      updateRisk(index, "strategy", e.target.value)
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={handleSubmit} className="primary">
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}
