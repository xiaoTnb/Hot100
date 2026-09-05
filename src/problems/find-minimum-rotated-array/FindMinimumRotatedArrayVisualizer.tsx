import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import styles from '../binary-search-shared/visualizer.module.css'
import { makeMinimumSteps, minimumCode, minimumMethods, minimumNums } from './steps'

export function FindMinimumRotatedArrayVisualizer() {
  const steps = useMemo(() => makeMinimumSteps(), [])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const done = step.phase === 'done'

  return <AlgorithmPlayer methods={minimumMethods} activeMethod="compare-last" onMethodChange={playback.reset} playback={playback} code={minimumCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.input}><code>nums = [{minimumNums.join(', ')}]</code><span>固定参照 nums[n − 1] <b>{minimumNums.at(-1)}</b></span></div>
      <div className={styles.array}>
        <div className={styles.sentinel}><span>{step.left === -1 && <b>left</b>}</span><strong>左段</strong><small>−1</small></div>
        {minimumNums.map((number, index) => <div className={styles.cell} data-in-range={index > step.left && index <= step.right || undefined} data-discarded={index <= step.left || index > step.right ? true : undefined} data-mid={index === step.mid || undefined} data-answer={done && index === step.right || undefined} key={index}>
          <span>{index === step.left && <b>left</b>}{index === step.mid && <b data-kind={done ? 'answer' : 'mid'}>{done ? '最小值' : 'mid'}</b>}{index === step.right && !done && <b data-kind="right">right</b>}</span><strong>{number}</strong><small>{index}</small>
        </div>)}
      </div>
      <div className={styles.interval}><b>最小值候选区间 ({step.left}, {step.right}]</b></div>
      <div className={styles.metrics}><section data-accent="blue"><small>left · 左侧大值段</small><b>{step.left}</b></section><section data-accent="orange"><small>right · 右侧小值段</small><b>{step.right}</b></section><section><small>mid / nums[mid]</small><b>{step.mid < 0 ? '—' : `${step.mid} / ${minimumNums[step.mid]}`}</b></section><section data-accent={done ? 'green' : undefined}><small>最小元素</small><b>{done ? minimumNums[step.right] : '待定'}</b></section></div>
      <div className={styles.decision}><section data-active={step.phase === 'move-left' || undefined}><b>nums[mid] ≥ nums[n − 1]</b><small>mid 在左侧大值段，left = mid</small></section><i>否则</i><section data-active={step.phase === 'move-right' || undefined}><b>nums[mid] &lt; nums[n − 1]</b><small>mid 在右侧小值段，right = mid</small></section></div>
      <div className={styles.explain}><b>为什么保留 mid</b><span>当 nums[mid] 小于末尾值时，mid 已落入最小值所在的右侧段，但它本身仍可能就是断点，所以移动 right 而不是排除 mid。</span></div>
      <div className={`step-message ${done ? 'success' : ''}`} aria-live="polite"><span>{done ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
