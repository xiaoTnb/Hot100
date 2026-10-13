import type { CSSProperties } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { kGroupCode, kGroupMethods, kGroupSteps } from './steps'
import styles from './visualizer.module.css'

export function ReverseNodesKGroupVisualizer() {
  const playback = usePlayback(kGroupSteps.length, 1800)
  const step = kGroupSteps[playback.stepIndex] ?? kGroupSteps[0]
  return <AlgorithmPlayer methods={kGroupMethods} activeMethod="count-first" onMethodChange={playback.reset} playback={playback} code={kGroupCode} activeLineId={step.lineId}>
    <div className="animation-canvas">
      <div className={styles.status}><span>k = 2</span><b>{step.phase === 'count' ? '统计长度' : step.phase === 'done' ? '不足 k，结束' : step.phase.startsWith('reconnect') ? '接回主链' : '组内反转'}</b><small>lastTail = {step.lastTail === 0 ? 'dummy' : step.lastTail}</small></div>
      <div className={styles.scene}><div className={styles.list}><div className={styles.dummy}>dummy</div>{[1,2,3,4,5].map((value) => <div className={styles.nodeWrap} data-group={step.group.includes(value) || undefined} data-fixed={step.fixed.includes(value) || undefined} data-pre={step.pre === value || undefined} data-cur={step.cur === value || undefined} style={{'--slot': step.order.indexOf(value)} as CSSProperties} key={value}><div className={styles.pointers}>{step.pre === value && <span>pre</span>}{step.cur === value && <em>cur</em>}{step.next === value && <i>nxt</i>}</div><b>{value}</b><small>node {value}</small></div>)}<div className={styles.arrows}>{step.order.map((value,index)=><span style={{left:`${18 + index * 16}%`}} key={value}>{index < 4 ? '→' : '→ null'}</span>)}</div></div></div>
      <div className={styles.legend}><span>浅橙：当前 k 组</span><span>浅绿：已固定</span><b>每次只改写一个 next</b></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`}><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2,'0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
