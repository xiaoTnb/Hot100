import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeTemperatureSteps,temperatureCode,temperatureMethods,temperatures } from './steps'
import styles from './visualizer.module.css'
export function DailyTemperaturesVisualizer(){const steps=useMemo(()=>makeTemperatureSteps(),[]);const playback=usePlayback(steps.length,1150);const step=steps[playback.stepIndex]??steps[0];return <AlgorithmPlayer methods={temperatureMethods} activeMethod="mono-stack" onMethodChange={playback.reset} playback={playback} code={temperatureCode} activeLineId={step.lineId}><div className="animation-canvas">
 <div className={styles.direction}><span>扫描方向</span><b>← 从右向左</b><i/><small>{step.phase==='pop'?'弹出较冷候选':step.phase==='resolve'?'计算下标差':step.phase==='push'?'当前日入栈':step.phase==='done'?'完成':'读取当前温度'}</small></div>
 <div className={styles.chart}>{temperatures.map((t,i)=><div data-current={i===step.i||undefined} data-stack={step.stack.includes(i)||undefined} data-warmer={i===step.warmer||undefined} data-popped={i===step.popped||undefined} key={i}><span style={{height:`${38+(t-69)*8}px`}}><b>{t}°</b></span><small>day {i}</small><em>{step.answers[i]||'·'}</em></div>)}</div>
 <div className={styles.lower}><section><header>单调栈 <small>底 → 顶</small></header><div>{step.stack.map(i=><span data-top={i===step.stack.at(-1)||undefined} key={i}><b>{i}</b><small>{temperatures[i]}°</small></span>)}{step.stack.length===0&&<em>空栈</em>}</div></section><section><header>answer</header><div className={styles.answers}>{step.answers.map((x,i)=><span data-ready={i>step.i||step.phase==='done'||undefined} key={i}><b>{x}</b><small>{i}</small></span>)}</div></section></div>
 <div className={`step-message ${step.phase==='done'?'success':''}`} aria-live="polite"><span>{step.phase==='done'?<i className="check-symbol">✓</i>:String(playback.stepIndex+1).padStart(2,'0')}</span><p>{step.message}</p></div>
 </div></AlgorithmPlayer>}
