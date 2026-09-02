import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import type { PlaybackController } from './usePlayback'

export function PlayerControls({ playback }: { playback: PlaybackController }) {
  const { stepIndex, playing, stepCount, reset, previous, next, toggle } = playback
  const finished = stepIndex >= stepCount - 1
  const progress = stepCount === 0 ? 0 : ((stepIndex + 1) / stepCount) * 100

  return (
    <div className="player-controls top-controls">
      <button className="round-button" onClick={reset} aria-label="重新开始"><RotateCcw size={16} /></button>
      <button className="round-button" onClick={previous} disabled={stepIndex === 0} aria-label="上一步"><SkipBack size={17} /></button>
      <button className="play-button" onClick={toggle} disabled={stepCount === 0}>
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        {playing ? '暂停' : finished ? '重播' : '播放'}
      </button>
      <button className="round-button" onClick={next} disabled={finished} aria-label="下一步"><SkipForward size={17} /></button>
      <div className="timeline"><i><b style={{ width: `${progress}%` }} /></i><span>{stepCount === 0 ? 0 : stepIndex + 1} / {stepCount}</span></div>
    </div>
  )
}
