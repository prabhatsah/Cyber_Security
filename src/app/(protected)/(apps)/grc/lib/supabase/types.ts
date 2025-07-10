export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      policies: {
        Row: {
          id: string
          title: string
          description: string | null
          version: string
          status: string
          owner: string
          framework: string[]
          content: string
          review_date: string | null
          approval_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          version: string
          status: string
          owner: string
          framework: string[]
          content: string
          review_date?: string | null
          approval_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          version?: string
          status?: string
          owner?: string
          framework?: string[]
          content?: string
          review_date?: string | null
          approval_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      compliance_requirements: {
        Row: {
          id: string
          framework: string
          requirement_id: string
          description: string
          status: string
          due_date: string | null
          owner: string
          evidence_required: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          framework: string
          requirement_id: string
          description: string
          status: string
          due_date?: string | null
          owner: string
          evidence_required: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          framework?: string
          requirement_id?: string
          description?: string
          status?: string
          due_date?: string | null
          owner?: string
          evidence_required?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      risk_assessments: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          likelihood: number
          impact: number
          risk_score: number
          owner: string
          status: string
          treatment_plan: string | null
          review_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          likelihood: number
          impact: number
          risk_score: number
          owner: string
          status: string
          treatment_plan?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          likelihood?: number
          impact?: number
          risk_score?: number
          owner?: string
          status?: string
          treatment_plan?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Additional table types...
    }
  }
}