import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { sortListCode, sortListMethods, sortListSteps } from './steps'
import styles from './visualizer.module.css'

export function SortListVisualizer() {
  const playback = usePlayback(sortListSteps.length, 2200)
  const step = sortListSteps[playback.stepIndex] ?? sortListSteps[0]
  const progress = step.direction === 'down' ? step.level : step.direction === 'up' ? 3 : 4
  return (
    <AlgorithmPlayer methods={sortListMethods} activeMethod="merge-sort" onMethodChange={playback.reset} playback={playback} code={sortListCode} activeLineId={step.lineId}>
      <div className="animation-canvas">
        <div className={styles.recursionRail}>
          {['完整链表', '二分子链', '单节点', '归并回升', '排序完成'].map((label, index) => <span data-active={index === progress || undefined} data-passed={index < progress || undefined} key={label}><i>{index < progress ? '✓' : index + 1}</i>{label}</span>)}
        </div>
        <div className={styles.board} data-direction={step.direction}>
          <header><span>{step.direction === 'down' ? '递归拆分 ↓' : step.direction === 'up' ? '有序归并 ↑' : '排序结果'}</span><small>递归层 depth = {step.level}</small></header>
          <div className={styles.groups}>
            {step.groups.map((group, groupIndex) => <div className={styles.group} style={{ animationDelay: `${groupIndex * 70}ms` }} key={`${group.join('-')}-${groupIndex}`}>
              <small>{group.length === 1 ? 'base case' : `sublist ${groupIndex + 1}`}</small>
              <div>{group.map((value, index) => <span data-active={step.active.includes(value) || undefined} key={`${value}-${index}`}><b>{value}</b>{index < group.length - 1 && <i>→</i>}</span>)}</div>
            </div>)}
          </div>
          <div className={styles.explain}>{step.comparison ? <><span>当前比较</span><b>{step.comparison[0]}</b><i>{step.comparison[0] < step.comparison[1] ? '<' : '>'}</i><b>{step.comparison[1]}</b><strong>取较小节点</strong></> : <><span>{step.direction === 'down' ? 'slow 定位中点 · pre.next = null' : '所有节点已经有序'}</span></>}</div>
        </div>
        <div className={`step-message ${step.direction === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.direction === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}
