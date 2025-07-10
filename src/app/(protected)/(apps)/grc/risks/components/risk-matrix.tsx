"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Badge } from "@/shadcn/ui/badge"
import { Risk } from "../types"

interface RiskMatrixProps {
  risks: Risk[]
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
  const matrix = Array(5).fill(null).map(() => Array(5).fill([]))
  
  // Populate matrix
  risks.forEach(risk => {
    const row = 5 - risk.impact
    const col = risk.likelihood - 1
    matrix[row][col] = [...matrix[row][col], risk]
  })

  const getCellColor = (impact: number, likelihood: number) => {
    const score = impact * likelihood
    if (score >= 15) return "bg-red-100 dark:bg-red-900/20"
    if (score >= 10) return "bg-orange-100 dark:bg-orange-900/20"
    if (score >= 5) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-green-100 dark:bg-green-900/20"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-1" />
          <div className="col-span-5 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map(likelihood => (
              <div key={likelihood} className="text-center text-sm font-medium">
                {likelihood}
              </div>
            ))}
          </div>
          
          {[5, 4, 3, 2, 1].map(impact => (
            <>
              <div key={impact} className="flex items-center justify-center text-sm font-medium">
                {impact}
              </div>
              {[1, 2, 3, 4, 5].map(likelihood => (
                <div
                  key={`${impact}-${likelihood}`}
                  className={`
                    p-2 rounded-lg min-h-[100px]
                    ${getCellColor(impact, likelihood)}
                  `}
                >
                  {matrix[5-impact][likelihood-1].map(risk => (
                    <div
                      key={risk.id}
                      className="text-xs mb-1 truncate"
                      title={risk.name}
                    >
                      <Badge variant="outline" className="text-[10px]">
                        {risk.id}
                      </Badge>
                      {" "}
                      {risk.name}
                    </div>
                  ))}
                </div>
              ))}
            </>
          ))}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium mb-2">Likelihood (1-5)</div>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Rare</li>
              <li>Unlikely</li>
              <li>Possible</li>
              <li>Likely</li>
              <li>Almost Certain</li>
            </ol>
          </div>
          <div>
            <div className="font-medium mb-2">Impact (1-5)</div>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Negligible</li>
              <li>Minor</li>
              <li>Moderate</li>
              <li>Major</li>
              <li>Severe</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}