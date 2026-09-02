import { Eye, EyeOff } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { CodePanel } from './CodePanel'
import { PlayerControls } from './PlayerControls'
import type { CodeLine, PlayerMethod } from './types'
import type { PlaybackController } from './usePlayback'

interface AlgorithmPlayerProps {
  methods: PlayerMethod[]
  activeMethod: string
  onMethodChange: (methodId: string) => void
  playback: PlaybackController
  code: CodeLine[]
  activeLineId: string
  toolbarExtra?: ReactNode
  className?: string
  children: ReactNode
}

export function AlgorithmPlayer({ methods, activeMethod, onMethodChange, playback, code, activeLineId, toolbarExtra, className = '', children }: AlgorithmPlayerProps) {
  const [showCode, setShowCode] = useState(false)

  return (
    <div className={`algorithm-player ${className}`.trim()}>
      <div className="player-toolbar">
        <div className="method-tabs" aria-label="选择解法">
          {methods.map((method) => (
            <button className={activeMethod === method.id ? 'active' : ''} onClick={() => onMethodChange(method.id)} key={method.id}>
              {method.label} <small>{method.complexity}</small>
            </button>
          ))}
        </div>
        {toolbarExtra}
        <button className="code-toggle" onClick={() => setShowCode((visible) => !visible)} aria-pressed={showCode}>
          {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
          {showCode ? '隐藏代码' : '显示代码'}
        </button>
      </div>

      <PlayerControls playback={playback} />
      <div className={`player-body ${showCode ? '' : 'code-hidden'}`}>
        {children}
        {showCode && <CodePanel lines={code} activeLineId={activeLineId} />}
      </div>
    </div>
  )
}
