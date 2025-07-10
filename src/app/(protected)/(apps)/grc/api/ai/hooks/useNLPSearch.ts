import { useState } from 'react'
import { toast } from 'sonner'

interface SearchRequest {
  query: string
  context?: string
  type: 'policies' | 'controls' | 'requirements'
}

interface UseNLPSearchResult {
  search: (request: SearchRequest) => Promise<any>
  loading: boolean
  error: string | null
}

export function useNLPSearch(): UseNLPSearchResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (request: SearchRequest) => {
    setLoading(true)
    setError(null)

    try {
      const apiKey = localStorage.getItem('openai_api_key')
      const model = localStorage.getItem('openai_model') || 'gpt-4'

      if (!apiKey) {
        throw new Error('OpenAI API key not configured')
      }

      const response = await fetch('/api/ai/nlp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-openai-key': apiKey,
          'x-openai-model': model
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Search request failed')
      }

      const data = await response.json()
      return {
        analysis: data.analysis,
        documents: data.documents
      }
    } catch (err) {
      setError(err.message)
      toast.error('Search Failed', {
        description: err.message
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { search, loading, error }
}