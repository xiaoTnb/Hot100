import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { heights, makeWaterSteps, waterCode, waterMethods } from './steps'
import styles from './visualizer.module.css'

export function MaxWaterVisualizer() {
  const steps = useMemo(() => makeWaterSteps(), [])
  const playback = usePlayback(steps.length, 1750)
  const step = steps[playback.stepIndex]
  const waterLevel = step.phase === 'done' ? 0 : Math.min(heights[step.l], heights[step.r])
  const left = ((step.l + .5) / heights.length) * 100
  const right = 100 - ((step.r + .5) / heights.length) * 100

  return <AlgorithmPlayer methods={waterMethods} activeMethod="two-pointers" onMethodChange={playback.reset} playback={playback} code={waterCode} activeLineId={step.lineId} toolbarExtra={<span className={styles.best}>max = {step.best}</span>}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.chart}>
        {step.phase !== 'done' && <div className={styles.water} style={{ left: `${left}%`, right: `${right}%`, height: `${(waterLevel / 8) * 100}%` }}><span>area = {step.area}</span></div>}
        <div className={styles.bars}>{heights.map((height, index) => <div className={styles.slot} key={index}>
          <span className={styles.pointer}>{index === step.l && <b data-side="left">l</b>}{index === step.r && <b data-side="right">r</b>}</span>
          <i data-boundary={(index === step.l || index === step.r) || undefined} data-moving={(step.moving === 'left' && index === step.l || step.moving === 'right' && index === step.r) || undefined} style={{ height: `${(height / 8) * 100}%` }}><strong>{height}</strong></i>
          <small>{index}</small>
        </div>)}</div>
      </div>

      <div className={styles.calculation}>
        <div><small>高度（短边）</small><strong>min({step.phase === 'done' ? '—' : `${heights[step.l]}, ${heights[step.r]}`})</strong><b>{waterLevel || '—'}</b></div>
        <span>×</span>
        <div><small>宽度</small><strong>{step.phase === 'done' ? 'r = l' : `${step.r} − ${step.l}`}</strong><b>{step.phase === 'done' ? '—' : step.r - step.l}</b></div>
        <span>=</span>
        <div data-area="true"><small>当前面积</small><strong>area</strong><b>{step.phase === 'done' ? '—' : step.area}</b></div>
        <div data-best="true"><small>历史最大</small><strong>ans</strong><b>{step.best}</b></div>
      </div>

      <div className={styles.rule} data-side={step.moving ?? 'none'}><b>{step.moving === 'left' ? '移动左边' : step.moving === 'right' ? '移动右边' : step.phase === 'done' ? '完成' : '先计算面积'}</b><span>移动较高的一边不能抬高水面，只会让宽度变小，所以淘汰较短边。</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
