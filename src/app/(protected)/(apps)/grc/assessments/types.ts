"use client"

import { z } from "zod"

export const assessmentStatusSchema = z.enum([
  "Draft",
  "In Progress",
  "Under Review",
  "Completed",
  "Archived"
])

export const findingStatusSchema = z.enum([
  "Open",
  "In Remediation",
  "Closed",
  "Accepted"
])

export const findingSeveritySchema = z.enum([
  "Critical",
  "High",
  "Medium",
  "Low",
  "Informational"
])

export const assessmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  scope: z.string(),
  framework: z.string(),
  status: assessmentStatusSchema,
  startDate: z.date(),
  endDate: z.date(),
  assessors: z.array(z.string()),
  controlOwners: z.array(z.string()),
  progress: z.number(),
  lastUpdated: z.date(),
  findings: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    controlId: z.string(),
    severity: findingSeveritySchema,
    status: findingStatusSchema,
    remediation: z.string(),
    dueDate: z.date().optional(),
    owner: z.string().optional(),
    evidence: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      url: z.string(),
      uploadedBy: z.string(),
      uploadDate: z.date()
    }))
  })),
  controls: z.array(z.object({
    id: z.string(),
    name: z.string(),
    requirement: z.string(),
    status: z.enum(["Not Started", "In Progress", "Compliant", "Non-Compliant", "Not Applicable"]),
    evidence: z.array(z.string()),
    testProcedures: z.string(),
    results: z.string().optional(),
    reviewer: z.string().optional(),
    reviewDate: z.date().optional()
  }))
})

export type AssessmentStatus = z.infer<typeof assessmentStatusSchema>
export type FindingStatus = z.infer<typeof findingStatusSchema>
export type FindingSeverity = z.infer<typeof findingSeveritySchema>
export type Assessment = z.infer<typeof assessmentSchema>