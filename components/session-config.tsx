"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
// Removed Card import - using div instead for performance

interface SessionConfigProps {
  apiKey: string
  setApiKey: (key: string) => void
  systemInstruction: string
  setSystemInstruction: (instruction: string) => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  autoReconnect: boolean
  setAutoReconnect: (reconnect: boolean) => void
  audioFormat: string
  setAudioFormat: (format: string) => void
  onConnect: () => void
  onDisconnect: () => void
  isConnected: boolean
}

export function SessionConfig({
  apiKey,
  setApiKey,
  systemInstruction,
  setSystemInstruction,
  selectedModel,
  setSelectedModel,
  autoReconnect,
  setAutoReconnect,
  audioFormat,
  setAudioFormat,
  onConnect,
  onDisconnect,
  isConnected,
}: SessionConfigProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Session Configuration</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">Gemini API Key</Label>
          <Input
            id="api-key"
            type="password"
            placeholder="Enter your API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental)</SelectItem>
              <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
              <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audio-format">Audio Format</Label>
          <Select value={audioFormat} onValueChange={setAudioFormat}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pcm16">PCM 16-bit</SelectItem>
              <SelectItem value="webm">WebM Opus</SelectItem>
              <SelectItem value="mp3">MP3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="system-instruction">System Instruction</Label>
          <Textarea
            id="system-instruction"
            placeholder="Enter system instruction..."
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
            className="bg-gray-800 border-gray-700 min-h-[80px]"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="auto-reconnect" checked={autoReconnect} onCheckedChange={setAutoReconnect} />
          <Label htmlFor="auto-reconnect">Auto-reconnect on disconnect</Label>
        </div>

        <Button
          onClick={isConnected ? onDisconnect : onConnect}
          variant={isConnected ? "destructive" : "default"}
          className="w-full"
          disabled={!apiKey.trim()}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  )
}
