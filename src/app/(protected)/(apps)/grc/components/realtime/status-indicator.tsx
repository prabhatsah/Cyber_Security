import { useRealtimeStatus } from '../../hooks/use-realtime'
import { Badge } from '@/shadcn/ui/badge'
import { Wifi, WifiOff } from 'lucide-react'

interface StatusIndicatorProps {
  channel: string
}

export function StatusIndicator({ channel }: StatusIndicatorProps) {
  const { status, error } = useRealtimeStatus(channel as any)

  if (error) {
    return (
      <Badge variant="destructive" className="gap-1">
        <WifiOff className="h-4 w-4" />
        Disconnected
      </Badge>
    )
  }

  return (
    <Badge variant={status === 'SUBSCRIBED' ? 'default' : 'secondary'} className="gap-1">
      <Wifi className="h-4 w-4" />
      {status === 'SUBSCRIBED' ? 'Connected' : 'Connecting...'}
    </Badge>
  )
}