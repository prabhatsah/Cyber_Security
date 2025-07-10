"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { useToast } from "../../../hooks/use-toast"
import { Upload, FileSpreadsheet, FileJson } from "lucide-react"
import * as XLSX from "xlsx"
import Papa from "papaparse"

export function ImportControls() {
  const { toast } = useToast()
  const [importing, setImporting] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setImporting(true)
    try {
      const file = acceptedFiles[0]
      const fileType = file.name.split('.').pop()?.toLowerCase()

      let data: any[] = []

      if (fileType === 'csv') {
        const text = await file.text()
        const result = Papa.parse(text, { header: true })
        data = result.data
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        data = XLSX.utils.sheet_to_json(worksheet)
      } else if (fileType === 'json') {
        const text = await file.text()
        data = JSON.parse(text)
      }

      // Validate and process the data
      const processedData = data.map(row => ({
        id: row.id || `CTR-${Math.random().toString(36).substr(2, 9)}`,
        name: row.name,
        description: row.description,
        category: row.category,
        riskLevel: row.riskLevel,
        owner: row.owner,
        status: row.status || "Not Started",
        frameworks: row.frameworks ? JSON.parse(row.frameworks) : [],
      }))

      toast({
        title: "Import Successful",
        description: `Imported ${processedData.length} controls`,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "There was an error importing the controls",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json'],
    },
    maxSize: 5242880, // 5MB
  })

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Import Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors
              ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your file here, or click to select
              </p>
              <div className="flex gap-2 mt-2">
                <FileSpreadsheet className="h-6 w-6" />
                <FileJson className="h-6 w-6" />
              </div>
              <p className="text-xs text-muted-foreground">
                Supports CSV, Excel, and JSON files up to 5MB
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-semibold">Required Fields:</h4>
            <ul className="list-disc pl-6 text-sm text-muted-foreground">
              <li>Control ID (optional, will be generated if not provided)</li>
              <li>Title</li>
              <li>Description</li>
              <li>Category</li>
              <li>Risk Level (High/Medium/Low)</li>
              <li>Owner</li>
              <li>Framework Mappings (JSON array)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}