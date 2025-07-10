"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Plus } from "lucide-react";
import { Workbook } from "../../components/workbook/workbook";


interface WorkbookData {
  id: string;
  name: string;
  headers: string[];
  rows: { id: string; cells: string[] }[];
}

export default function WorkbooksPage() {
  const [workbooks, setWorkbooks] = useState<WorkbookData[]>([]);
  const [newWorkbookName, setNewWorkbookName] = useState("");
  const [showNewWorkbook, setShowNewWorkbook] = useState(false);

  const createWorkbook = () => {
    if (newWorkbookName.trim()) {
      const newWorkbook: WorkbookData = {
        id: Math.random().toString(36).substr(2, 9),
        name: newWorkbookName,
        headers: ["Annex #", "Purpose", "Control Activity", "Auditor", "Auditor Questions"],
        rows: [],
      };
      setWorkbooks([...workbooks, newWorkbook]);
      setNewWorkbookName("");
      setShowNewWorkbook(false);
    }
  };

  const handleSave = (workbookId: string, data: { id: string; cells: string[] }[]) => {
    setWorkbooks(
      workbooks.map((wb) => (wb.id === workbookId ? { ...wb, rows: data } : wb))
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Workbooks</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage compliance workbooks and checklists.
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={() => setShowNewWorkbook(true)} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Workbook
        </Button>
      </div>

      {showNewWorkbook && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Workbook</CardTitle>
            <CardDescription>Enter a name for your new workbook</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Workbook name"
                value={newWorkbookName}
                onChange={(e) => setNewWorkbookName(e.target.value)}
              />
              <Button onClick={createWorkbook}>Create</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {workbooks.length > 0 ? (
        <Tabs defaultValue={workbooks[0].id}>
          <TabsList>
            {workbooks.map((workbook) => (
              <TabsTrigger key={workbook.id} value={workbook.id}>
                {workbook.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {workbooks.map((workbook) => (
            <TabsContent key={workbook.id} value={workbook.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{workbook.name}</CardTitle>
                  <CardDescription>
                    Manage your compliance controls and requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Workbook
                    headers={workbook.headers}
                    initialData={workbook.rows}
                    onSave={(data) => handleSave(workbook.id, data)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No workbooks created yet. Click the "New Workbook" button to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}