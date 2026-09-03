import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { consecutiveCode, consecutiveMethods, consecutiveNumbers, consecutivePhaseNames, makeConsecutiveSteps } from './steps'
import styles from './visualizer.module.css'

export function LongestConsecutiveVisualizer() {
  const steps = useMemo(() => makeConsecutiveSteps(), [])
  const playback = usePlayback(steps.length, 1800)
  const step = steps[playback.stepIndex]
  const activePhase = step.phase === 'start' || step.phase === 'skip' ? 'check' : step.phase

  return (
    <AlgorithmPlayer methods={consecutiveMethods} activeMethod="hash-set" onMethodChange={playback.reset} playback={playback} code={consecutiveCode} activeLineId={step.lineId} toolbarExtra={<span className={styles.setSize}>Set.size = {step.setValues.length}</span>}>
      <div className={`animation-canvas ${styles.canvas}`}>
        <section className={styles.inputRow}>
          <span>nums</span>
          {consecutiveNumbers.map((number, index) => <b data-active={index === step.arrayIndex || undefined} data-used={step.setValues.includes(number) || undefined} key={index}><small>{index}</small>{number}</b>)}
        </section>

        <section className={styles.setCard}>
          <header><b>HashSet</b><small>动画按数值顺序展示，算法不需要排序</small></header>
          <div>
            {step.setValues.length === 0 && <em>空集合</em>}
            {step.setValues.map((number) => <span data-current={number === step.currentNum || undefined} data-probe={number === step.probe || undefined} data-sequence={step.sequence.includes(number) || undefined} key={number}>{number}</span>)}
          </div>
        </section>

        <section className={styles.workbench}>
          <div className={styles.predecessorCard} data-state={step.predecessorExists === null ? 'idle' : step.predecessorExists ? 'found' : 'missing'}>
            <small>起点判断</small>
            <strong>{step.currentNum === null ? 'num − 1' : `${step.currentNum} − 1 = ${step.currentNum - 1}`}</strong>
            <span>{step.predecessorExists === null ? '等待检查' : step.predecessorExists ? '前驱存在 · 跳过' : '前驱不存在 · 是起点'}</span>
          </div>

          <div className={styles.sequenceCard}>
            <small>从起点向右扩展</small>
            <div>{step.sequence.length === 0 ? <em>找到起点后开始</em> : step.sequence.map((number, index) => <span key={number}>{index > 0 && <i>→</i>}<b>{number}</b></span>)}</div>
            <p>{step.probe === null || step.phase === 'check' || step.phase === 'skip' ? '检查 currentNum + 1' : `下一次检查：${step.probe}`}</p>
          </div>

          <div className={styles.metrics}>
            <span><small>currentStreak</small><b>{step.currentStreak}</b></span>
            <span data-best="true"><small>longestStreak</small><b>{step.longestStreak}</b></span>
          </div>
        </section>

        <div className={styles.phaseTrack}>
          {consecutivePhaseNames.map((phase, index) => <span data-active={activePhase === phase.id || undefined} key={phase.id}><b>{index + 1}</b>{phase.label}</span>)}
        </div>

        <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite">
          <span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span>
          <p>{step.message}</p>
        </div>
      </div>
    </AlgorithmPlayer>
  )
}
