"use client"

import { Button } from "@/shadcn/ui/button"
import { toast } from "sonner"
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock
} from "lucide-react"

const workflowSteps = {
  "Draft": "Review",
  "Review": "Approval",
  "Approval": "Published"
}

export function WorkflowActions({ 
  status, 
  onUpdateStatus 
}: { 
  status: string
  onUpdateStatus: (newStatus: string) => void 
}) {
  const handleApprove = () => {
    const nextStatus = workflowSteps[status as keyof typeof workflowSteps]
    if (nextStatus) {
      onUpdateStatus(nextStatus)
      toast.success("Status Updated", {
        description: `Control has been moved to ${nextStatus} status.`
      })
    }
  }

  const handleReject = () => {
    onUpdateStatus("Draft")
    toast.error("Control Rejected", {
      description: "Control has been sent back to Draft status."
    })
  }

  if (status === "Published") {
    return (
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span className="text-sm text-green-500">Published</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {status === "Draft" && <Clock className="h-4 w-4 text-yellow-500" />}
      {status === "Review" && <AlertCircle className="h-4 w-4 text-blue-500" />}
      {status === "Approval" && <AlertCircle className="h-4 w-4 text-purple-500" />}
      <span className="text-sm">{status}</span>
      <Button size="sm" variant="outline" onClick={handleApprove}>
        <CheckCircle2 className="mr-1 h-4 w-4" />
        Approve
      </Button>
      <Button size="sm" variant="outline" onClick={handleReject}>
        <XCircle className="mr-1 h-4 w-4" />
        Reject
      </Button>
    </div>
  )
}