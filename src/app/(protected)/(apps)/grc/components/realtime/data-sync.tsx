import { useEffect } from 'react'
import { useRealtimeSubscription } from '../../hooks/use-realtime'
import { useToast } from '../../hooks/use-toast'

interface DataSyncProps {
  table: string
  channel: string
  onUpdate: (data: any) => void
}

export function DataSync({ table, channel, onUpdate }: DataSyncProps) {
  const { toast } = useToast()

  useRealtimeSubscription(channel as any, table, (payload) => {
    const { eventType, new: newRecord } = payload

    onUpdate(newRecord)

    toast({
      title: 'Data Updated',
      description: `${table} data has been ${eventType.toLowerCase()}d`,
    })
  })

  return null
}