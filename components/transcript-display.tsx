"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Copy, Download, Trash2 } from "lucide-react"

interface TranscriptDisplayProps {
  transcript: string
  onClear: () => void
  className?: string
}

export function TranscriptDisplay({ transcript, onClear, className }: TranscriptDisplayProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript)
  }

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transcript-${new Date().toISOString().slice(0, 19)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">Live Transcript</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            disabled={!transcript}
            className="text-gray-400 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTranscript}
            disabled={!transcript}
            className="text-gray-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={!transcript}
            className="text-gray-400 hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-32">
        <div className="text-sm text-gray-300 whitespace-pre-wrap">
          {transcript || "Transcript will appear here..."}
        </div>
      </ScrollArea>
    </div>
  )
}
