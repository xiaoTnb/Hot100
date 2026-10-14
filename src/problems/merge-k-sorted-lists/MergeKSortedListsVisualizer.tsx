import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getMergeKCode,getMergeKSteps,mergeKMethods,type MergeKMethod } from './steps'
import styles from './visualizer.module.css'

export function MergeKSortedListsVisualizer(){
 const [method,setMethod]=useState<MergeKMethod>('heap')
 const steps=useMemo(()=>getMergeKSteps(method),[method])
 const playback=usePlayback(steps.length,2100)
 const step=steps[playback.stepIndex]??steps[0]
 const selectMethod=(id:string)=>{setMethod(id as MergeKMethod);playback.reset()}
 return <AlgorithmPlayer methods={mergeKMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getMergeKCode(method)} activeLineId={step.lineId}><div className="animation-canvas">
  <div className={styles.status}><span>{method==='heap'?'候选头节点':method==='recursive'?'递归区间':'列表槽位'}</span><b>{method==='iterative'?`step = ${step.stepSize}`:step.range??(step.phase==='done'?'合并完成':'K = 3')}</b><small>{step.phase==='done'?'返回升序链表':'一次只解决一个较小问题'}</small></div>
  <div className={styles.board}>
   <section className={styles.sources}><header>lists</header>{step.lists.map((list,index)=><div data-empty={!list||undefined} key={index}><small>list {index}</small>{list?list.map((value,i)=><span key={`${index}-${i}`}><b>{value}</b>{i<list.length-1&&<i>→</i>}</span>):<em>已合并</em>}</div>)}</section>
   {method==='heap'?<section className={styles.heap}><header>PriorityQueue · 堆顶最小</header><div>{step.heap.map((item,index)=><span data-top={index===0||undefined} key={`${item.source}-${item.value}-${index}`}><b>{item.value}</b><small>来自 list {item.source}</small></span>)}{step.heap.length===0&&<em>等待候选</em>}</div></section>:<section className={styles.divide}><header>{method==='recursive'?'分治树':'倍增轨道'}</header><div><span>lists[0]</span><i>{method==='recursive'?'区间二分':'step *= 2'}</i><span>{step.range??`step ${step.stepSize}`}</span></div></section>}
  </div>
  <div className={styles.result}><span>result</span><div>{step.result.map((value,index)=><b key={`${value}-${index}`}>{value}</b>)}{step.result.length===0&&<em>尚未接入节点</em>}</div></div>
  <div className={`step-message ${step.phase==='done'?'success':''}`} aria-live="polite"><span>{step.phase==='done'?<i className="check-symbol">✓</i>:String(playback.stepIndex+1).padStart(2,'0')}</span><p>{step.message}</p></div>
 </div></AlgorithmPlayer>
}
