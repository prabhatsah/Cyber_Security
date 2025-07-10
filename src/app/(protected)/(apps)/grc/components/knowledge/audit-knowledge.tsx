"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion"
import { Checkbox } from "@/shadcn/ui/checkbox"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

const auditKnowledge = [
  {
    id: "internal-audit",
    title: "Internal Audit Methodologies",
    description: "Based on IIA Standards",
    content: [
      {
        title: "Key Components",
        items: [
          "Risk-based audit planning",
          "Engagement planning",
          "Fieldwork execution",
          "Documentation standards",
          "Quality assurance"
        ]
      },
      {
        title: "Best Practices",
        items: [
          "Independence and objectivity",
          "Professional competence",
          "Risk assessment methodology",
          "Communication protocols",
          "Follow-up procedures"
        ]
      }
    ],
    tasks: [
      "Develop annual audit plan",
      "Review audit universe",
      "Assess resource requirements",
      "Schedule engagements",
      "Monitor audit progress"
    ]
  },
  {
    id: "external-audit",
    title: "External Audit Requirements",
    description: "Regulatory and Statutory Requirements",
    content: [
      {
        title: "Key Requirements",
        items: [
          "Financial statement audits",
          "Regulatory compliance audits",
          "Performance audits",
          "Special purpose audits",
          "Quality assurance reviews"
        ]
      },
      {
        title: "Standards",
        items: [
          "International Standards on Auditing (ISA)",
          "PCAOB Standards",
          "GAAS requirements",
          "Industry-specific standards",
          "Local regulatory requirements"
        ]
      }
    ],
    tasks: [
      "Coordinate with external auditors",
      "Prepare audit documentation",
      "Review preliminary findings",
      "Address audit observations",
      "Track remediation actions"
    ]
  }
]

export function AuditKnowledge() {
  return (
    <ScrollArea className="h-[800px] pr-4">
      <div className="space-y-6">
        {auditKnowledge.map((section) => (
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