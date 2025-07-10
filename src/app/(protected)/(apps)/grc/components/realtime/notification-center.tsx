import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/shadcn/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shadcn/ui/dropdown-menu'
import { useRealtimeSubscription } from '../../hooks/use-realtime'
import { Badge } from '@/shadcn/ui/badge'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error'
  timestamp: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Subscribe to relevant tables for notifications
  useRealtimeSubscription('compliance', 'compliance_requirements', (payload) => {
    if (payload.new.status === 'Overdue') {
      addNotification({
        title: 'Compliance Alert',
        message: `${payload.new.title} is overdue`,
        type: 'warning'
      })
    }
  })

  useRealtimeSubscription('risks', 'risk_assessments', (payload) => {
    if (payload.new.risk_score >= 15) {
      addNotification({
        title: 'High Risk Alert',
        message: `${payload.new.title} requires immediate attention`,
        type: 'error'
      })
    }
  })

  const addNotification = ({ title, message, type }: Partial<Notification>) => {
    const notification: Notification = {
      id: Date.now().toString(),
      title: title!,
      message: message!,
      type: type || 'info',
      timestamp: new Date().toISOString()
    }

    setNotifications(current => [notification, ...current].slice(0, 50))
    setUnreadCount(count => count + 1)
  }

  const handleOpen = () => {
    setUnreadCount(0)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
            <div className="font-medium">{notification.title}</div>
            <div className="text-sm text-muted-foreground">{notification.message}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}