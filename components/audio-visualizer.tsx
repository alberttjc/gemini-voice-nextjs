"use client"

import { useEffect, useRef } from "react"

interface AudioVisualizerProps {
  audioLevel: number
  isActive: boolean
  className?: string
}

export function AudioVisualizer({ audioLevel, isActive, className }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isActive) {
        const barCount = 20
        const barWidth = canvas.width / barCount
        const normalizedLevel = audioLevel / 255

        for (let i = 0; i < barCount; i++) {
          const barHeight = (Math.random() * normalizedLevel + normalizedLevel * 0.5) * canvas.height
          const x = i * barWidth
          const y = canvas.height - barHeight

          ctx.fillStyle = `hsl(${200 + normalizedLevel * 60}, 70%, ${50 + normalizedLevel * 30}%)`
          ctx.fillRect(x, y, barWidth - 2, barHeight)
        }
      }

      requestAnimationFrame(draw)
    }

    draw()
  }, [audioLevel, isActive])

  return <canvas ref={canvasRef} width={200} height={60} className={`bg-gray-800 rounded ${className}`} />
}
