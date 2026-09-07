import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getMergeListCode, makeMergeListSteps, mergeListA, mergeListB, mergeListMethods, type MergeListMethod } from './steps'
import styles from './visualizer.module.css'
function SourceList({ label, values, cursor, tone }: { label: string; values: number[]; cursor: number; tone: 'blue' | 'orange' }) { return <div className={styles.source}><b>{label}</b><div className={styles.nodes}>{values.map((value, index) => <span data-state={index < cursor ? 'used' : index === cursor ? 'current' : 'idle'} data-tone={tone} key={value + '-' + index}><i>{index === cursor ? label : ''}</i><strong>{value}</strong></span>)}<em>{cursor >= values.length ? 'null' : '→'}</em></div></div> }
export function MergeTwoSortedListsVisualizer() {
  const [method, setMethod] = useState<MergeListMethod>('iterative'), steps = useMemo(() => makeMergeListSteps(method), [method]), playback = usePlayback(steps.length, 1750), step = steps[playback.stepIndex]
  const change = (id: string) => { setMethod(id as MergeListMethod); playback.reset() }, nextA = mergeListA[step.i], nextB = mergeListB[step.j]
  return <AlgorithmPlayer methods={mergeListMethods} activeMethod={method} onMethodChange={change} playback={playback} code={getMergeListCode(method)} activeLineId={step.lineId}>
    <div className="animation-canvas">
      <div className={styles.decision} data-done={step.phase === 'done' || undefined}><span>{method === 'recursive' ? '递归状态' : nextA === undefined || nextB === undefined ? '剩余链段' : '当前比较'}</span><b>{step.phase === 'done' ? '归并完成' : method === 'recursive' ? step.phase === 'unwind' ? '设置 next 并返回头节点' : step.phase === 'base' ? '遇到 null' : '选择较小头节点' : nextA === undefined ? 'l2 → ' + (nextB ?? 'null') : nextB === undefined ? 'l1 → ' + nextA : nextA + ' ' + (nextA < nextB ? '<' : '≥') + ' ' + nextB}</b><small>{step.phase === 'pick' || step.phase === 'call' ? '选择 ' + step.pickedFrom : step.phase === 'rest' || step.phase === 'base' ? '直接返回剩余段' : method === 'recursive' ? '递归归程' : 'cur 向后生长'}</small></div>
      {method === 'recursive' && <div className={styles.stack}><b>调用栈</b><div>{step.stack.length ? step.stack.map((item, index) => <span key={index}>{item}</span>) : <em>空</em>}</div></div>}
      <div className={styles.sources}><SourceList label="l1" values={mergeListA} cursor={step.i} tone="blue"/><SourceList label="l2" values={mergeListB} cursor={step.j} tone="orange"/></div>
      <div className={styles.output}><header><span>合并后的链表</span><small>{method === 'iterative' ? 'dummy → result' : '递归返回值'}</small></header><div className={styles.resultNodes}>{method === 'iterative' && <span className={styles.dummy}>dummy</span>}{step.merged.map((value, index) => <span className={styles.resultNode} data-new={index === 0 && step.phase === 'unwind' || index === step.merged.length - 1 && step.phase !== 'done' && method === 'iterative' || undefined} key={value + '-' + index}><i>→</i><b>{value}</b>{index === step.merged.length - 1 && method === 'iterative' && <small>cur</small>}</span>)}{step.merged.length === 0 && <em>{method === 'recursive' ? '递归到底后才开始形成结果' : '等待接入第一个节点'}</em>}</div></div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')}><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
