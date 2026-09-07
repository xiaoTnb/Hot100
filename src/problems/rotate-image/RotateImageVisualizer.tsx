import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getImageCode, imageMethods, makeImageSteps, type ImageMethod } from './steps'
import styles from './visualizer.module.css'
export function RotateImageVisualizer() {
  const [method, setMethod] = useState<ImageMethod>('two-pass'), steps = useMemo(() => makeImageSteps(method), [method]), playback = usePlayback(steps.length, 1250), step = steps[playback.stepIndex]
  const change = (id: string) => { setMethod(id as ImageMethod); playback.reset() }
  return <AlgorithmPlayer methods={imageMethods} activeMethod={method} onMethodChange={change} playback={playback} code={getImageCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.mapping}><span><b>(i, j)</b><small>原位置</small></span><i>转置 →</i><span><b>(j, i)</b><small>主对角线镜像</small></span><i>行翻转 →</i><span><b>(j, n−1−i)</b><small>顺时针目标</small></span></div>
      <section className={styles.matrix}>{step.matrix.map((row, i) => row.map((value, j) => { const active = step.a?.[0] === i && step.a[1] === j || step.b?.[0] === i && step.b[1] === j; return <span data-active={active || undefined} data-row={step.phase === 'reverse' && step.row === i || undefined} data-diagonal={i === j || undefined} key={i + '-' + j}><b>{value}</b><small>[{i},{j}]</small></span> }))}</section>
      <div className={styles.phases}><span data-active={step.phase === 'transpose' || undefined}>① 关于主对角线转置</span><span data-active={step.phase === 'reverse' || undefined}>② 每一行左右翻转</span><span data-active={step.phase === 'done' || undefined}>顺时针旋转 90°</span></div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')}><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
