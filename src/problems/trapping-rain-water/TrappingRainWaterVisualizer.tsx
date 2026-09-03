import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getRainCode, makeRainSteps, rainHeights, rainMethods, type RainMethod, type RainStep } from './steps'
import styles from './visualizer.module.css'

export function TrappingRainWaterVisualizer() {
  const [method, setMethod] = useState<RainMethod>('dp')
  const steps = useMemo(() => makeRainSteps(method), [method])
  const playback = usePlayback(steps.length, 1350)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as RainMethod); playback.reset() }

  return <AlgorithmPlayer methods={rainMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getRainCode(method)} activeLineId={step.lineId} toolbarExtra={<span className={styles.total}>ans = {step.total}</span>}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <RainChart step={step} method={method} />
      {method === 'dp' && <DpPanel step={step} />}
      {method === 'stack' && <StackPanel step={step} />}
      {method === 'pointers' && <PointerPanel step={step} />}
      <div className={styles.formula}><div><small>当前位置接水</small><b>{step.currentWater}</b></div><span>{method === 'stack' ? '宽度 × 新增水高' : 'min(左侧最高, 右侧最高) − 当前柱高'}</span><div data-total="true"><small>累计雨水</small><b>{step.total}</b></div></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function RainChart({ step, method }: { step: RainStep; method: RainMethod }) {
  return <div className={styles.chart}>{rainHeights.map((height, index) => {
    const role = index === step.left ? 'left' : index === step.right ? 'right' : index === step.index ? 'current' : undefined
    const inBasin = step.basin.includes(index)
    return <div className={styles.column} data-role={role} data-basin={inBasin || undefined} key={index}>
      <span className={styles.pointer}>{role && <b>{method === 'pointers' ? role === 'left' ? 'l' : role === 'right' ? 'r' : 'i' : role === 'current' ? 'i' : role === 'left' ? 'L' : 'R'}</b>}</span>
      <div><i style={{ height: `${height / 3 * 100}%` }} /><b style={{ bottom: `${height / 3 * 100}%`, height: `${step.waterAt[index] / 3 * 100}%` }} /></div>
      <strong>{height}</strong><small>{index}</small>
    </div>
  })}</div>
}

function DpPanel({ step }: { step: RainStep }) {
  const leftReady = (index: number) => step.phase !== 'left-max' || index <= step.index
  const rightReady = (index: number) => step.phase === 'right-max' ? index >= step.index : step.phase === 'collect' || step.phase === 'done'
  return <div className={styles.dpPanel}><ArrayRow label="leftMax" values={step.leftMax} ready={leftReady} active={step.phase === 'left-max' ? step.index : -1} /><ArrayRow label="rightMax" values={step.rightMax} ready={rightReady} active={step.phase === 'right-max' ? step.index : -1} /></div>
}

function ArrayRow({ label, values, ready, active }: { label: string; values: number[]; ready: (index: number) => boolean; active: number }) {
  return <div className={styles.auxRow}><b>{label}</b>{values.map((value, index) => <span data-active={index === active || undefined} key={index}>{ready(index) ? value : '·'}</span>)}</div>
}

function StackPanel({ step }: { step: RainStep }) {
  return <div className={styles.stackPanel}><header><b>单调栈</b><small>保存下标 · 栈顶在右</small></header><div>{step.stack.length === 0 ? <em>空栈</em> : step.stack.map((index) => <span key={index}><small>下标 {index}</small><b>{rainHeights[index]}</b></span>)}</div></div>
}

function PointerPanel({ step }: { step: RainStep }) {
  const leftMax = Math.max(0, ...step.leftMax)
  const rightMax = Math.max(0, ...step.rightMax)
  return <div className={styles.pointerPanel}><div data-side="left"><small>leftMax</small><b>{leftMax}</b></div><p>每次结算较低的一侧<br /><span>该侧水位已经确定</span></p><div data-side="right"><small>rightMax</small><b>{rightMax}</b></div></div>
}
