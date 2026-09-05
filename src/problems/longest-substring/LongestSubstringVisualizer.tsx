import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { useCodeLanguage } from '../../components/player/language-context'
import { usePlayback } from '../../components/player/usePlayback'
import { getSubstringCode, makeSubstringSteps, substringInput, substringMethods, type SubstringMethod } from './steps'
import styles from './visualizer.module.css'

type TrackerCell = { kind: 'value'; index: number; char?: string } | { kind: 'ellipsis'; label: string }

const trackerCells: TrackerCell[] = [
  { kind: 'value', index: 0 },
  { kind: 'ellipsis', label: '1 … 96' },
  { kind: 'value', index: 97, char: 'a' },
  { kind: 'value', index: 98, char: 'b' },
  { kind: 'value', index: 99, char: 'c' },
  { kind: 'ellipsis', label: '100 … 126' },
  { kind: 'value', index: 127 },
]

export function LongestSubstringVisualizer() {
  const { language } = useCodeLanguage()
  const [method, setMethod] = useState<SubstringMethod>(() => language === 'javascript' ? 'set' : 'count')
  const steps = useMemo(() => makeSubstringSteps(method), [method])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as SubstringMethod); playback.reset() }
  const windowText = step.left <= step.windowRight ? substringInput.slice(step.left, step.windowRight + 1) : ''

  return <AlgorithmPlayer methods={substringMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getSubstringCode(method)} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.stringRow}>{[...substringInput].map((char, index) => <div data-window={index >= step.left && index <= step.windowRight || undefined} data-duplicate={index === step.right && step.phase === 'duplicate' || undefined} key={index}>
        <span>{index === step.left && step.phase !== 'done' && <b data-side="left">l</b>}{index === step.right && step.right >= 0 && <b data-side="right">r</b>}</span><strong>{char}</strong><small>{index}</small>
      </div>)}</div>
      <div className={styles.windowCard}><small>当前连续窗口 [left, right]</small><strong>“{windowText}”</strong><span>长度：{Math.max(0, step.windowRight - step.left + 1)}</span></div>
      <div className={styles.lower}>
        {method === 'set' ? <section className={`${styles.trackerCard} ${styles.setTracker}`}><header><b>window = new Set()</b><small>只保存当前窗口内的字符</small></header><div>{step.setValues.length === 0
          ? <em>Set 为空</em>
          : step.setValues.map((char) => <span data-active={char.charCodeAt(0) === step.activeCode || undefined} key={char}><small>字符</small><b>{char}</b><i>存在</i></span>)}</div></section>
          : <section className={styles.trackerCard}><header><b>{method === 'count' ? 'int[] cnt = new int[128]' : 'boolean[] has = new boolean[128]'}</b><small>未展开的下标区间用省略号表示</small></header><div>{trackerCells.map((cell) => cell.kind === 'ellipsis'
          ? <span className={styles.ellipsisCell} key={cell.label}><b>…</b><small>{cell.label}</small></span>
          : <span data-active={cell.index === step.activeCode || undefined} data-on={step.tracker[cell.index] > 0 || undefined} key={cell.index}><small>下标 {cell.index}</small><b>{cell.char ?? '·'}</b><i>{method === 'count' ? step.tracker[cell.index] : step.tracker[cell.index] > 0 ? 'true' : 'false'}</i></span>)}</div></section>}
        <section className={styles.answer}><small>历史最长</small><b>{step.ans}</b><span>ans = max(ans, right - left + 1)</span></section>
      </div>
      <div className={styles.rule}><span data-active={step.phase === 'add' || undefined}>① right 字符进入{method === 'set' ? ' Set' : ''}</span><span data-active={step.phase === 'duplicate' || step.phase === 'remove' || undefined}>② 重复则移动 left</span><span data-active={step.phase === 'update' || undefined}>③ 更新 ans</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
