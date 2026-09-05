import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import styles from '../binary-search-shared/visualizer.module.css'
import { makeSearchInsertSteps, searchInsertCode, searchInsertMethods, searchInsertNums, searchInsertTarget } from './steps'

export function SearchInsertPositionVisualizer() {
  const steps = useMemo(() => makeSearchInsertSteps(), [])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const answer = step.phase === 'done' ? step.right : -1

  return <AlgorithmPlayer methods={searchInsertMethods} activeMethod="open-interval" onMethodChange={playback.reset} playback={playback} code={searchInsertCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.input}><code>nums = [{searchInsertNums.join(', ')}]</code><span>target <b>{searchInsertTarget}</b></span></div>
      <div className={styles.array}>
        <div className={styles.sentinel}><span>{step.left === -1 && <b>left</b>}</span><strong>−∞</strong><small>−1</small></div>
        {searchInsertNums.map((number, index) => <div className={styles.cell} data-in-range={index > step.left && index < step.right || undefined} data-discarded={index <= step.left || index >= step.right ? true : undefined} data-mid={index === step.mid || undefined} data-answer={index === answer || undefined} key={index}>
          <span>{index === step.left && <b>left</b>}{index === step.mid && <b data-kind="mid">mid</b>}{index === step.right && <b data-kind={step.phase === 'done' ? 'answer' : 'right'}>{step.phase === 'done' ? '答案' : 'right'}</b>}</span><strong>{number}</strong><small>{index}</small>
        </div>)}
        <div className={styles.sentinel} data-side="right"><span>{step.right === searchInsertNums.length && <b>right</b>}</span><strong>+∞</strong><small>{searchInsertNums.length}</small></div>
      </div>
      <div className={styles.interval}><b>候选开区间 ({step.left}, {step.right})</b></div>
      <div className={styles.metrics}><section data-accent="blue"><small>left · 已知小于 target</small><b>{step.left}</b></section><section data-accent="orange"><small>right · 已知大于等于 target</small><b>{step.right}</b></section><section><small>mid / nums[mid]</small><b>{step.mid < 0 ? '—' : `${step.mid} / ${searchInsertNums[step.mid]}`}</b></section><section data-accent={step.phase === 'done' ? 'green' : undefined}><small>插入位置</small><b>{answer < 0 ? '待定' : answer}</b></section></div>
      <div className={styles.decision}><section data-active={step.phase === 'move-left' || undefined}><b>nums[mid] &lt; target</b><small>left = mid，排除左半边</small></section><i>否则</i><section data-active={step.phase === 'move-right' || undefined}><b>nums[mid] ≥ target</b><small>right = mid，保留 mid</small></section></div>
      <div className={styles.explain}><b>为什么返回 right</b><span>循环结束时 left + 1 = right。left 仍代表最后一个小于 target 的位置，因此紧随其后的 right 正是查找结果或插入位置。</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
