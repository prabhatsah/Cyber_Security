import { useState } from "react"
import { Button } from "@/shadcn/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Input } from "@/shadcn/ui/input"
import { Settings } from "lucide-react"
import { statusColors, colorSchemes } from "../lib/chart-theme"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"

interface StatusCustomizerProps {
  onCustomize: (colors: Record<string, string>) => void
  statuses: string[]
}

export function StatusCustomizer({ onCustomize, statuses }: StatusCustomizerProps) {
  const [customColors, setCustomColors] = useState<Record<string, string>>(() => {
    const savedColors = localStorage.getItem('custom-status-colors')
    return savedColors ? JSON.parse(savedColors) : statusColors
  })

  const handleColorChange = (status: string, color: string) => {
    const newColors = { ...customColors, [status]: color }
    setCustomColors(newColors)
    onCustomize(newColors)
    localStorage.setItem('custom-status-colors', JSON.stringify(newColors))
  }

  const applyColorScheme = (scheme: keyof typeof colorSchemes) => {
    const newColors = { ...customColors, ...colorSchemes[scheme] }
    setCustomColors(newColors)
    onCustomize(newColors)
    localStorage.setItem('custom-status-colors', JSON.stringify(newColors))
  }

  const resetColors = () => {
    setCustomColors(statusColors)
    onCustomize(statusColors)
    localStorage.removeItem('custom-status-colors')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Status Colors</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <Select onValueChange={(value) => applyColorScheme(value as keyof typeof colorSchemes)}>
              <SelectTrigger>
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="highContrast">High Contrast</SelectItem>
                <SelectItem value="colorBlind">Color Blind Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {statuses.map(status => (
              <div key={status} className="grid grid-cols-2 gap-4 items-center">
                <Label>{status}</Label>
                <Input
                  type="color"
                  value={customColors[status] || statusColors[status as keyof typeof statusColors]}
                  onChange={(e) => handleColorChange(status, e.target.value)}
                />
              </div>
            ))}
          </div>

          <Button onClick={resetColors} variant="outline" className="w-full">
            Reset to Default Colors
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}