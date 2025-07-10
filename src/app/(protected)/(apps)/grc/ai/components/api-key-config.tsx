"use client"

import { useState, useEffect } from "react"
import { Input } from "@/shadcn/ui/input"
import { Label } from "@/shadcn/ui/label"
import { Button } from "@/shadcn/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { toast } from "sonner"
import { Key } from "lucide-react"

interface APIKeyConfigProps {
  onConfigured: () => void
}

export function APIKeyConfig({ onConfigured }: APIKeyConfigProps) {
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-4")

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key")
    const savedModel = localStorage.getItem("openai_model")
    if (savedKey) setApiKey(savedKey)
    if (savedModel) setModel(savedModel)
  }, [])

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key")
      return
    }

    localStorage.setItem("openai_api_key", apiKey)
    localStorage.setItem("openai_model", model)
    toast.success("API configuration saved")
    onConfigured()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>OpenAI API Key</Label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4 (Most Capable)</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleSave} className="w-full">
        <Key className="mr-2 h-4 w-4" />
        Save Configuration
      </Button>
    </div>
  )
}