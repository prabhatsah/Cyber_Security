"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Button } from "@/shadcn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Label } from "@/shadcn/ui/label"
import { Brain, Loader2, AlertTriangle } from "lucide-react"
import { usePredictiveAnalytics } from "../../api/ai/hooks/usePredictiveAnalytics"
import { LineChart, Line } from "recharts"
import { Chart } from "../../components/ui/chart"
import { Badge } from "@/shadcn/ui/badge"

const timeframes = [
  { value: "1month", label: "1 Month" },
  { value: "3months", label: "3 Months" },
  { value: "6months", label: "6 Months" },
  { value: "1year", label: "1 Year" }
]

const analysisTypes = [
  { value: "risk", label: "Risk Trends" },
  { value: "compliance", label: "Compliance Forecast" }
]

const mockData = [
  { date: "Jan", value: 65 },
  { date: "Feb", value: 72 },
  { date: "Mar", value: 68 },
  { date: "Apr", value: 75 },
  { date: "May", value: 82 },
  { date: "Jun", value: 85 }
]

export function PredictiveDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[0].value)
  const [selectedType, setSelectedType] = useState(analysisTypes[0].value)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const { predict, loading, error } = usePredictiveAnalytics()

  const handlePredict = async () => {
    try {
      const result = await predict({
        type: selectedType as 'risk' | 'compliance',
        data: {}, // Current state data
        timeframe: selectedTimeframe
      })
      setAnalysis(result)
    } catch (error) {
      console.error('Prediction failed:', error)
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Analysis Type</Label>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {analysisTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prediction Timeframe</Label>
                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeframes.map(timeframe => (
                      <SelectItem key={timeframe.value} value={timeframe.value}>
                        {timeframe.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handlePredict}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Prediction
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
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart height={300}>
                <LineChart data={mockData}>
                  <Chart.Grid />
                  <Chart.XAxis dataKey="date" />
                  <Chart.YAxis />
                  <Chart.Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </Chart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Analysis Results</CardTitle>
                <Badge variant="secondary">
                  {selectedType === 'risk' ? 'Risk Analysis' : 'Compliance Forecast'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap">{analysis}</div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}