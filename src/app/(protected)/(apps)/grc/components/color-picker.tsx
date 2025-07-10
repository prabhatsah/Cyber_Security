"use client"

import { useState } from "react"
import { Button } from "@/shadcn/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
import { Label } from "@/shadcn/ui/label"
import { Input } from "@/shadcn/ui/input"
import { Palette } from "lucide-react"
import { statusColors, riskLevelColors } from "../lib/chart-theme"

interface ColorPickerProps {
  type: "status" | "risk" | "chart"
  onColorChange: (colors: Record<string, string>) => void
  defaultColors: Record<string, string>
}

export function ColorPicker({ type, onColorChange, defaultColors }: ColorPickerProps) {
  const [colors, setColors] = useState(defaultColors)

  const handleColorChange = (key: string, value: string) => {
    const newColors = { ...colors, [key]: value }
    setColors(newColors)
    onColorChange(newColors)
  }

  const resetColors = () => {
    const defaultSet = type === "status" ? statusColors : 
                      type === "risk" ? riskLevelColors :
                      defaultColors
    setColors(defaultSet)
    onColorChange(defaultSet)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Colors</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-2">{key}</Label>
              <Input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="col-span-2"
              />
            </div>
          ))}
          <Button onClick={resetColors} variant="outline" className="mt-4">
            Reset to Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}