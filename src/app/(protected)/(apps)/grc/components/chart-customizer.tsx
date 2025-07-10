"use client"

import { useState } from "react"
import { Button } from "@/shadcn/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Input } from "@/shadcn/ui/input"
import { Settings } from "lucide-react"

interface ChartCustomizerProps {
  onCustomize: (settings: any) => void
  defaultSettings: any
  chartId: string
}

export function ChartCustomizer({ onCustomize, defaultSettings, chartId }: ChartCustomizerProps) {
  const [settings, setSettings] = useState(defaultSettings)

  const handleChange = (key: string, value: string) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onCustomize(newSettings)
    localStorage.setItem(`chart-settings-${chartId}`, JSON.stringify(newSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    onCustomize(defaultSettings)
    localStorage.removeItem(`chart-settings-${chartId}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Chart</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label>{key}</Label>
              <Input
                type={typeof value === 'string' && value.startsWith('#') ? 'color' : 'text'}
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
          <Button onClick={resetSettings} variant="outline" className="w-full">
            Reset to Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}