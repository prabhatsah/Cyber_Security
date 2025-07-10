"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  cancel?: React.ReactNode
}

export function toast({ title, description, action, cancel }: ToastProps) {
  sonnerToast(title, {
    description,
    action,
    cancel,
  })
}