import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getMaxCode, makeMaxSteps, maxMethods, maxNumbers, type MaxMethod } from './steps'
import styles from './visualizer.module.css'

export function MaximumSubarrayVisualizer() {
  const [method, setMethod] = useState<MaxMethod>('prefix')
  const steps = useMemo(() => makeMaxSteps(method), [method])
  const playback = usePlayback(steps.length, 1600)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as MaxMethod); playback.reset() }
  const answer = Number.isFinite(step.ans) ? step.ans : '−∞'
  return <AlgorithmPlayer methods={maxMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getMaxCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.inputLine}><span>动画用例</span><code>nums = [{maxNumbers.join(', ')}]</code></div>
      <section className={styles.array}><span>nums</span>{maxNumbers.map((number, index) => <div data-candidate={step.candidateStart >= 0 && index >= step.candidateStart && index <= step.index || undefined} data-best={step.bestStart >= 0 && index >= step.bestStart && index <= step.bestEnd || undefined} data-current={index === step.index || undefined} key={index}><i>{index === step.candidateStart && step.index >= 0 && <b>起点</b>}{index === step.index && <b data-end="true">当前</b>}</i><strong>{number}</strong><small>{index}</small></div>)}</section>
      {method === 'dp' && <section className={styles.dpRow}><header><b>f[i]：必须以 nums[i] 结尾的最大子数组和</b><small>答案取所有 f[i] 的最大值</small></header><div>{step.f.map((value, index) => <span data-active={index === step.index || undefined} key={index}><small>f[{index}]</small><b>{value ?? '·'}</b></span>)}</div></section>}
      <div className={styles.metrics}>
        {method === 'prefix' ? <>
          <section><small>当前前缀和 preSum</small><b>{step.preSum}</b></section>
          <section><small>此前最小前缀和 minPreSum</small><b>{step.minPreSum}</b></section>
          <section data-candidate="true"><small>候选和 = preSum − minPreSum</small><b>{step.candidate}</b></section>
        </> : <>
          <section><small>{method === 'dp' ? '当前 f[i]' : '滚动变量 f'}</small><b>{step.currentF}</b></section>
          <section className={styles.formula}><small>状态转移</small><b>max(旧 f, 0) + nums[i]</b></section>
          <section data-candidate="true"><small>当前候选连续和</small><b>{step.candidate}</b></section>
        </>}
        <section data-answer="true"><small>历史最大 ans</small><b>{answer}</b></section>
      </div>
      <div className={styles.explain}>{method === 'prefix' ? <><b>顺序不能交换</b><span>先用当前前缀和减“此前”的最小前缀和更新答案，再把当前前缀和加入最小值候选，保证子数组非空。</span></> : <><b>拼接还是重开</b><span>旧 f 为正就能增加当前和，继续拼接；旧 f 不为正只会拖累当前元素，因此从当前元素重新开始。</span></>}</div>
      <div className={styles.flow}>{method === 'prefix' ? <>
        <span data-active={step.phase === 'sum' || undefined}>① 累加 preSum</span><span data-active={step.phase === 'candidate' || undefined}>② 先更新 ans</span><span data-active={step.phase === 'minimum' || undefined}>③ 再更新 minPreSum</span>
      </> : <><span data-active={step.phase === 'transition' || undefined}>① 计算当前 f</span><span data-active={step.phase === 'update' || undefined}>② 更新历史 ans</span><span>③ 继续下一个元素</span></>}</div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
