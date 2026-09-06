import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { mergeListA, mergeListB, mergeListCode, mergeListMethods, mergeListSteps } from './steps'
import styles from './visualizer.module.css'

function SourceList({ label, values, cursor, tone }: { label: string; values: number[]; cursor: number; tone: 'blue' | 'orange' }) {
  return <div className={styles.source}><b>{label}</b><div className={styles.nodes}>{values.map((value, index) => <span data-state={index < cursor ? 'used' : index === cursor ? 'current' : 'idle'} data-tone={tone} key={`${value}-${index}`}><i>{index === cursor ? label : ''}</i><strong>{value}</strong></span>)}<em>{cursor >= values.length ? 'null' : '→'}</em></div></div>
}

export function MergeTwoSortedListsVisualizer() {
  const playback = usePlayback(mergeListSteps.length, 1900)
  const step = mergeListSteps[playback.stepIndex] ?? mergeListSteps[0]
  const nextA = mergeListA[step.i]
  const nextB = mergeListB[step.j]

  return (
    <AlgorithmPlayer methods={mergeListMethods} activeMethod="merge" onMethodChange={playback.reset} playback={playback} code={mergeListCode} activeLineId={step.lineId}>
      <div className="animation-canvas">
        <div className={styles.decision} data-done={step.phase === 'done' || undefined}>
          <span>{nextA === undefined || nextB === undefined ? '剩余链段' : '当前比较'}</span>
          <b>{step.phase === 'done' ? '归并完成' : nextA === undefined ? `l2 → ${nextB ?? 'null'}` : nextB === undefined ? `l1 → ${nextA}` : `${nextA} ${nextA < nextB ? '<' : '≥'} ${nextB}`}</b>
          <small>{step.phase === 'pick' ? `选择 ${step.pickedFrom}` : step.phase === 'rest' ? '直接拼接' : 'cur 向后生长'}</small>
        </div>
        <div className={styles.sources}>
          <SourceList label="l1" values={mergeListA} cursor={step.i} tone="blue" />
          <SourceList label="l2" values={mergeListB} cursor={step.j} tone="orange" />
        </div>
        <div className={styles.output}>
          <header><span>合并后的链表</span><small>dummy → result</small></header>
          <div className={styles.resultNodes}><span className={styles.dummy}>dummy</span>{step.merged.map((value, index) => <span className={styles.resultNode} data-new={index === step.merged.length - 1 && step.phase !== 'done' || undefined} key={`${value}-${index}`}><i>→</i><b>{value}</b>{index === step.merged.length - 1 && <small>cur</small>}</span>)}{step.merged.length === 0 && <em>等待接入第一个节点</em>}</div>
        </div>
        <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}
