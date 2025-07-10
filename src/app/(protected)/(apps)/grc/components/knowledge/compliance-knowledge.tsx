"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion"
import { Checkbox } from "@/shadcn/ui/checkbox"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

const complianceKnowledge = [
  {
    id: "regulatory",
    title: "Regulatory Requirements",
    description: "Key Regulatory Compliance Framework",
    content: [
      {
        title: "Requirements",
        items: [
          "Financial regulations",
          "Data protection laws",
          "Industry standards",
          "Environmental regulations",
          "Employment laws"
        ]
      },
      {
        title: "Documentation",
        items: [
          "Compliance policies",
          "Procedures manuals",
          "Control documentation",
          "Training records",
          "Audit trails"
        ]
      }
    ],
    tasks: [
      "Review regulatory changes",
      "Update compliance register",
      "Assess compliance gaps",
      "Document requirements",
      "Monitor compliance status"
    ]
  },
  {
    id: "training",
    title: "Compliance Training",
    description: "Training and Awareness Programs",
    content: [
      {
        title: "Programs",
        items: [
          "New employee orientation",
          "Annual compliance training",
          "Role-specific training",
          "Regulatory updates",
          "Certification programs"
        ]
      },
      {
        title: "Topics",
        items: [
          "Code of conduct",
          "Anti-corruption",
          "Data privacy",
          "Information security",
          "Health and safety"
        ]
      }
    ],
    tasks: [
      "Schedule training sessions",
      "Track completion rates",
      "Update training materials",
      "Conduct assessments",
      "Review effectiveness"
    ]
  }
]

export function ComplianceKnowledge() {
  return (
    <ScrollArea className="h-[800px] pr-4">
      <div className="space-y-6">
        {complianceKnowledge.map((section) => (
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