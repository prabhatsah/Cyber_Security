"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Badge } from "@/shadcn/ui/badge"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react"

interface Evidence {
  id: string
  fileName: string
  status: "Pending" | "Approved" | "Rejected"
  uploadDate: Date
  type: string
}

export function EvidenceCollector() {
  const [evidence, setEvidence] = useState<Evidence[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newEvidence = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        status: "Pending" as const,
        uploadDate: new Date(),
        type: file.type
      }))
      setEvidence([...evidence, ...newEvidence])
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5242880 // 5MB
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50"
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop evidence files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, DOC, DOCX, JPG, PNG up to 5MB
            </p>
          </div>

          <div className="space-y-2">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.fileName}</span>
                  <Badge variant={
                    item.status === "Approved" ? "default" :
                    item.status === "Rejected" ? "destructive" :
                    "secondary"
                  }>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEvidence(evidence.map(e =>
                        e.id === item.id ? { ...e, status: "Approved" } : e
                      ))
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEvidence(evidence.map(e =>
                        e.id === item.id ? { ...e, status: "Rejected" } : e
                      ))
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}