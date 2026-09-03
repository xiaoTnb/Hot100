import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getSubstringCode, makeSubstringSteps, substringInput, substringMethods, type SubstringMethod } from './steps'
import styles from './visualizer.module.css'

const visibleChars = ['a', 'b', 'c']

export function LongestSubstringVisualizer() {
  const [method, setMethod] = useState<SubstringMethod>('count')
  const steps = useMemo(() => makeSubstringSteps(method), [method])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as SubstringMethod); playback.reset() }
  const windowText = step.left <= step.windowRight ? substringInput.slice(step.left, step.windowRight + 1) : ''

  return <AlgorithmPlayer methods={substringMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getSubstringCode(method)} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.stringRow}>{[...substringInput].map((char, index) => <div data-window={index >= step.left && index <= step.windowRight || undefined} data-duplicate={index === step.right && step.phase === 'duplicate' || undefined} key={index}>
        <span>{index === step.left && step.phase !== 'done' && <b data-side="left">left</b>}{index === step.right && step.right >= 0 && <b data-side="right">right</b>}</span><strong>{char}</strong><small>{index}</small>
      </div>)}</div>
      <div className={styles.windowCard}><small>当前连续窗口 [left, right]</small><strong>“{windowText}”</strong><span>长度：{Math.max(0, step.windowRight - step.left + 1)}</span></div>
      <div className={styles.lower}>
        <section className={styles.trackerCard}><header><b>{method === 'count' ? 'int[] cnt = new int[128]' : 'boolean[] has = new boolean[128]'}</b><small>这里只放大输入中出现的字符</small></header><div>{visibleChars.map((char) => { const code = char.charCodeAt(0); const value = step.tracker[code]; return <span data-active={code === step.activeCode || undefined} data-on={value > 0 || undefined} key={char}><small>ASCII {code}</small><b>{char}</b><i>{method === 'count' ? value : value > 0 ? 'true' : 'false'}</i></span> })}</div></section>
        <section className={styles.answer}><small>历史最长</small><b>{step.ans}</b><span>ans = max(ans, right - left + 1)</span></section>
      </div>
      <div className={styles.rule}><span data-active={step.phase === 'add' || undefined}>① right 字符进入</span><span data-active={step.phase === 'duplicate' || step.phase === 'remove' || undefined}>② 重复则移动 left</span><span data-active={step.phase === 'update' || undefined}>③ 更新 ans</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
