import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase, channels } from '@/lib/supabase/client'

type ChannelName = keyof typeof channels
type SubscriptionCallback = (payload: any) => void

export function useRealtimeSubscription(
  channelName: ChannelName,
  table: string,
  callback: SubscriptionCallback
) {
  useEffect(() => {
    const channel = channels[channelName]

    // Subscribe to all changes
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          callback(payload)
        }
      )

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName, table, callback])
}

export function useRealtimeData<T>(
  channelName: ChannelName,
  table: string,
  initialData: T[]
) {
  const [data, setData] = useState<T[]>(initialData)

  useRealtimeSubscription(channelName, table, (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        setData(current => [...current, newRecord])
        break
      case 'UPDATE':
        setData(current =>
          current.map(item =>
            (item as any).id === newRecord.id ? newRecord : item
          )
        )
        break
      case 'DELETE':
        setData(current =>
          current.filter(item => (item as any).id !== oldRecord.id)
        )
        break
    }
  })

  return data
}

export function useRealtimeStatus(channelName: ChannelName) {
  const [status, setStatus] = useState<'SUBSCRIBED' | 'CLOSED' | 'TIMED_OUT' | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const channel = channels[channelName]

    const handleStatusChange = (status: 'SUBSCRIBED' | 'CLOSED' | 'TIMED_OUT') => {
      setStatus(status)
      if (status === 'TIMED_OUT') {
        setError(new Error('Connection timed out'))
      }
    }

    channel
      .on('system', { event: '*' }, ({ status }) => handleStatusChange(status))
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName])

  return { status, error }
}