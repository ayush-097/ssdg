"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CommandBlockProps = {
  commands: string | string[]
  label?: string
  className?: string
}

export default function CommandBlock({ commands, label, className }: CommandBlockProps) {
  const text = Array.isArray(commands) ? commands.join("\n") : commands
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // no-op
    }
  }

  return (
    <div className={cn("rounded-lg border bg-muted/40", className)}>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm text-muted-foreground">{label ?? "Command"}</span>
        <Button size="sm" variant="secondary" onClick={handleCopy} aria-label="Copy command to clipboard">
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 text-sm leading-6">
        <code>{text}</code>
      </pre>
    </div>
  )
}
