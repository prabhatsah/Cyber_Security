import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { FileText, Plus, ArrowUpRight } from "lucide-react";

export default function QuestionnairesPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Security Questionnaires</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to security questionnaires from your customers.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Questionnaire
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Questionnaires</CardTitle>
          <CardDescription>
            View and manage your ongoing security questionnaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {[
                {
                  customer: "Acme Corp",
                  type: "SIG",
                  status: "In Progress",
                  dueDate: "2024-04-15",
                  progress: 65,
                },
                {
                  customer: "TechCo",
                  type: "CAIQ",
                  status: "Review Required",
                  dueDate: "2024-04-20",
                  progress: 90,
                },
                {
                  customer: "Global Systems",
                  type: "Custom",
                  status: "In Progress",
                  dueDate: "2024-04-25",
                  progress: 30,
                },
                {
                  customer: "DataFlow Inc",
                  type: "VSA",
                  status: "Pending Approval",
                  dueDate: "2024-04-30",
                  progress: 100,
                },
              ].map((questionnaire, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{questionnaire.customer}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{questionnaire.type}</span>
                        <span>•</span>
                        <span>Due {questionnaire.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{questionnaire.status}</div>
                      <div className="text-sm text-muted-foreground">
                        {questionnaire.progress}% complete
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}