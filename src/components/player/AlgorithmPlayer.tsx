import { Eye, EyeOff } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { CodePanel } from './CodePanel'
import { useCodeLanguage } from './language-context'
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
  const { language, setLanguage } = useCodeLanguage()
  const languageLabel = language === 'java' ? 'Java' : 'JavaScript'
  const availableMethods = methods.filter((method) => (method.languages ?? ['java']).includes(language))
  const hasImplementation = availableMethods.some((method) => method.id === activeMethod)

  return (
    <div className={`algorithm-player ${className}`.trim()}>
      <div className="player-toolbar">
        <div className="method-tabs" aria-label="选择解法">
          {availableMethods.map((method) => (
            <button className={activeMethod === method.id ? 'active' : ''} onClick={() => onMethodChange(method.id)} key={method.id}>
              {method.label} <small>{method.complexity}</small>
            </button>
          ))}
          {availableMethods.length === 0 && <span className="method-unavailable">{languageLabel} 解法待录入</span>}
        </div>
        {hasImplementation && toolbarExtra}
        <div className="toolbar-actions">
          <div className="language-switch" role="group" aria-label="代码语言">
            <span>代码语言</span>
            <button className={language === 'java' ? 'active' : ''} onClick={() => setLanguage('java')} aria-pressed={language === 'java'}>Java</button>
            <button className={language === 'javascript' ? 'active' : ''} onClick={() => setLanguage('javascript')} aria-pressed={language === 'javascript'}>JS</button>
          </div>
          {hasImplementation && <button className="code-toggle" onClick={() => setShowCode((visible) => !visible)} aria-pressed={showCode}>
            {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
            {showCode ? '隐藏代码' : '显示代码'}
          </button>}
        </div>
      </div>

      {hasImplementation ? <>
        <PlayerControls playback={playback} />
        <div className={`player-body ${showCode ? '' : 'code-hidden'}`}>
          {children}
          {showCode && <CodePanel lines={code} activeLineId={activeLineId} filename={language === 'java' ? 'Solution.java' : 'solution.js'} />}
        </div>
      </> : <div className="language-empty-state" role="status">
        <b>这道题的 {languageLabel} 解法还没有录入</b>
        <p>收到你的答案后，这里会展示与代码思路一致的动画和同步高亮。</p>
      </div>}
    </div>
  )
}
