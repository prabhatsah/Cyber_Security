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
      organizations: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          job_title: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          job_title?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          job_title?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scan_targets: {
        Row: {
          id: string
          organization_id: string
          name: string
          target_url: string | null
          target_ip: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          target_url?: string | null
          target_ip?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          target_url?: string | null
          target_ip?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vulnerability_scans: {
        Row: {
          id: string
          target_id: string
          status: string
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          target_id: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          target_id?: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      scan_findings: {
        Row: {
          id: string
          scan_id: string
          severity: string
          title: string
          description: string | null
          remediation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          severity: string
          title: string
          description?: string | null
          remediation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          severity?: string
          title?: string
          description?: string | null
          remediation?: string | null
          created_at?: string
        }
      }
    }
  }
}