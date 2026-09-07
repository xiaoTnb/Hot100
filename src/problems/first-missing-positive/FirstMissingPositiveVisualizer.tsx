import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeMissingSteps, missingCode, missingInput, missingMethods } from './steps'
import styles from './visualizer.module.css'

export function FirstMissingPositiveVisualizer() {
  const steps = useMemo(() => makeMissingSteps(), [])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  return <AlgorithmPlayer methods={missingMethods} activeMethod="placement" onMethodChange={playback.reset} playback={playback} code={missingCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <header className={styles.input}><b>nums = [{missingInput.join(', ')}]</b><small>动画额外加入重复的 1，用来展示防止死循环的判断</small></header>
      <section className={styles.classroom}>
        {step.nums.map((value, index) => {
          const active = index === step.index || index === step.scanIndex
          const target = index === step.targetIndex && step.targetIndex !== step.index
          const correct = value === index + 1
          return <div key={index} data-active={active || undefined} data-target={target || undefined} data-correct={correct || undefined}>
            <small>座位 {index + 1}</small><b>{value}</b><i>下标 {index}</i>
          </div>
        })}
      </section>
      <div className={styles.legend}><span data-kind="active">正在检查</span><span data-kind="target">应去的座位</span><span data-kind="correct">学号已归位</span></div>
      <section className={styles.decision}>
        <div><small>当前学号在 1…n 内</small><b data-pass={step.valid || undefined}>{step.index < 0 ? '等待' : step.valid ? '是' : '否'}</b></div>
        <strong>并且</strong>
        <div><small>目标座位不是相同学号</small><b data-pass={step.valid && !step.duplicate || undefined}>{step.index < 0 ? '等待' : !step.valid ? '无需判断' : step.duplicate ? '否（重复）' : '是'}</b></div>
      </section>
      <section className={styles.result}><small>当前答案</small><b>{step.answer === null ? '尚未确定' : step.answer}</b><span>{step.phase === 'missing' || step.phase === 'done' ? '第一个座位与学号不匹配' : '先完成原地归位，再从左向右检查'}</span></section>
      <div className={`step-message ${step.phase === 'missing' || step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'missing' || step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
