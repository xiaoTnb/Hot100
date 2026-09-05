import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import styles from '../binary-search-shared/visualizer.module.css'
import { makeRangeSteps, rangeCode, rangeMethods, rangeNums, rangeTarget } from './steps'

export function FindFirstLastPositionVisualizer() {
  const steps = useMemo(() => makeRangeSteps(), [])
  const playback = usePlayback(steps.length, 1250)
  const step = steps[playback.stepIndex]
  const done = step.phase === 'done'

  return <AlgorithmPlayer methods={rangeMethods} activeMethod="two-bounds" onMethodChange={playback.reset} playback={playback} code={rangeCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.input}><code>nums = [{rangeNums.join(', ')}]</code><span>target <b>{rangeTarget}</b></span><span>本轮找 <b>{step.pass === 'end' ? rangeTarget + 1 : rangeTarget}</b></span></div>
      <div className={styles.array}>{rangeNums.map((number, index) => {
        const isKnownAnswer = index === step.start || index === step.end
        return <div className={styles.cell} data-in-range={step.pass !== 'done' && index > step.left && index < step.right || undefined} data-discarded={step.pass !== 'done' && (index <= step.left || index >= step.right) ? true : undefined} data-mid={index === step.mid || undefined} data-answer={isKnownAnswer || undefined} key={index}>
          <span>{index === step.mid && <b data-kind="mid">mid</b>}{index === step.start && <b data-kind="answer">start</b>}{index === step.end && <b data-kind="answer">end</b>}</span><strong>{number}</strong><small>{index}</small>
        </div>
      })}</div>
      <div className={styles.metrics}><section data-accent={step.pass === 'start' ? 'blue' : undefined}><small>第 1 次 · lowerBound(8)</small><b>{step.start < 0 ? '待定' : step.start}</b></section><section data-accent={step.pass === 'end' ? 'orange' : undefined}><small>第 2 次 · lowerBound(9)</small><b>{step.end < 0 ? '待定' : step.end + 1}</b></section><section><small>当前开区间</small><b>{step.pass === 'done' ? '—' : `(${step.left}, ${step.right})`}</b></section><section data-accent={done ? 'green' : undefined}><small>最终范围</small><b>{done ? `[${step.start}, ${step.end}]` : '组装中'}</b></section></div>
      <div className={styles.phaseTrack}><span data-active={step.pass === 'start' || undefined} data-done={step.start >= 0 || undefined}>① 找第一个 ≥ 8</span><span data-active={step.pass === 'end' || undefined} data-done={step.end >= 0 || undefined}>② 找第一个 ≥ 9</span><span data-active={done || undefined}>③ 右边界减一</span></div>
      <div className={styles.explain}><b>把“最后一个”变成“第一个”</b><span>最后一个 8 的下一位，就是第一个大于 8 的整数位置。题目元素为整数，因此可以查找 target + 1，再把结果减一。</span></div>
      <div className={`step-message ${done ? 'success' : ''}`} aria-live="polite"><span>{done ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
