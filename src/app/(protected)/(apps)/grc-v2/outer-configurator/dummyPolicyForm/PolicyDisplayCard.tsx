// "use client";

// import React from "react";
// import type { FullFormData } from "./PolicyForm";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/shadcn/ui/card";
// import { Badge } from "@/shadcn/ui/badge";
// import {
//     Tabs,
//     TabsContent,
//     TabsList,
//     TabsTrigger,
// } from "@/shadcn/ui/tabs";
// import {
//     User,
//     Calendar,
//     AlertTriangle,
//     ListChecks,
//     ArrowRight,
//     Pencil,
// } from "lucide-react";
// import { Button } from "@/shadcn/ui/button";

// // Helper for labeled text
// const LabelValue = ({ label, value }: { label: string; value?: string }) => (
//     <div className="text-sm text-muted-foreground">
//         <span className="font-semibold text-white">{label}: </span>{value || "N/A"}
//     </div>
// );

// // Card row component
// const RowCard = ({ children }: { children: React.ReactNode }) => (
//     <div className="p-4 rounded-lg bg-muted/20 border border-muted mb-3">
//         {children}
//     </div>
// );

// export default function PolicyDisplayCard({ policy }: { policy: FullFormData }) {
//     return (

//         <Card className="w-full max-w-2xl mx-auto border rounded-2xl shadow-md h-[45vh] overflow-y-auto">
//             <CardHeader className="pb-4 sticky overflow-y-hidden">
//                 <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
//                     <div>
//                         <CardTitle className="text-2xl font-bold text-white">{policy.policyTitle}</CardTitle>
//                         <CardDescription className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
//                             <User className="w-4 h-4" />
//                             Owner: {policy.policyOwner || "N/A"}
//                         </CardDescription>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         {/* Edit Button */}
//                         <Button variant="outline" size="icon" onClick={() => onEdit(policy)}>
//                             <Pencil className="h-3 w-3" />
//                         </Button>
//                         <div className="flex gap-2 flex-wrap justify-start sm:justify-end mt-2">
//                             <Badge variant="destructive" className="flex items-center gap-1.5">
//                                 <AlertTriangle className="h-4 w-4" />
//                                 {policy.risksAddressed.length} Risk(s)
//                             </Badge>
//                             <Badge variant="secondary" className="flex items-center gap-1.5">
//                                 <ListChecks className="h-4 w-4" />
//                                 {policy.policyObjectives.length} Objective(s)
//                             </Badge>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
//                     <LabelValue label="Created" value={policy.dateCreated} />
//                     <LabelValue label="Reviewed" value={policy.lastReviewed || "Never"} />
//                     <LabelValue label="Next Review" value={policy.nextReview} />
//                 </div>
//             </CardHeader>

//             <CardContent className="pt-2">
//                 <Tabs defaultValue="overview" className="h-full flex flex-col">
//                     <TabsList className="grid grid-cols-5 mb-3">
//                         <TabsTrigger value="overview">Overview</TabsTrigger>
//                         <TabsTrigger value="procedures">Procedures</TabsTrigger>
//                         <TabsTrigger value="risks">Risks</TabsTrigger>
//                         <TabsTrigger value="access">Access</TabsTrigger>
//                     </TabsList>

//                     {/* Scrollable tab content */}
//                     <TabsContent value="overview" className="overflow-y-auto pr-2 space-y-4">
//                         {/* Policy Scope */}
//                         <RowCard>
//                             <LabelValue label="Policy Scope" value={policy.policyScope} />
//                         </RowCard>

//                         {/* Objectives */}
//                         {policy.policyObjectives?.length > 0 && (
//                             <RowCard>
//                                 <h4 className="font-semibold text-sm mb-2">Objectives</h4>
//                                 <ul className="list-disc pl-6 text-sm text-muted-foreground">
//                                     {policy.policyObjectives.map((obj, idx) => (
//                                         <li key={idx}>{obj.value}</li>
//                                     ))}
//                                 </ul>
//                             </RowCard>
//                         )}

//                         {/* Guiding Principles */}
//                         <RowCard>
//                             <h4 className="font-semibold text-sm mb-2">Guiding Principles</h4>
//                             {policy.guidingPrinciples.map((gp, idx) => (
//                                 <div key={idx}>
//                                     <div className="font-semibold text-white flex items-center gap-2">
//                                         <ArrowRight className="h-4 w-4 text-primary" /> {gp.subheading}
//                                     </div>
//                                     <ul className="list-disc pl-6 text-muted-foreground text-sm mt-1">
//                                         {gp.points.map((pt, i) => (
//                                             <li key={i}>{pt.value}</li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                             ))}
//                         </RowCard>
//                     </TabsContent>

//                     <TabsContent value="procedures" className="overflow-y-auto pr-2 space-y-4">
//                         <RowCard>
//                             <LabelValue label="System of Record" value={policy.systemOfRecordFields} />
//                         </RowCard>
//                         <RowCard>
//                             <h4 className="font-semibold text-sm mb-2">Processes & Procedures</h4>
//                             <div className="space-y-3">
//                                 {policy.processesAndProcedures.map((proc, idx) => (
//                                     <div key={idx} className="bg-muted p-3 rounded-lg text-sm space-y-1">
//                                         <div className="text-white font-medium">{proc.description}</div>
//                                         <div className="text-muted-foreground">Responsible: {proc.responsible}</div>
//                                         <div className="text-muted-foreground">
//                                             Input: {proc.input} → Process: {proc.process} → Output: {proc.output}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </RowCard>
//                     </TabsContent>

//                     <TabsContent value="risks" className="overflow-y-auto pr-2 space-y-4">
//                         <RowCard>
//                             <LabelValue label="Exceptions" value={policy.exceptions} />
//                         </RowCard>
//                         <RowCard>
//                             <LabelValue label="Violation & Enforcements" value={policy.violationEnforcements} />
//                         </RowCard>
//                         <RowCard>
//                             <h4 className="font-semibold text-sm mb-2">Risks Addressed</h4>
//                             <div className="space-y-3">
//                                 {policy.risksAddressed.map((risk, idx) => (
//                                     <div key={idx} className="bg-muted p-3 rounded-lg text-sm space-y-1">
//                                         <div className="text-white font-medium">{risk.description}</div>
//                                         <div className="text-muted-foreground">Impact: {risk.impact}</div>
//                                         <div className="text-muted-foreground">Probability: {risk.probability}</div>
//                                         <div className="text-muted-foreground">Strategy: {risk.strategy}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </RowCard>
//                     </TabsContent>

//                     <TabsContent value="access" className="overflow-y-auto pr-2 space-y-4">
//                         <RowCard>
//                             <h4 className="font-semibold text-sm mb-2">Access Matrix</h4>
//                             <div className="space-y-3">
//                                 {policy.accessMatrix.map((entry, idx) => (
//                                     <div key={idx} className="bg-muted p-3 rounded-lg text-sm space-y-1">
//                                         <div className="text-white font-medium">Role: {entry.roleGroup}</div>
//                                         <div className="text-muted-foreground">System: {entry.systemInfo}</div>
//                                         <div className="text-muted-foreground">Access Level: {entry.accessLevel}</div>
//                                         <div className="text-muted-foreground">Justification: {entry.justification}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </RowCard>
//                     </TabsContent>
//                 </Tabs>
//             </CardContent>
//         </Card>
//     );
// }


// src/app/components/PolicyDisplayCard.tsx
"use client";

import React from "react";
import type { FullFormData } from "./PolicyForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shadcn/ui/card";
import { Badge } from "@/shadcn/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shadcn/ui/tabs";
import {
    User,
    Calendar,
    AlertTriangle,
    ListChecks,
    ArrowRight,
    Pencil, // Import Pencil icon for edit
} from "lucide-react";
import { Button } from "@/shadcn/ui/button";

// Helper for labeled text
const LabelValue = ({ label, value }: { label: string; value?: string }) => (
    <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-white">{label}: </span>{value || "N/A"}
    </div>
);

// Card row component
const RowCard = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-muted/20 border border-muted mb-3">
        {children}
    </div>
);

// Add onEdit prop
export default function PolicyDisplayCard({
    policy,
    onEdit,
}: {
    policy: FullFormData;
    onEdit: (policy: FullFormData) => void;
}) {
    return (
        <Card className="w-full max-w-2xl mx-auto border rounded-2xl shadow-md h-[45vh] overflow-y-auto flex flex-col">
            <CardHeader className="pb-4 sticky top-0 bg-card z-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <CardTitle className="text-2xl font-bold text-white">{policy.policyTitle}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            Owner: {policy.policyOwner || "N/A"}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <Button variant="outline" size="icon" onClick={() => onEdit(policy)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <div className="flex gap-2 flex-wrap justify-start sm:justify-end">
                            <Badge variant="destructive" className="flex items-center gap-1.5">
                                <AlertTriangle className="h-4 w-4" />
                                {policy.risksAddressed.length} Risk(s)
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1.5">
                                <ListChecks className="h-4 w-4" />
                                {policy.policyObjectives.length} Objective(s)
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                    <LabelValue label="Created" value={policy.dateCreated} />
                    <LabelValue label="Reviewed" value={policy.lastReviewed || "Never"} />
                    <LabelValue label="Next Review" value={policy.nextReview} />
                </div>
            </CardHeader>

            <CardContent className="pt-2 flex-grow">
                <Tabs defaultValue="overview" className="h-full flex flex-col">
                    <TabsList className="grid grid-cols-5 mb-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="procedures">Procedures</TabsTrigger>
                        <TabsTrigger value="risks">Risks</TabsTrigger>
                        <TabsTrigger value="access">Access</TabsTrigger>
                    </TabsList>

                    {/* Scrollable tab content */}
                    <div className="flex-grow overflow-y-auto pr-2">
                        <TabsContent value="overview" className="space-y-4">
                             {/* Policy Scope */}
                             <RowCard>
                                 <LabelValue label="Policy Scope" value={policy.policyScope} />
                             </RowCard>

                             {/* Objectives */}
                             {policy.policyObjectives?.length > 0 && (
                                 <RowCard>
                                     <h4 className="font-semibold text-sm mb-2">Objectives</h4>
                                     <ul className="list-disc pl-6 text-sm text-muted-foreground">
                                         {policy.policyObjectives.map((obj, idx) => (
                                             <li key={idx}>{obj.value}</li>
                                         ))}
                                     </ul>
                                 </RowCard>
                             )}

                             {/* Guiding Principles */}
                             <RowCard>
                                 <h4 className="font-semibold text-sm mb-2">Guiding Principles</h4>
                                 {policy.guidingPrinciples.map((gp, idx) => (
                                     <div key={idx}>
                                         <div className="font-semibold text-white flex items-center gap-2">
                                             <ArrowRight className="h-4 w-4 text-primary" /> {gp.subheading}
                                         </div>
                                         <ul className="list-disc pl-6 text-muted-foreground text-sm mt-1">
                                             {gp.points.map((pt, i) => (
                                                 <li key={i}>{pt.value}</li>
                                             ))}
                                         </ul>
                                     </div>
                                 ))}
                             </RowCard>
                        </TabsContent>

                        <TabsContent value="procedures" className="space-y-4">
                            <RowCard>
                                 <LabelValue label="System of Record" value={policy.systemOfRecordFields} />
                             </RowCard>
                             <RowCard>
                                 <h4 className="font-semibold text-sm mb-2">Processes & Procedures</h4>
                                 <div className="space-y-3">
                                     {policy.processesAndProcedures.map((proc, idx) => (
                                         <div key={idx} className="bg-muted p-3 rounded-lg text-sm space-y-1">
                                             <div className="text-white font-medium">{proc.description}</div>
                                             <div className="text-muted-foreground">Responsible: {proc.responsible}</div>
                                             <div className="text-muted-foreground">
                                                 Input: {proc.input} → Process: {proc.process} → Output: {proc.output}
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </RowCard>
                        </TabsContent>

                        <TabsContent value="risks" className="space-y-4">
                            <RowCard>
                                 <LabelValue label="Exceptions" value={policy.exceptions} />
                             </RowCard>
                             <RowCard>
                                 <LabelValue label="Violation & Enforcements" value={policy.violationEnforcements} />
                             </RowCard>
                             <RowCard>
                                 <h4 className="font-semibold text-sm mb-2">Risks Addressed</h4>
                                 <div className="space-y-3">
                                     {policy.risksAddressed.map((risk, idx) => (
                                         <div key={idx} className="bg-muted p-3 rounded-lg text-sm space-y-1">
                                             <div className="text-white font-medium">{risk.description}</div>
                                             <div className="text-muted-foreground">Impact: {risk.impact}</div>
                                             <div className="text-muted-foreground">Probability: {risk.probability}</div>
                                             <div className="text-muted-foreground">Strategy: {risk.strategy}</div>
                                         </div>
                                     ))}
                                 </div>
                             </RowCard>
                        </TabsContent>

                        <TabsContent value="access" className="space-y-4">
                             <RowCard>
                                 <h4 className="font-semibold text-sm mb-2">Access Matrix</h4>
                                 <div className="space-y-3">
                                     {policy.accessMatrix.map((entry, idx) => (
                                         <div key={idx} className="bg-muted p-3 rounded-lg text-sm space-y-1">
                                             <div className="text-white font-medium">Role: {entry.roleGroup}</div>
                                             <div className="text-muted-foreground">System: {entry.systemInfo}</div>
                                             <div className="text-muted-foreground">Access Level: {entry.accessLevel}</div>
                                             <div className="text-muted-foreground">Justification: {entry.justification}</div>
                                         </div>
                                     ))}
                                 </div>
                             </RowCard>
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}