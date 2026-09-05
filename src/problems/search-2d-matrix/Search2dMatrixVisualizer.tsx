import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import styles from '../binary-search-shared/visualizer.module.css'
import { makeSearchMatrixSteps, searchMatrixCode, searchMatrixInput, searchMatrixMethods, searchMatrixTarget } from './steps'

export function Search2dMatrixVisualizer() {
  const steps = useMemo(() => makeSearchMatrixSteps(), [])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const columns = searchMatrixInput[0].length
  const found = step.phase === 'found'

  return <AlgorithmPlayer methods={searchMatrixMethods} activeMethod="flattened" onMethodChange={playback.reset} playback={playback} code={searchMatrixCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.input}><code>matrix = 3 × 4 有序矩阵</code><span>target <b>{searchMatrixTarget}</b></span></div>
      <div className={styles.matrix}>{searchMatrixInput.flat().map((number, index) => {
        const row = Math.floor(index / columns)
        const column = index % columns
        return <div className={styles.cell} data-in-range={index > step.left && index < step.right || undefined} data-discarded={index <= step.left || index >= step.right ? true : undefined} data-mid={index === step.mid || undefined} data-answer={found && index === step.mid || undefined} key={index}>
          <span>{index === step.mid && <b data-kind={found ? 'answer' : 'mid'}>{found ? '找到' : 'mid'}</b>}</span><strong>{number}</strong><small>[{row},{column}] · {index}</small>
        </div>
      })}</div>
      <div className={styles.matrixIndex}>线性下标 <b>{step.mid < 0 ? '—' : step.mid}</b> → row = ⌊mid / 4⌋ = <b>{step.row < 0 ? '—' : step.row}</b>，col = mid % 4 = <b>{step.column < 0 ? '—' : step.column}</b></div>
      <div className={styles.metrics}><section data-accent="blue"><small>left</small><b>{step.left}</b></section><section data-accent="orange"><small>right</small><b>{step.right}</b></section><section><small>matrix[row][col]</small><b>{step.value ?? '—'}</b></section><section data-accent={found ? 'green' : undefined}><small>查找结果</small><b>{found ? 'true' : '搜索中'}</b></section></div>
      <div className={styles.explain}><b>坐标映射</b><span>每行有 4 列，所以线性下标每跨过 4 个元素就进入下一行；商决定行，余数决定列。</span></div>
      <div className={`step-message ${found ? 'success' : ''}`} aria-live="polite"><span>{found ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
