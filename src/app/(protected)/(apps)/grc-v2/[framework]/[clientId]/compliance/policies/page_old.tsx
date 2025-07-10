import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Button } from "@/shadcn/ui/button";
import { FileText, Plus } from "lucide-react";

export default function PoliciesPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Policies</h1>
          <p className="text-muted-foreground mt-1">
            Manage and maintain your organization's security and compliance policies.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Policy
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Policy Library</CardTitle>
          <CardDescription>
            View and manage all your organization's policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {[
                "Information Security Policy",
                "Access Control Policy",
                "Password Policy",
                "Data Classification Policy",
                "Acceptable Use Policy",
                "Remote Work Policy",
                "Incident Response Policy",
                "Business Continuity Policy",
              ].map((policy, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{policy}</p>
                      <p className="text-sm text-muted-foreground">
                        Last updated 7 days ago
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}