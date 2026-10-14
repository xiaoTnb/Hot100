import { useMemo, useState, type CSSProperties } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getLruCode, getLruSteps, lruMethods, type LruMethod } from './steps'
import styles from './visualizer.module.css'

export function LruCacheVisualizer(){
 const [method,setMethod]=useState<LruMethod>('manual')
 const steps=useMemo(()=>getLruSteps(method),[method])
 const playback=usePlayback(steps.length,2100)
 const step=steps[playback.stepIndex]??steps[0]
 const selectMethod=(id:string)=>{setMethod(id as LruMethod);playback.reset()}
 return <AlgorithmPlayer methods={lruMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getLruCode(method)} activeLineId={step.lineId}><div className="animation-canvas">
  <div className={styles.operation} data-phase={step.phase}><span>当前操作 · {method==='manual'?'手写结构':'LinkedHashMap'}</span><b>{step.operation}</b><small>返回 <strong>{step.result}</strong></small></div>
  <div className={styles.workspace}>
   <section className={styles.cache}><header><span>{method==='manual'?'循环双向链表':'accessOrder = true'}</span><small>capacity 2 · size {step.order.length}</small></header><div className={styles.axis}><b>MRU<br/>最新</b><i/><b>LRU<br/>最旧</b></div><div className={styles.chain}><em>HEAD</em>{[1,2,3,4].map(key=>{const slot=step.order.indexOf(key);const visible=slot>=0;return <span aria-hidden={!visible} data-visible={visible||undefined} data-active={step.active===key&&visible||undefined} style={{'--slot':slot} as CSSProperties} key={key}><i>↔</i><b><small>key {key}</small>{step.values[key]}</b></span>})}<em>TAIL</em>{step.evicted!==null&&<strong className={styles.evicted}>key {step.evicted} 淘汰</strong>}</div></section>
   <section className={styles.map}><header><span>{method==='manual'?'Map':'LinkedHashMap'}</span><small>{method==='manual'?'key → node':'key → value + 顺序'}</small></header><div>{Object.entries(step.values).map(([key,value])=><span data-active={step.active===Number(key)||undefined} key={key}><b>{key}</b><i>→</i><em>{method==='manual'? `Node(key=${key}, value=${value})` : value}</em></span>)}{Object.keys(step.values).length===0&&<p>空</p>}</div>{method==='manual'&&<aside>Node 必须保存 key：淘汰尾节点时，才能执行 Map.remove(backNode.key)</aside>}</section>
  </div>
  <div className={styles.capacity}><span>{step.order.length} / 2</span><i><b style={{width:`${step.order.length/2*100}%`}}/></i><small>{step.evicted!==null?`超容量 → 删除 key ${step.evicted}`:'容量正常'}</small></div>
  <div className={`step-message ${step.phase==='done'?'success':''}`} aria-live="polite"><span>{step.phase==='done'?<i className="check-symbol">✓</i>:String(playback.stepIndex+1).padStart(2,'0')}</span><p>{step.message}</p></div>
 </div></AlgorithmPlayer>
}
