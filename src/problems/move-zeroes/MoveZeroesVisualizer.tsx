import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeMoveSteps, moveCode, moveMethods } from './steps'
import styles from './visualizer.module.css'

export function MoveZeroesVisualizer() {
  const steps = useMemo(() => makeMoveSteps(), [])
  const playback = usePlayback(steps.length, 1550)
  const step = steps[playback.stepIndex]

  return <AlgorithmPlayer methods={moveMethods} activeMethod="two-pointers" onMethodChange={playback.reset} playback={playback} code={moveCode} activeLineId={step.lineId} toolbarExtra={<span className={styles.inPlace}>原地修改 · 不复制数组</span>}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.legend}><span><i data-color="left" />left：已就位区末尾</span><span><i data-color="right" />right：正在检查</span><span><i data-color="settled" />绿色：已就位</span></div>
      <div className={styles.array}>
        {step.nums.map((number, index) => <div data-settled={index < step.left || undefined} data-left={index === step.left || undefined} data-right={index === step.right || undefined} data-swap={step.swapPair.includes(index) || undefined} data-zero={number === 0 || undefined} key={index}>
          <span className={styles.pointer}>{index === step.left && <b data-pointer="left">left</b>}{index === step.right && <b data-pointer="right">right</b>}</span>
          <strong>{number}</strong><small>{index}</small>
        </div>)}
        {step.right === step.nums.length && <div className={styles.exit}><span className={styles.pointer}><b data-pointer="right">right</b></span><strong>right = n</strong><small>{step.right} &lt; {step.nums.length} 为 false</small></div>}
      </div>
      <div className={styles.invariant}><span><b>{step.left}</b> 个</span><p><strong>left 左边</strong> 全部是保持原顺序的非零数</p><span><b>{step.nums.length - step.left}</b> 个</span><p><strong>left 右边</strong> 仍在处理或是被换出的零</p></div>
      <div className={styles.phaseTrack}>{['检查 right', '交换元素', '移动指针'].map((label, index) => <span data-active={step.phase !== 'done' && index === (step.phase === 'swap' ? 1 : step.phase === 'advance' ? 2 : 0) || undefined} key={label}><b>{index + 1}</b>{label}</span>)}</div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
