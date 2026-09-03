import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeSubstringSteps, substringCode, substringInput, substringMethods } from './steps'
import styles from './visualizer.module.css'

export function LongestSubstringVisualizer() {
  const steps = useMemo(() => makeSubstringSteps(), [])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const windowText = step.i <= step.rk ? substringInput.slice(step.i, step.rk + 1) : ''
  return <AlgorithmPlayer methods={substringMethods} activeMethod="window" onMethodChange={playback.reset} playback={playback} code={substringCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.stringRow}>{[...substringInput].map((char, index) => <div data-window={index >= step.i && index <= step.rk || undefined} data-duplicate={index === step.duplicateIndex || undefined} key={index}>
        <span>{index === step.i && step.phase !== 'done' && <b data-side="left">i</b>}{index === step.rk && <b data-side="right">rk</b>}</span><strong>{char}</strong><small>{index}</small>
      </div>)}</div>
      <div className={styles.windowCard}><small>当前连续窗口 [i, rk]</small><strong>“{windowText}”</strong><span>长度：{Math.max(0, step.rk - step.i + 1)}</span></div>
      <div className={styles.lower}>
        <section className={styles.setCard}><header><b>HashSet occ</b><small>只保存当前窗口字符</small></header><div>{step.occ.length === 0 ? <em>空集合</em> : step.occ.map((char) => <span key={char}>“{char}”</span>)}</div></section>
        <section className={styles.answer}><small>历史最长</small><b>{step.ans}</b><span>ans = max(ans, rk - i + 1)</span></section>
      </div>
      <div className={styles.rule}><span data-active={step.phase === 'remove' || undefined}>① 左移 i，移除旧字符</span><span data-active={step.phase === 'expand' || undefined}>② 无重复则扩张 rk</span><span data-active={step.phase === 'blocked' || undefined}>③ 遇到重复就停</span><span data-active={step.phase === 'update' || undefined}>④ 更新 ans</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
