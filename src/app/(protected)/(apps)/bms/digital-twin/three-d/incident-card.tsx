"use client"

import { AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/shadcn/ui/button"
import { Card, CardContent } from "@/shadcn/ui/card"

export function IncidentCard({ incident, isSelected, onSelect, onResolve }) {
  const { title, location, severity, timestamp, status } = incident
  
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        isSelected 
          ? 'border-primary ring-1 ring-primary' 
          : 'hover:border-muted-foreground/20'
      }`}
      onClick={() => onSelect(incident)}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 rounded-full p-1 ${
            severity === 'critical' 
              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200' 
              : severity === 'warning'
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-200'
              : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {severity === 'critical' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : severity === 'warning' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{title}</h3>
              {status === 'resolved' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{location}</p>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
            {status === 'active' && (
              <div className="flex justify-end mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onResolve(incident.id)
                  }}
                >
                  Resolve
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}