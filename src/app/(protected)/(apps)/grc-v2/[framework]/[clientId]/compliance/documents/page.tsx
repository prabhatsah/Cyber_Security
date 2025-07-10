"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-8">
        <FileText className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Documents</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Manage and organize your compliance documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your document library will be displayed here. This page is under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}