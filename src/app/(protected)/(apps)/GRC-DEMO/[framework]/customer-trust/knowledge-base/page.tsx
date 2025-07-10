import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Search, Book, FileText, ArrowRight } from "lucide-react";

export default function KnowledgeBasePage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Access and manage your security and compliance documentation.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            className="pl-9 w-full max-w-md"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Security Policies
            </CardTitle>
            <CardDescription>
              Core security policies and procedures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {[
                  "Information Security Policy",
                  "Access Control Policy",
                  "Data Classification Policy",
                  "Incident Response Plan",
                  "Business Continuity Plan",
                  "Acceptable Use Policy",
                ].map((policy, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{policy}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Compliance Documentation
            </CardTitle>
            <CardDescription>
              Framework-specific documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {[
                  "SOC 2 Type II Report",
                  "ISO 27001 Certificate",
                  "GDPR Documentation",
                  "HIPAA Compliance",
                  "PCI DSS Assessment",
                  "Privacy Policy",
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Technical Documentation
            </CardTitle>
            <CardDescription>
              System and process documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {[
                  "System Architecture",
                  "Network Diagram",
                  "Data Flow Diagram",
                  "Security Controls",
                  "Backup Procedures",
                  "Disaster Recovery",
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}