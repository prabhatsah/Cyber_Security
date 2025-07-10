"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Input } from "@/shadcn/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Label } from "@/shadcn/ui/label"
import { Search, Loader2, FileText, AlertTriangle } from "lucide-react"
import { useNLPSearch } from "../../api/ai/hooks/useNLPSearch"
import { Badge } from "@/shadcn/ui/badge"

const documentTypes = [
  { value: "policies", label: "Policies" },
  { value: "controls", label: "Controls" },
  { value: "requirements", label: "Requirements" }
]

export function NLPSearch() {
  const [query, setQuery] = useState("")
  const [selectedType, setSelectedType] = useState(documentTypes[0].value)
  const [results, setResults] = useState<any>(null)
  const { search, loading, error } = useNLPSearch()

  const handleSearch = async () => {
    try {
      const result = await search({
        query,
        type: selectedType as any,
        context: "Current organizational context"
      })
      setResults(result)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Document Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Search Query</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your search query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !loading && query.trim()) {
                        handleSearch()
                      }
                    }}
                  />
                  <Select
                    value={selectedType}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{results.analysis}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relevant Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {doc.type}
                      </Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}