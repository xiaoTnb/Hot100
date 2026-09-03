import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getPrefixCode, makePrefixSteps, prefixMethods, prefixNumbers, prefixTarget, type PrefixMethod } from './steps'
import styles from './visualizer.module.css'

export function SubarraySumVisualizer() {
  const [method, setMethod] = useState<PrefixMethod>('two-pass')
  const steps = useMemo(() => makePrefixSteps(method), [method])
  const playback = usePlayback(steps.length, 1700)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as PrefixMethod); playback.reset() }
  const matched = (index: number) => step.matchedStarts.some((start) => index >= start && index < step.prefixIndex)

  return <AlgorithmPlayer methods={prefixMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getPrefixCode(method)} activeLineId={step.lineId} toolbarExtra={<span className={styles.target}>k = {prefixTarget}</span>}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <section className={styles.array}><span>nums</span>{prefixNumbers.map((number, index) => <div data-active={index === step.arrayIndex || undefined} data-match={matched(index) || undefined} key={index}><strong>{number}</strong><small>{index}</small></div>)}</section>
      <section className={styles.prefix}><header><b>前缀和数组 s</b><small>s[j] = nums[0] 到 nums[j − 1] 的和</small></header><div>{step.prefix.map((value, index) => <span data-active={index === step.prefixIndex || undefined} key={index}><small>s[{index}]</small><b>{value}</b></span>)}</div></section>
      <div className={styles.workbench}>
        <section className={styles.equation}><small>把子数组和转成两个前缀和之差</small><div><span><i>当前 s</i><b>{step.sum}</b></span><em>−</em><span><i>k</i><b>{prefixTarget}</b></span><em>=</em><span data-need="true"><i>要找的旧前缀和</i><b>{step.need}</b></span></div><p>cnt[{step.need}] = <strong>{step.found}</strong>，ans = <strong>{step.ans}</strong></p></section>
        <section className={styles.map}><header><b>HashMap cnt</b><small>key：前缀和，value：出现次数</small></header><div>{step.mapEntries.length === 0 ? <em>空表</em> : step.mapEntries.map(([key, count]) => <span data-active={key === step.activeMapKey || undefined} key={key}><b>{key}</b><i>→</i><strong>{count}</strong></span>)}</div></section>
      </div>
      <div className={styles.rule}><b>s[j] − s[i] = k</b><span>移项得到 <code>s[i] = s[j] − k</code>。哈希表中每找到一个这样的旧前缀和，就找到一个连续子数组。</span></div>
      <div className={styles.flow}><span data-active={step.phase === 'build' || step.phase === 'sum' || undefined}>① 得到当前前缀和</span><span data-active={step.phase === 'query' || undefined}>② 查询 s − k 并累加答案</span><span data-active={step.phase === 'record' || step.phase === 'seed' || undefined}>③ 记录当前前缀和</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
