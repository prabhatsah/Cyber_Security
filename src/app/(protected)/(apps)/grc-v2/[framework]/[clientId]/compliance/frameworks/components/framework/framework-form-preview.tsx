"use client";

import { FrameworkFormValues } from "./framework-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion";
import { format } from "date-fns";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Badge } from "@/shadcn/ui/badge";

interface FrameworkFormPreviewProps {
  formValues: FrameworkFormValues;
}

export function FrameworkFormPreview({ formValues }: FrameworkFormPreviewProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Review Framework</h2>
        <p className="text-muted-foreground">
          Review the framework details before saving.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{formValues.name}</CardTitle>
              <CardDescription className="mt-2">
                Version {formValues.version} | Effective: {format(formValues.effectiveDate, "PPP")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="md:self-start">
              Owner: {formValues.owner}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-sm">{formValues.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Controls & Clauses ({formValues.controls.length})
              </h3>
              
              <ScrollArea className="h-[400px] pr-4">
                <Accordion type="multiple" className="w-full">
                  {formValues.controls.map((control, index) => (
                    <AccordionItem key={index} value={`control-${index}`} className="border rounded-md px-4 mb-4">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex flex-col md:flex-row md:items-center text-left gap-2">
                          <span className="font-medium">{control.index}. {control.name}</span>
                          <Badge variant="secondary" className="md:ml-2 w-fit">
                            {control.type}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pt-2">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Description</h4>
                            <p className="text-sm">{control.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">
                              Objectives ({control.objectives.length})
                            </h4>
                            
                            <div className="space-y-3 pl-4 border-l-2">
                              {control.objectives.map((objective, objIndex) => (
                                <div key={objIndex} className="bg-muted/30 p-3 rounded-md">
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                                    <h5 className="font-medium text-sm">
                                      {objective.index}. {objective.name}
                                    </h5>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {objective.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}