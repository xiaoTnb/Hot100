import { useEffect, useState } from 'react'

export interface PlaybackController {
  stepIndex: number
  playing: boolean
  stepCount: number
  reset: () => void
  previous: () => void
  next: () => void
  toggle: () => void
}

export function usePlayback(stepCount: number, intervalMs: number): PlaybackController {
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= stepCount - 1) {
      const timer = window.setTimeout(() => setPlaying(false), 0)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(() => {
      setStepIndex((current) => {
        const nextStep = Math.min(current + 1, stepCount - 1)
        if (nextStep >= stepCount - 1) setPlaying(false)
        return nextStep
      })
    }, intervalMs)

    return () => window.clearTimeout(timer)
  }, [intervalMs, playing, stepCount, stepIndex])

  const reset = () => {
    setStepIndex(0)
    setPlaying(false)
  }

  const previous = () => {
    setStepIndex((current) => Math.max(current - 1, 0))
    setPlaying(false)
  }

  const next = () => {
    setStepIndex((current) => Math.min(current + 1, stepCount - 1))
    setPlaying(false)
  }

  const toggle = () => {
    if (stepIndex >= stepCount - 1) setStepIndex(0)
    setPlaying((current) => !current)
  }

  return { stepIndex, playing, stepCount, reset, previous, next, toggle }
}
