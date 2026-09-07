import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getZeroCode, makeZeroSteps, zeroMethods, type ZeroMethod } from './steps'
import styles from './visualizer.module.css'

export function SetMatrixZeroesVisualizer() {
  const [method, setMethod] = useState<ZeroMethod>('inplace')
  const steps = useMemo(() => makeZeroSteps(method), [method])
  const playback = usePlayback(steps.length, 1250), step = steps[playback.stepIndex]
  const change = (id: string) => { setMethod(id as ZeroMethod); playback.reset() }
  return <AlgorithmPlayer methods={zeroMethods} activeMethod={method} onMethodChange={change} playback={playback} code={getZeroCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.board}>
        <div className={styles.corner}>行 / 列</div>
        {step.colMarks.map((marked, j) => <div className={styles.colMark} data-marked={method === 'arrays' ? marked || undefined : step.matrix[0][j] === 0 || undefined} key={'c' + j}>{method === 'arrays' ? marked ? 'true' : 'false' : step.matrix[0][j]}</div>)}
        {step.matrix.map((row, i) => <div className={styles.row} key={i}>
          <div className={styles.rowMark} data-marked={method === 'arrays' ? step.rowMarks[i] || undefined : step.matrix[i][0] === 0 || undefined}>{method === 'arrays' ? step.rowMarks[i] ? 'true' : 'false' : step.matrix[i][0]}</div>
          {row.map((value, j) => <span data-active={i === step.row && j === step.col || undefined} data-axis={method === 'inplace' && (i === 0 || j === 0) || undefined} data-zero={value === 0 || undefined} key={j}><b>{value}</b><small>[{i},{j}]</small></span>)}
        </div>)}
      </div>
      <div className={styles.key}><b>{method === 'arrays' ? '独立标记数组' : '矩阵自身就是标记表'}</b><span>{method === 'arrays' ? '顶部是 colHasZero，左侧是 rowHasZero' : '第一行标记列，第一列标记行；原始首行首列状态单独保存'}</span></div>
      <div className={styles.flow}><span data-active={step.phase === 'scan' || undefined}>保存原始信息</span><span data-active={step.phase === 'mark' || undefined}>只记录 0 的行列</span><span data-active={step.phase === 'apply' || undefined}>根据标记写 0</span><span data-active={step.phase === 'first-col' || step.phase === 'first-row' || undefined}>最后处理首行首列</span></div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')}><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
