import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { minStackCode,minStackMethods,minStackSteps } from './steps'
import styles from './visualizer.module.css'
export function MinStackVisualizer(){const playback=usePlayback(minStackSteps.length,2000);const step=minStackSteps[playback.stepIndex]??minStackSteps[0];const top=step.stack.at(-1);return <AlgorithmPlayer methods={minStackMethods} activeMethod="paired" onMethodChange={playback.reset} playback={playback} code={minStackCode} activeLineId={step.lineId}><div className="animation-canvas">
 <div className={styles.operation} data-phase={step.phase}><span>当前操作</span><b>{step.operation}</b><small>输出 <strong>{step.result}</strong></small></div>
 <div className={styles.board}><section className={styles.stack}><header><span>STACK</span><small>top ↑</small></header><div className={styles.frames}>{[...step.stack].reverse().map(([value,min],index)=><div data-sentinel={index===step.stack.length-1||undefined} data-top={index===0||undefined} key={`${value}-${min}-${index}`}><i>{index===0?'TOP':''}</i><span><small>value</small><b>{value}</b></span><span><small>current min</small><b>{min}</b></span></div>)}</div></section><section className={styles.readout}><div><span>top()</span><b>{step.stack.length>1?top?.[0]:'—'}</b></div><div className={styles.minimum}><span>getMin()</span><b>{step.stack.length>1?top?.[1]:'∞'}</b></div><p>最小值始终跟随栈顶帧，无需额外扫描。</p></section></div>
 <div className={`step-message ${step.phase==='done'?'success':''}`} aria-live="polite"><span>{step.phase==='done'?<i className="check-symbol">✓</i>:String(playback.stepIndex+1).padStart(2,'0')}</span><p>{step.message}</p></div>
 </div></AlgorithmPlayer>}
