import { useState } from 'react'
import { toast } from 'sonner'

interface PredictionRequest {
  type: 'risk' | 'compliance'
  data: any
  timeframe: string
}

interface UsePredictiveAnalyticsResult {
  predict: (request: PredictionRequest) => Promise<any>
  loading: boolean
  error: string | null
}

export function usePredictiveAnalytics(): UsePredictiveAnalyticsResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = async (request: PredictionRequest) => {
    setLoading(true)
    setError(null)

    try {
      const apiKey = localStorage.getItem('openai_api_key')
      const model = localStorage.getItem('openai_model') || 'gpt-4'

      if (!apiKey) {
        throw new Error('OpenAI API key not configured')
      }

      const response = await fetch('/api/ai/predictive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': apiKey,
          'x-openai-model': model
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Prediction request failed')
      }

      const data = await response.json()
      return data.analysis
    } catch (err) {
      setError(err.message)
      toast.error('Prediction Failed', {
        description: err.message
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { predict, loading, error }
}