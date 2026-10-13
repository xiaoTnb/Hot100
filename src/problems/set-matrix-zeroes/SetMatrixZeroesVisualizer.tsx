import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getZeroCode, makeZeroSteps, zeroInput, zeroMethods, type ZeroMethod } from './steps'
import styles from './visualizer.module.css'

export function SetMatrixZeroesVisualizer() {
  const [method, setMethod] = useState<ZeroMethod>('inplace')
  const steps = useMemo(() => makeZeroSteps(method), [method])
  const playback = usePlayback(steps.length, 1250), step = steps[playback.stepIndex]
  const change = (id: string) => { setMethod(id as ZeroMethod); playback.reset() }
  return <AlgorithmPlayer methods={zeroMethods} activeMethod={method} onMethodChange={change} playback={playback} code={getZeroCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.board}>
        <div className={styles.corner}>矩阵</div>
        {step.matrix[0].map((_, j) => <div className={styles.axisLabel} key={'c' + j}>列 {j}</div>)}
        {step.matrix.map((row, i) => <div className={styles.row} key={i}>
          <div className={styles.axisLabel}>行 {i}</div>
          {row.map((value, j) => {
            const isAxis = method === 'inplace' && (i === 0 || j === 0)
            const isOriginalZero = zeroInput[i][j] === 0
            const isMarker = isAxis && value === 0 && !isOriginalZero
            const markerActive = method === 'inplace' && step.phase === 'mark' && (i === step.row && j === 0 || i === 0 && j === step.col)
            const markerLabel = isOriginalZero ? '原始 0' : isMarker ? i === 0 ? `列 ${j} 标记` : `行 ${i} 标记` : ''
            return <span data-active={i === step.row && j === step.col || undefined} data-axis={isAxis || undefined} data-marker={isMarker || undefined} data-marker-active={markerActive || undefined} data-origin-zero={isOriginalZero || undefined} data-zero={value === 0 || undefined} key={j}><b>{value}</b><small>matrix[{i}][{j}]</small>{markerLabel && <em>{markerLabel}</em>}</span>
          })}
        </div>)}
      </div>
      {method === 'arrays' ? <div className={styles.markerArrays}>
        <MarkerArray label="rowHasZero[]" itemLabel="行" values={step.rowMarks} />
        <MarkerArray label="colHasZero[]" itemLabel="列" values={step.colMarks} />
      </div> : <div className={styles.edgeFlags}>
        <section data-on={step.firstRow || undefined}><small>boolean firstRowHasZero</small><b>{String(step.firstRow)}</b><span>保存第一行原本是否含 0</span></section>
        <section data-on={step.firstCol || undefined}><small>boolean firstColHasZero</small><b>{String(step.firstCol)}</b><span>保存第一列原本是否含 0</span></section>
      </div>}
      <div className={styles.key}><b>{method === 'arrays' ? 'true / false 存在哪里？' : '为什么首行首列会变成 0？'}</b><span>{method === 'arrays' ? '它们存放在矩阵之外新建的两个 boolean[] 中；第 i 格只负责记录第 i 行或列是否需要清零。' : '内部发现 matrix[i][j] = 0 时，把 matrix[i][0] 改成 0 作为“第 i 行标记”，把 matrix[0][j] 改成 0 作为“第 j 列标记”。'}</span></div>
      <div className={styles.flow}>{method === 'arrays' ? <><span data-active={step.phase === 'init' || undefined}>① 创建全 false 标记数组</span><span data-active={step.phase === 'scan' || undefined}>② 按行逐格扫描</span><span data-active={step.phase === 'mark' || undefined}>③ 遇到原始 0 写 true</span><span data-active={step.phase === 'apply' || undefined}>④ 根据 true 写 0</span></> : <><span data-active={step.phase === 'init' || step.phase === 'edge-scan' || undefined}>① 保存首行首列原始状态</span><span data-active={step.phase === 'scan' || undefined}>② 按行扫描内部格</span><span data-active={step.phase === 'mark' || undefined}>③ 把 0 写进首行首列作标记</span><span data-active={step.phase === 'apply' || step.phase === 'first-col' || step.phase === 'first-row' || undefined}>④ 按标记清零</span></>}</div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')}><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function MarkerArray({ label, itemLabel, values }: { label: string; itemLabel: string; values: boolean[] }) {
  return <section><header><b>{label}</b><span>独立的 boolean[]</span></header><div>{values.map((value, index) => <i data-marked={value || undefined} key={index}><small>{itemLabel} {index}</small><strong>{String(value)}</strong></i>)}</div></section>
}
