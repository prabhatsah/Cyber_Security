"use client"

import { useState } from 'react'
import { toast } from 'sonner'

interface AnalysisRequest {
  type: 'policy' | 'risk' | 'compliance' | 'audit'
  data: any
  context?: string
}

interface AIConfiguration {
  apiKey: string
  model: string
}

interface UseAIAnalysisResult {
  analyze: (request: AnalysisRequest) => Promise<string>
  loading: boolean
  error: string | null
  setConfiguration: (config: AIConfiguration) => void
}

export function useAIAnalysis(): UseAIAnalysisResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [config, setConfig] = useState<AIConfiguration | null>(() => {
    if (typeof window !== 'undefined') {
      return {
        apiKey: localStorage.getItem('openai_api_key') || '',
        model: localStorage.getItem('openai_model') || 'gpt-4'
      }
    }
    return null
  })

  const setConfiguration = (newConfig: AIConfiguration) => {
    setConfig(newConfig)
    localStorage.setItem('openai_api_key', newConfig.apiKey)
    localStorage.setItem('openai_model', newConfig.model)
    toast.success('AI configuration updated')
  }

  const analyze = async (request: AnalysisRequest): Promise<string> => {
    if (!config?.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': config.apiKey,
          'x-openai-model': config.model
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Analysis request failed')
      }

      const data = await response.json()
      return data.analysis
    } catch (err: any) {
      setError(err.message)
      toast.error('Analysis Failed', {
        description: err.message
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { analyze, loading, error, setConfiguration }
}