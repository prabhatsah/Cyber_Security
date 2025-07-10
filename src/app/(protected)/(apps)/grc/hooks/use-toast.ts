"use client"

import * as React from "react"
import { toast } from "../components/ui/toast"

export function useToast() {
  const [toasts, setToasts] = React.useState<any[]>([])

  return {
    toast,
    toasts,
    setToasts,
  }
}