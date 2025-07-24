"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

interface ConnectionStatusProps {
  isConnected: boolean
  className?: string
}

export function ConnectionStatus({ isConnected, className }: ConnectionStatusProps) {
  return (
    <Badge variant={isConnected ? "default" : "secondary"} className={`flex items-center gap-1 ${className}`}>
      {isConnected ? (
        <>
          <Wifi className="w-3 h-3" />
          Connected
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          Disconnected
        </>
      )}
    </Badge>
  )
}
