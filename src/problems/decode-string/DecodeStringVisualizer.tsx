import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { decodeCode,decodeMethods,decodeSteps } from './steps'
import styles from './visualizer.module.css'
const source='3[a]2[bc]'
export function DecodeStringVisualizer(){const playback=usePlayback(decodeSteps.length,2100);const step=decodeSteps[playback.stepIndex]??decodeSteps[0];return <AlgorithmPlayer methods={decodeMethods} activeMethod="recursive" onMethodChange={playback.reset} playback={playback} code={decodeCode} activeLineId={step.lineId}><div className="animation-canvas">
 <div className={styles.source}><span>encoded</span><div>{[...source].map((char,index)=><b data-active={index>=step.range[0]&&index<=step.range[1]||undefined} data-cursor={index===step.cursor||undefined} key={index}>{char}<small>{index}</small></b>)}</div><em>balance <strong>{step.balance??'—'}</strong></em></div>
 <div className={styles.workspace}><section className={styles.callstack}><header><span>递归调用栈</span><small>depth {step.frames.length}</small></header><div>{step.frames.length===0?<p>调用栈已清空</p>:step.frames.map((frame,index)=><article style={{marginLeft:`${index*18}px`}} key={`${frame.label}-${index}`}><small>{frame.label}</small><b>{frame.source}</b>{frame.result&&<em>{frame.result}</em>}</article>)}</div></section><section className={styles.output} data-done={step.phase==='done'||undefined}><span>decoded</span><b>{step.output||'…'}</b><div>{[...step.output].map((char,index)=><i style={{animationDelay:`${index*35}ms`}} key={`${char}-${index}`}>{char}</i>)}</div></section></div>
 <div className={styles.rule}><span>字母 → 直接返回</span><i/><span>数字 → 找括号</span><i/><span>inner.repeat(k) + rest</span></div>
 <div className={`step-message ${step.phase==='done'?'success':''}`} aria-live="polite"><span>{step.phase==='done'?<i className="check-symbol">✓</i>:String(playback.stepIndex+1).padStart(2,'0')}</span><p>{step.message}</p></div>
 </div></AlgorithmPlayer>}
