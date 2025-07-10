"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card"
import { Label } from "@/shadcn/ui/label"
import { Input } from "@/shadcn/ui/input"
import { Button } from "@/shadcn/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs"
import { Slider } from "@/shadcn/ui/slider"
import { useTheme } from "next-themes"
import { Save, Palette, Sun, Moon } from "lucide-react"

const presetThemes = {
  light: {
    gradientStart: "215, 219, 220",
    gradientEnd: "255, 255, 255",
    gradientAngle: "180",
  },
  dark: {
    gradientStart: "10, 10, 20",
    gradientEnd: "0, 0, 0",
    gradientAngle: "180",
  },
  blue: {
    gradientStart: "200, 220, 255",
    gradientEnd: "230, 240, 255",
    gradientAngle: "165",
  },
  purple: {
    gradientStart: "220, 210, 255",
    gradientEnd: "240, 230, 255",
    gradientAngle: "165",
  },
}

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [customTheme, setCustomTheme] = useState({
    gradientStart: theme === "dark" ? presetThemes.dark.gradientStart : presetThemes.light.gradientStart,
    gradientEnd: theme === "dark" ? presetThemes.dark.gradientEnd : presetThemes.light.gradientEnd,
    gradientAngle: "180",
  })

  const updateTheme = (theme: typeof customTheme) => {
    document.documentElement.style.setProperty("--gradient-start", theme.gradientStart)
    document.documentElement.style.setProperty("--gradient-end", theme.gradientEnd)
    document.documentElement.style.setProperty("--gradient-angle", `${theme.gradientAngle}deg`)
  }

  const applyPreset = (preset: keyof typeof presetThemes) => {
    const newTheme = presetThemes[preset]
    setCustomTheme(newTheme)
    updateTheme(newTheme)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Customize Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="gradient">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="gradient">Gradient</TabsTrigger>
                <TabsTrigger value="presets">Presets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gradient" className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Color</Label>
                  <Input
                    type="text"
                    value={customTheme.gradientStart}
                    onChange={(e) => {
                      const newTheme = { ...customTheme, gradientStart: e.target.value }
                      setCustomTheme(newTheme)
                      updateTheme(newTheme)
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>End Color</Label>
                  <Input
                    type="text"
                    value={customTheme.gradientEnd}
                    onChange={(e) => {
                      const newTheme = { ...customTheme, gradientEnd: e.target.value }
                      setCustomTheme(newTheme)
                      updateTheme(newTheme)
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Angle: {customTheme.gradientAngle}°</Label>
                  <Slider
                    value={[parseInt(customTheme.gradientAngle)]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(value) => {
                      const newTheme = { ...customTheme, gradientAngle: value[0].toString() }
                      setCustomTheme(newTheme)
                      updateTheme(newTheme)
                    }}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="presets" className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTheme("light")
                      applyPreset("light")
                    }}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTheme("dark")
                      applyPreset("dark")
                    }}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => applyPreset("blue")}
                  >
                    Blue
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => applyPreset("purple")}
                  >
                    Purple
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              className="w-full"
              onClick={() => {
                localStorage.setItem("custom-theme", JSON.stringify(customTheme))
                setIsOpen(false)
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}