import { z } from "zod"

export const frameworkSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  controls: z.array(z.string()),
  totalWeight: z.number(),
})

export const controlSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  riskLevel: z.enum(["High", "Medium", "Low"]),
  owner: z.string(),
  status: z.enum(["Implemented", "In Progress", "Not Started"]),
  lastReview: z.date(),
  frameworks: z.array(z.object({
    id: z.string(),
    mappingId: z.string(),
    weight: z.number(),
  })),
  objectives: z.array(z.string()),
  implementation: z.array(z.string()),
  testing: z.array(z.string()),
  documentation: z.array(z.string()),
})

export type Framework = z.infer<typeof frameworkSchema>
export type Control = z.infer<typeof controlSchema>

export const frameworkCategories = {
  SECURITY: "Information Security",
  RISK: "Risk Management",
  COMPLIANCE: "Compliance",
  GOVERNANCE: "IT Governance",
  INDUSTRY: "Industry-Specific"
} as const

export type FrameworkCategory = typeof frameworkCategories[keyof typeof frameworkCategories]