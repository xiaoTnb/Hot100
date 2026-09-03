import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeThreeSteps, threeCode, threeMethods, threeOriginal, threeSorted } from './steps'
import styles from './visualizer.module.css'

export function ThreeSumVisualizer() {
  const steps = useMemo(() => makeThreeSteps(), [])
  const playback = usePlayback(steps.length, 1750)
  const step = steps[playback.stepIndex]
  return <AlgorithmPlayer methods={threeMethods} activeMethod="sort-pointers" onMethodChange={playback.reset} playback={playback} code={threeCode} activeLineId={step.lineId} toolbarExtra={<span className={styles.count}>{step.results.length} 个答案</span>}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.sortLine}><span>原数组</span><code>[{threeOriginal.join(', ')}]</code><i>排序 →</i><code>[{threeSorted.join(', ')}]</code></div>
      <div className={styles.array}>{threeSorted.map((number, index) => <div data-role={index === step.first ? 'a' : index === step.second ? 'b' : index === step.third ? 'c' : undefined} data-skip={step.phase === 'skip' && (index === step.first || index === step.second) || undefined} key={index}>
        <span>{index === step.first && <b data-role="a">a</b>}{index === step.second && <b data-role="b">b</b>}{index === step.third && <b data-role="c">c</b>}</span><strong>{number}</strong><small>{index}</small>
      </div>)}</div>
      <div className={styles.logic}>
        <div className={styles.equation}><small>当前检查</small><p><b>{step.first === null ? 'a' : threeSorted[step.first]}</b><i>+</i><b>{step.second === null ? 'b' : threeSorted[step.second]}</b><i>+</i><b>{step.third === null ? 'c' : threeSorted[step.third]}</b><i>=</i><strong data-zero={step.phase === 'found' || undefined}>{step.first === null || step.sum === null ? '?' : threeSorted[step.first] + step.sum}</strong></p><span>目标：b + c = {step.target ?? '?'}</span></div>
        <div className={styles.results}><header>不重复三元组</header><div>{step.results.length === 0 ? <em>还没有找到</em> : step.results.map((triple) => <span key={triple.join(',')}>[{triple.join(', ')}]</span>)}</div></div>
      </div>
      <div className={styles.rule}><b>去重规则</b><span>a 或 b 与上一次枚举的值相同就跳过；排序后，相同三元组只会出现一次。</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
