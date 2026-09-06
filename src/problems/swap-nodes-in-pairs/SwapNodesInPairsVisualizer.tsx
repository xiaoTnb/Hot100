import type { CSSProperties } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { swapCode, swapMethods, swapSteps } from './steps'
import styles from './visualizer.module.css'
export function SwapNodesInPairsVisualizer() {
  const playback = usePlayback(swapSteps.length, 2100); const step = swapSteps[playback.stepIndex] ?? swapSteps[0]
  return <AlgorithmPlayer methods={swapMethods} activeMethod="iterative" onMethodChange={playback.reset} playback={playback} code={swapCode} activeLineId={step.lineId}><div className="animation-canvas">
    <div className={styles.phase}><span>当前动作</span><b>{step.phase === 'start' ? '建立 dummy' : step.phase === 'select' ? '保存相邻节点' : step.phase === 'swap' ? '重连 next' : step.phase === 'advance' ? '移动 cur' : '交换完成'}</b><small>{step.pair.length ? `处理 ${step.pair.join(' ↔ ')}` : '两节点一组'}</small></div>
    <div className={styles.scene}><div className={styles.list}><div className={styles.dummy}><i>{step.cur === 0 ? 'cur' : ''}</i>dummy</div>{[1,2,3,4].map((value) => { const slot = step.order.indexOf(value); return <div className={styles.wrap} data-pair={step.pair.includes(value) || undefined} data-cur={step.cur === value || undefined} style={{ '--slot': slot } as CSSProperties} key={value}><span>{step.cur === value ? 'cur' : step.pair[0] === value ? 'l1' : step.pair[1] === value ? 'l2' : ''}</span><b>{value}</b><small>node {value}</small></div> })}<div className={styles.arrows}>{step.order.map((value, index) => <span style={{ left: `${10 + index * 22}%` }} key={value}>{index === step.order.length - 1 ? '→ null' : '→'}</span>)}</div></div></div>
    <div className={styles.links}><span>① cur.next = l2</span><span>② l1.next = next</span><span>③ l2.next = l1</span></div>
    <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2,'0')}</span><p>{step.message}</p></div>
  </div></AlgorithmPlayer>
}
