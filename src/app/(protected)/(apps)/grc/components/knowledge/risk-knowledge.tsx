"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion"
import { Checkbox } from "@/shadcn/ui/checkbox"
import { ScrollArea } from "@/shadcn/ui/scroll-area"

const riskKnowledge = [
  {
    id: "iso-31000",
    title: "ISO 31000 Risk Management",
    description: "Risk Management Principles and Guidelines",
    content: [
      {
        title: "Principles",
        items: [
          "Creates and protects value",
          "Integral part of processes",
          "Part of decision making",
          "Explicitly addresses uncertainty",
          "Systematic, structured and timely"
        ]
      },
      {
        title: "Framework",
        items: [
          "Leadership and commitment",
          "Integration",
          "Design",
          "Implementation",
          "Evaluation and improvement"
        ]
      }
    ],
    tasks: [
      "Define risk criteria",
      "Identify risks",
      "Analyze risks",
      "Evaluate risks",
      "Treat risks"
    ]
  },
  {
    id: "risk-assessment",
    title: "Risk Assessment Methods",
    description: "Comprehensive Risk Evaluation Techniques",
    content: [
      {
        title: "Methods",
        items: [
          "Qualitative assessment",
          "Quantitative assessment",
          "Semi-quantitative methods",
          "Scenario analysis",
          "Stress testing"
        ]
      },
      {
        title: "Tools",
        items: [
          "Risk matrices",
          "Probability impact grids",
          "Risk heat maps",
          "Decision trees",
          "Monte Carlo simulation"
        ]
      }
    ],
    tasks: [
      "Conduct risk workshops",
      "Document risk scenarios",
      "Calculate risk scores",
      "Prioritize risks",
      "Develop mitigation plans"
    ]
  }
]

export function RiskKnowledge() {
  return (
    <ScrollArea className="h-[800px] pr-4">
      <div className="space-y-6">
        {riskKnowledge.map((section) => (
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