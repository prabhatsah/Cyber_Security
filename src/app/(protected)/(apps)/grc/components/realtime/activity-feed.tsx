import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Badge } from '@/shadcn/ui/badge'
import { ScrollArea } from '@/shadcn/ui/scroll-area'
import { useRealtimeSubscription } from '../../hooks/use-realtime'
import { format } from 'date-fns'
import { Activity, AlertTriangle, CheckCircle, FileText } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'compliance' | 'risk' | 'control' | 'audit' | 'policy'
  action: 'created' | 'updated' | 'deleted'
  entity: string
  user: string
  timestamp: string
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  // Subscribe to all relevant tables
  useRealtimeSubscription('compliance', 'compliance_requirements', (payload) => {
    addActivity(payload, 'compliance')
  })

  useRealtimeSubscription('risks', 'risk_assessments', (payload) => {
    addActivity(payload, 'risk')
  })

  useRealtimeSubscription('controls', 'controls', (payload) => {
    addActivity(payload, 'control')
  })

  useRealtimeSubscription('audits', 'audits', (payload) => {
    addActivity(payload, 'audit')
  })

  useRealtimeSubscription('policies', 'policies', (payload) => {
    addActivity(payload, 'policy')
  })

  const addActivity = (payload: any, type: ActivityItem['type']) => {
    const { eventType, new: newRecord } = payload
    
    const activity: ActivityItem = {
      id: Date.now().toString(),
      type,
      action: eventType.toLowerCase() as ActivityItem['action'],
      entity: newRecord.title || newRecord.name || 'Unnamed',
      user: newRecord.owner || 'System',
      timestamp: new Date().toISOString()
    }

    setActivities(current => [activity, ...current].slice(0, 50))
  }

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'compliance':
        return <CheckCircle className="h-4 w-4" />
      case 'risk':
        return <AlertTriangle className="h-4 w-4" />
      case 'control':
        return <Activity className="h-4 w-4" />
      case 'audit':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-2 rounded-lg border"
              >
                {getIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.entity}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} {activity.action} this {activity.type}
                  </p>
                </div>
                <Badge variant="outline">
                  {format(new Date(activity.timestamp), 'HH:mm')}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}