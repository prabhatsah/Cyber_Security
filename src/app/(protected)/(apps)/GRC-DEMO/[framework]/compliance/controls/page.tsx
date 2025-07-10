"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { ScrollArea } from "@/shadcn/ui/scroll-area";

export default function ControlsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controls Library</h1>
          <p className="text-muted-foreground">
            Manage and monitor your security and compliance controls
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Controls Overview</CardTitle>
            <CardDescription>
              View and manage your organization's security and compliance controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  No controls have been configured yet. Controls will appear here once they are added to the system.
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}