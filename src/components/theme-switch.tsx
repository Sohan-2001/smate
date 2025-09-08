"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

import { Switch } from "@/components/ui/switch"

export function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isChecked = resolvedTheme === "dark"

  const handleToggle = () => {
    setTheme(isChecked ? "light" : "dark")
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5" />
      <Switch
        checked={isChecked}
        onCheckedChange={handleToggle}
        aria-label="Toggle between light and dark mode"
      />
      <Moon className="h-5 w-5" />
    </div>
  )
}
