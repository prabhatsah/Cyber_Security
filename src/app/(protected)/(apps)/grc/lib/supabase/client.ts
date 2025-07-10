import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Realtime channels
export const channels = {
  compliance: supabase.channel('compliance-updates'),
  risks: supabase.channel('risk-updates'),
  controls: supabase.channel('control-updates'),
  audits: supabase.channel('audit-updates'),
  policies: supabase.channel('policy-updates'),
  vendors: supabase.channel('vendor-updates'),
  incidents: supabase.channel('incident-updates')
}

// Subscribe to all channels
Object.values(channels).forEach(channel => {
  channel.subscribe()
})