"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion"
import { Checkbox } from "@/shadcn/ui/checkbox"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

const controlsKnowledge = [
  {
    id: "coso-framework",
    title: "COSO Framework",
    description: "Internal Control Integrated Framework",
    content: [
      {
        title: "Components",
        items: [
          "Control Environment",
          "Risk Assessment",
          "Control Activities",
          "Information and Communication",
          "Monitoring Activities"
        ]
      },
      {
        title: "Principles",
        items: [
          "Demonstrates commitment to integrity and ethical values",
          "Exercises oversight responsibility",
          "Establishes structure, authority, and responsibility",
          "Demonstrates commitment to competence",
          "Enforces accountability"
        ]
      }
    ],
    tasks: [
      "Assess control environment",
      "Document control activities",
      "Review control design",
      "Test control effectiveness",
      "Report control deficiencies"
    ]
  },
  {
    id: "it-controls",
    title: "IT General Controls",
    description: "Technology Control Framework",
    content: [
      {
        title: "Key Areas",
        items: [
          "Access Management",
          "Change Management",
          "System Development",
          "Data Backup and Recovery",
          "IT Operations"
        ]
      },
      {
        title: "Standards",
        items: [
          "ISO 27001",
          "COBIT Framework",
          "NIST Guidelines",
          "ITIL Practices",
          "Cloud Security Controls"
        ]
      }
    ],
    tasks: [
      "Review access controls",
      "Assess change management",
      "Evaluate system security",
      "Monitor IT operations",
      "Document control gaps"
    ]
  }
]

export function ControlsKnowledge() {
  return (
    <ScrollArea className="h-[800px] pr-4">
      <div className="space-y-6">
        {controlsKnowledge.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.content.map((content, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{content.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="ml-6 list-disc [&>li]:mt-2">
                        {content.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                <AccordionItem value="tasks">
                  <AccordionTrigger>Tasks</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {section.tasks.map((task, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Checkbox id={`task-${section.id}-${i}`} />
                          <label htmlFor={`task-${section.id}-${i}`}>{task}</label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}