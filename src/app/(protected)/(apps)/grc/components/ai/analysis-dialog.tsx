import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/ui/dialog'
import { Button } from '@/shadcn/ui/button'
import { Loader2, Brain } from 'lucide-react'
import { useAIAnalysis } from '../../api/ai/hooks/useAIAnalysis'
import { useToast } from '../../hooks/use-toast'

interface AnalysisDialogProps {
  type: 'policy' | 'risk' | 'compliance' | 'audit'
  data: any
  context?: string
  trigger?: React.ReactNode
}

export function AnalysisDialog({ type, data, context, trigger }: AnalysisDialogProps) {
  const [open, setOpen] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const { analyze, loading, error } = useAIAnalysis()
  const { toast } = useToast()

  const handleAnalyze = async () => {
    try {
      const result = await analyze({ type, data, context })
      setAnalysis(result)
    } catch (err) {
      toast({
        title: 'Analysis Failed',
        description: 'Unable to complete the analysis. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Brain className="mr-2 h-4 w-4" />
            AI Analysis
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Analysis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!analysis && !loading && (
            <Button onClick={handleAnalyze} className="w-full">
              <Brain className="mr-2 h-4 w-4" />
              Start Analysis
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {analysis && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{analysis}</div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500">
              Error: {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}