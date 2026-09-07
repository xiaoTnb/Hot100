import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getProductCode, makeProductSteps, productMethods, productNumbers, type ProductMethod } from './steps'
import styles from './visualizer.module.css'

export function ProductExceptSelfVisualizer() {
  const [method, setMethod] = useState<ProductMethod>('arrays')
  const steps = useMemo(() => makeProductSteps(method), [method])
  const playback = usePlayback(steps.length, 1450)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as ProductMethod); playback.reset() }
  return <AlgorithmPlayer methods={productMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getProductCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.matrix}>
        <ArrayRow label="nums" values={productNumbers} activeIndex={step.index} />
        {method === 'arrays' && <ArrayRow label="pre" values={step.pre} activeIndex={step.phase === 'pre' || step.phase === 'pre-seed' ? step.index : -1} />}
        <ArrayRow label={method === 'arrays' ? 'suf' : 'suf / ans'} values={step.suf} activeIndex={step.phase === 'suf' || step.phase === 'suf-seed' || method === 'optimized' && step.phase === 'answer' ? step.index : -1} answer={method === 'optimized'} />
        <ArrayRow label="ans" values={step.answer} activeIndex={step.phase === 'answer' ? step.index : -1} answer />
      </div>
      {method === 'optimized' && <div className={styles.scalar}><small>滚动左侧乘积 pre</small><b>{step.preValue}</b><span>输出数组不计入额外空间</span></div>}
      <div className={styles.formula} data-phase={step.phase}><small>当前计算</small><b>{step.formula}</b><span>{step.phase === 'answer' ? '左侧 × 右侧，不包含自身' : step.phase === 'pre-move' ? '更新给下一个位置使用的 pre' : step.phase.startsWith('pre') ? '构造左侧乘积' : '构造右侧乘积'}</span></div>
      <div className={styles.flow}><span data-active={step.phase.startsWith('pre') || undefined}>{method === 'arrays' ? '从左构造 pre 数组' : '滚动更新 pre'}</span><span data-active={step.phase.startsWith('suf') || undefined}>从右构造 suf</span><span data-active={step.phase === 'answer' || undefined}>左积 × 右积</span></div>
      <div className={styles.rule}><b>为什么不会乘到自身</b><span>左侧乘积停在 i 前面，右侧乘积从 i 后面开始，两边都不包含 nums[i]。</span></div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function ArrayRow({ label, values, activeIndex, answer = false }: { label: string; values: Array<number | null>; activeIndex: number; answer?: boolean }) {
  return <section data-answer={answer || undefined}><b>{label}</b>{values.map((value, index) => <span data-active={index === activeIndex || undefined} data-filled={value !== null || undefined} key={index}><small>{label}[{index}]</small><strong>{value ?? '·'}</strong></span>)}</section>
}
