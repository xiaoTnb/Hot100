import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { copyCode,copyMethods,copyRandom,copySteps,copyValues } from './steps'
import styles from './visualizer.module.css'
export function CopyRandomListVisualizer(){const playback=usePlayback(copySteps.length,2100);const step=copySteps[playback.stepIndex]??copySteps[0];const split=step.phase==='split'||step.phase==='done';return <AlgorithmPlayer methods={copyMethods} activeMethod="weave" onMethodChange={playback.reset} playback={playback} code={copyCode} activeLineId={step.lineId}><div className="animation-canvas">
 <div className={styles.phases}>{['复制并插入','设置 random','拆分链表'].map((x,i)=>{const p=step.phase==='start'||step.phase==='weave'?0:step.phase==='random'?1:2;return <span data-active={p===i||undefined} data-done={p>i||undefined} key={x}><i>{p>i?'✓':i+1}</i>{x}</span>})}</div>
 <div className={styles.board} data-split={split||undefined}>
  <header><span>{split?'原链表 · 已恢复':'工作链表'}</span><small>{step.phase==='weave'?'O / C 交错排列':step.phase==='random'?'副本 random 指向副本':split?'两条独立链表':'等待复制'}</small></header>
  <div className={styles.chain}>{copyValues.map((v,i)=><span className={styles.original} data-active={step.active===i||undefined} key={`o${i}`}><b>{v}</b><small>O{i}</small>{!split&&i<step.count&&<><i>→</i><em><b>{v}</b><small>C{i}</small></em></>}</span>)}</div>
  {split&&<div className={styles.copyChain}>{copyValues.map((v,i)=><span data-active={step.active===i||undefined} key={`c${i}`}><b>{v}</b><small>C{i}</small><i>{i<4?'→':'null'}</i></span>)}</div>}
 </div>
 <div className={styles.randomMap}>{copyValues.map((v,i)=><span data-ready={(step.phase==='random'||split)&&i<step.count||undefined} data-active={step.active===i||undefined} key={i}><b>{split?'C':'O'}{i}</b><i>random</i><em>→ {copyRandom[i]===null?'null':`${split?'C':'O'}${copyRandom[i]}`}</em></span>)}</div>
 <div className={`step-message ${step.phase==='done'?'success':''}`} aria-live="polite"><span>{step.phase==='done'?<i className="check-symbol">✓</i>:String(playback.stepIndex+1).padStart(2,'0')}</span><p>{step.message}</p></div>
 </div></AlgorithmPlayer>}
