import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeSpiralSteps, spiralCode, spiralMethods } from './steps'
import styles from './visualizer.module.css'

export function SpiralMatrixVisualizer() {
  const steps = useMemo(() => makeSpiralSteps(), []), playback = usePlayback(steps.length, 900), step = steps[playback.stepIndex]
  const visited = new Set(step.answer)
  return <AlgorithmPlayer methods={spiralMethods} activeMethod="boundaries" onMethodChange={playback.reset} playback={playback} code={spiralCode} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.bounds}><span><small>top</small><b>{step.top}</b></span><span><small>bottom</small><b>{step.bottom}</b></span><span><small>left</small><b>{step.left}</b></span><span><small>right</small><b>{step.right}</b></span></div>
      <section className={styles.matrix} data-direction={step.direction}>{step.matrix.map((row, i) => row.map((value, j) => <span data-active={i === step.row && j === step.col || undefined} data-visited={visited.has(value) || undefined} data-top={i === step.top || undefined} data-bottom={i === step.bottom || undefined} data-left={j === step.left || undefined} data-right={j === step.right || undefined} key={value}><b>{value}</b><small>[{i},{j}]</small></span>))}</section>
      <div className={styles.direction}><span data-active={step.direction === 'right' || undefined}>→ 上边</span><span data-active={step.direction === 'down' || undefined}>↓ 右边</span><span data-active={step.direction === 'left' || undefined}>← 下边</span><span data-active={step.direction === 'up' || undefined}>↑ 左边</span></div>
      <section className={styles.answer}><header><b>ans</b><small>加入顺序</small></header><div>{step.answer.map((value, index) => <span data-latest={index === step.answer.length - 1 || undefined} key={index}>{value}</span>)}</div></section>
      <div className={'step-message ' + (step.direction === 'done' ? 'success' : '')}><span>{step.direction === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
