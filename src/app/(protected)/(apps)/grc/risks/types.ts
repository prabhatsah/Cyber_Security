import { z } from "zod"

export const riskCategorySchema = z.enum([
  "Strategic",
  "Operational",
  "Cybersecurity",
  "Compliance",
  "Technical",
  "Financial"
])

export const riskSeveritySchema = z.enum(["High", "Medium", "Low"])

export const riskTreatmentSchema = z.enum([
  "Accept",
  "Mitigate",
  "Transfer",
  "Avoid"
])

export const riskSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: riskCategorySchema,
  description: z.string(),
  potentialImpact: z.string(),
  owner: z.string(),
  severity: riskSeveritySchema,
  likelihood: z.number().min(1).max(5),
  impact: z.number().min(1).max(5),
  riskScore: z.number(),
  existingControls: z.array(z.string()),
  treatmentStrategy: riskTreatmentSchema,
  requiredActions: z.array(z.string()),
  timeline: z.string(),
  resources: z.array(z.string()),
  monitoringMetrics: z.array(z.string()),
  lastReviewDate: z.date(),
  nextReviewDate: z.date(),
  status: z.enum(["Active", "Mitigated", "Accepted", "Transferred"]),
  reviewHistory: z.array(z.object({
    date: z.date(),
    reviewer: z.string(),
    comments: z.string(),
    changes: z.array(z.string())
  }))
})

export type RiskCategory = z.infer<typeof riskCategorySchema>
export type RiskSeverity = z.infer<typeof riskSeveritySchema>
export type RiskTreatment = z.infer<typeof riskTreatmentSchema>
export type Risk = z.infer<typeof riskSchema>