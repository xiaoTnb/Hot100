import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeProductSteps, productCode, productMethods, productNumbers } from './steps'
import styles from './visualizer.module.css'

export function ProductExceptSelfVisualizer() {
  const steps = useMemo(() => makeProductSteps(), [])
  const playback = usePlayback(steps.length, 1450)
  const step = steps[playback.stepIndex]

  return <AlgorithmPlayer methods={productMethods} activeMethod="prefix-suffix" onMethodChange={playback.reset} playback={playback} code={productCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.matrix}>
        <ArrayRow label="nums" values={productNumbers} activeIndex={step.index} />
        <ArrayRow label="pre" values={step.pre} activeIndex={step.phase === 'pre' || step.phase === 'pre-seed' ? step.index : -1} />
        <ArrayRow label="suf" values={step.suf} activeIndex={step.phase === 'suf' || step.phase === 'suf-seed' ? step.index : -1} />
        <ArrayRow label="ans" values={step.answer} activeIndex={step.phase === 'answer' ? step.index : -1} answer />
      </div>
      <div className={styles.formula} data-phase={step.phase}><small>当前计算</small><b>{step.formula}</b><span>{step.phase === 'answer' ? `不包含 nums[${step.index}]` : step.phase.startsWith('pre') ? '只看当前位置左侧' : step.phase.startsWith('suf') ? '只看当前位置右侧' : '计算完成'}</span></div>
      <div className={styles.flow}><span data-active={step.phase.startsWith('pre') || undefined}>从左向右构造 pre</span><span data-active={step.phase.startsWith('suf') || undefined}>从右向左构造 suf</span><span data-active={step.phase === 'answer' || undefined}>逐项计算 pre × suf</span></div>
      <div className={styles.rule}><b>为什么不会乘到自身</b><span>pre[i] 停在 i 的左边，suf[i] 从 i 的右边开始，两边都不包含 nums[i]。</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function ArrayRow({ label, values, activeIndex, answer = false }: { label: string; values: Array<number | null>; activeIndex: number; answer?: boolean }) {
  return <section data-answer={answer || undefined}><b>{label}</b>{values.map((value, index) => <span data-active={index === activeIndex || undefined} data-filled={value !== null || undefined} key={index}><small>{label}[{index}]</small><strong>{value ?? '·'}</strong></span>)}</section>
}
