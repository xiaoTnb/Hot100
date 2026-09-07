import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeSearchMatrixIISteps, searchMatrixIICode, searchMatrixIIMethods, searchMatrixInput, searchMatrixTarget } from './steps'
import styles from './visualizer.module.css'
export function Search2dMatrixIIVisualizer() {
  const steps = useMemo(() => makeSearchMatrixIISteps(), []), playback = usePlayback(steps.length, 1400), step = steps[playback.stepIndex]
  return <AlgorithmPlayer methods={searchMatrixIIMethods} activeMethod="elimination" onMethodChange={playback.reset} playback={playback} code={searchMatrixIICode} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.header}><span>起点：右上角</span><b>target = {searchMatrixTarget}</b><small>每轮排除一整行或一整列</small></div>
      <section className={styles.matrix}>{searchMatrixInput.map((row, i) => row.map((value, j) => <span data-active={i === step.row && j === step.col || undefined} data-eliminated={step.eliminatedRows.includes(i) || step.eliminatedCols.includes(j) || undefined} key={i + '-' + j}><b>{value}</b><small>[{i},{j}]</small></span>))}</section>
      <div className={styles.rule}><span data-active={step.phase === 'row' || undefined}><b>当前值 &lt; target</b><small>排除当前行，i++ ↓</small></span><span data-active={step.phase === 'col' || undefined}><b>当前值 &gt; target</b><small>排除当前列，j-- ←</small></span></div>
      <div className={styles.remaining}><span><small>已排除行</small><b>{step.eliminatedRows.length ? step.eliminatedRows.join(', ') : '无'}</b></span><span><small>已排除列</small><b>{step.eliminatedCols.length ? step.eliminatedCols.join(', ') : '无'}</b></span></div>
      <div className={'step-message ' + (step.phase === 'found' || step.phase === 'miss' ? 'success' : '')}><span>{step.phase === 'found' || step.phase === 'miss' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
