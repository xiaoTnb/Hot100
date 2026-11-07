import { useMemo,useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getInorderCode,getInorderSteps,inorderMethods,type InorderMethod } from './steps'
import styles from './visualizer.module.css'

export function BinaryTreeInorderTraversalVisualizer(){
 const [method,setMethod]=useState<InorderMethod>('recursive')
 const steps=useMemo(()=>getInorderSteps(method),[method])
 const playback=usePlayback(steps.length,2100)
 const step=steps[playback.stepIndex]??steps[0]
 const selectMethod=(id:string)=>{setMethod(id as InorderMethod);playback.reset()}
 return <AlgorithmPlayer methods={inorderMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getInorderCode(method)} activeLineId={step.lineId}><div className="animation-canvas">
  <div className={styles.order}><span>中序规则</span><b>左子树</b><i>→</i><b>根节点</b><i>→</i><b>右子树</b><small>{method==='morris'?'临时线索用后立即删除':'子调用结束后，回到上一层继续执行'}</small></div>
  <div className={styles.workspace}>
   <section className={styles.tree}><header>root = [1, null, 2, 3]</header><svg viewBox="0 0 600 260" role="img" aria-label="二叉树遍历状态">
    <defs><marker id="threadArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" /></marker></defs>
    <path className={styles.edge} d="M190 70 L370 110"/><path className={styles.edge} d="M370 140 L325 185"/>
    {step.thread&&<path className={styles.thread} d="M335 205 C455 230 475 120 420 115" markerEnd="url(#threadArrow)"/>}
    {[[1,170,55],[2,390,120],[3,310,205]].map(([value,x,y])=><g className={styles.node} data-active={step.active===value||undefined} data-visited={step.visited.includes(value)||undefined} transform={`translate(${x} ${y})`} key={value}><circle r="27"/><text>{value}</text></g>)}
    {step.thread&&<text className={styles.threadLabel} x="420" y="225">pre.right = root</text>}
   </svg></section>
   <section className={styles.state}><header>{method==='recursive'?'递归调用过程':'Morris 状态'}</header>{method==='recursive'?<div className={styles.recursion}><p>程序自动保存每层的执行位置，无需在代码中创建 Stack。</p><div className={styles.calls}>{step.stack.length?step.stack.map((value,index)=><div className={styles.call} data-current={index===step.stack.length-1||undefined} key={`${value}-${index}`}><b>dfs({value})</b><small>{index===step.stack.length-1?'正在执行':`等待${value===1?'右':'左'}子调用返回`}</small></div>):<em>所有递归调用已返回</em>}</div></div>:<div className={styles.morris}><b>{step.thread?'临时线索存在':'没有临时线索'}</b><span>{step.phase==='restore'?'正在恢复 3.right = null':'额外空间保持 O(1)'}</span></div>}<footer><small>ans</small><div>{step.visited.map((value,index)=><b key={`${value}-${index}`}>{value}</b>)}{step.visited.length===0&&<em>[]</em>}</div></footer></section>
  </div>
  <div className={`step-message ${step.phase==='done'?'success':''}`} aria-live="polite"><span>{step.phase==='done'?<i className="check-symbol">✓</i>:String(playback.stepIndex+1).padStart(2,'0')}</span><p>{step.message}</p></div>
 </div></AlgorithmPlayer>
}
