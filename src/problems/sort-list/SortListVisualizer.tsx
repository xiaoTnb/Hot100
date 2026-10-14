import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getSortListCode, getSortListSteps, sortListMethods, type SortListMethod } from './steps'
import styles from './visualizer.module.css'

export function SortListVisualizer() {
  const [method, setMethod] = useState<SortListMethod>('top-down')
  const steps = useMemo(() => getSortListSteps(method), [method])
  const playback = usePlayback(steps.length, 2200)
  const step = steps[playback.stepIndex] ?? steps[0]
  const progress = method === 'bottom-up' ? Math.min(4, playback.stepIndex) : step.direction === 'down' ? step.level : step.direction === 'up' ? 3 : 4
  const selectMethod = (id: string) => { setMethod(id as SortListMethod); playback.reset() }

  return <AlgorithmPlayer methods={sortListMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getSortListCode(method)} activeLineId={step.lineId}>
    <div className="animation-canvas">
      <div className={styles.recursionRail}>
        {(method === 'top-down' ? ['完整链表', '二分子链', '单节点', '归并回升', '排序完成'] : ['统计长度', 'step = 1', '两两归并', 'step = 2', '排序完成']).map((label, index) => <span data-active={index === progress || undefined} data-passed={index < progress || undefined} key={label}><i>{index < progress ? '✓' : index + 1}</i>{label}</span>)}
      </div>
      <div className={styles.board} data-direction={step.direction}>
        <header><span>{method === 'top-down' ? step.direction === 'down' ? '递归拆分 ↓' : step.direction === 'up' ? '有序归并 ↑' : '排序结果' : step.direction === 'done' ? '迭代完成' : `自底向上 · step = ${step.stepSize}`}</span><small>{method === 'top-down' ? `递归层 depth = ${step.level}` : '循环切分相邻子链'}</small></header>
        {method === 'top-down' && step.pointers && <div className={styles.pointerState}><span data-pointer="pre">pre = <b>{step.pointers.pre ?? 'null'}</b></span><span data-pointer="slow">slow = <b>{step.pointers.slow ?? 'null'}</b></span><span data-pointer="fast">fast = <b>{step.pointers.fast ?? 'null'}</b></span></div>}
        <div className={styles.groups} data-pointers={Boolean(step.pointers) || undefined} data-cut={step.lineId === 'td-cut' || undefined}>
          {step.groups.map((group, groupIndex) => <div className={styles.group} style={{ animationDelay: `${groupIndex * 70}ms` }} key={`${group.join('-')}-${groupIndex}`}>
            <small>{method === 'top-down' ? group.length === 1 ? 'base case' : `sublist ${groupIndex + 1}` : `run ${groupIndex + 1} · len ${group.length}`}</small>
            <div>{group.map((value, index) => <span className={styles.node} data-active={step.active.includes(value) || undefined} key={`${value}-${index}`}><span className={styles.pointerTags}>{step.pointers?.pre === value && <i data-pointer="pre">pre</i>}{step.pointers?.slow === value && <i data-pointer="slow">slow</i>}{step.pointers?.fast === value && <i data-pointer="fast">fast</i>}</span><b>{value}</b>{index < group.length - 1 && <i className={styles.arrow}>→</i>}</span>)}</div>
          </div>)}
        </div>
        <div className={styles.explain}>{step.comparison ? <><span>当前比较</span><b>{step.comparison[0]}</b><i>{step.comparison[0] < step.comparison[1] ? '<' : '>'}</i><b>{step.comparison[1]}</b><strong>取较小节点</strong></> : <span>{method === 'top-down' ? step.pointers ? step.lineId === 'td-cut' ? 'pre.next = null · 左右子链正式断开' : 'slow 每轮走 1 步 · fast 每轮走 2 步' : step.direction === 'down' ? '继续递归拆分子链' : '所有节点已经有序' : step.stepSize === 0 ? 'getListLength(head) = 4' : `相邻长度 ${Math.min(step.stepSize ?? 1, 4)} 的子链两两归并`}</span>}</div>
      </div>
      <div className={`step-message ${step.direction === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.direction === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
