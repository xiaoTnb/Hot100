import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getRainCode, makeRainSteps, rainHeights, rainMethods, type RainCalculation, type RainMethod, type RainStep } from './steps'
import styles from './visualizer.module.css'

export function TrappingRainWaterVisualizer() {
  const [method, setMethod] = useState<RainMethod>('dp')
  const steps = useMemo(() => makeRainSteps(method), [method])
  const playback = usePlayback(steps.length, 1350)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as RainMethod); playback.reset() }

  return <AlgorithmPlayer methods={rainMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getRainCode(method)} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.rainHeader}><span>{method === 'dp' ? '左右最高柱预处理' : method === 'stack' ? '单调栈逐层填坑' : '双指针逐格结算'}</span><b>ans = {step.total}</b></div>
      <RainChart step={step} method={method} />
      {method === 'dp' && <DpPanel step={step} />}
      {method === 'stack' && <StackPanel step={step} />}
      {method === 'pointers' && <PointerPanel step={step} />}
      <CalculationPanel calculation={step.calculation} method={method} currentWater={step.currentWater} total={step.total} />
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function RainChart({ step, method }: { step: RainStep; method: RainMethod }) {
  return <div className={styles.chart}>{rainHeights.map((height, index) => {
    const role = method === 'stack' && step.basin[1] === index ? 'bottom' : step.left === step.right && index === step.left ? 'meet' : index === step.left ? 'left' : index === step.right ? 'right' : index === step.index ? 'current' : undefined
    const inBasin = step.basin.includes(index)
    return <div className={styles.column} data-role={role} data-basin={inBasin || undefined} data-active-index={method === 'pointers' && step.phase === 'collect' && index === step.index || undefined} key={index}>
      <span className={styles.pointer}>{role && <b>{role === 'meet' ? 'l = r' : role === 'bottom' ? 'top' : method === 'pointers' ? role === 'left' ? 'l' : role === 'right' ? 'r' : 'i' : role === 'current' ? 'i' : role === 'left' ? 'L' : 'R'}</b>}</span>
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
  return <div className={styles.stackPanel}><header><b>单调栈</b><small>保存下标 · 栈顶在右</small></header><p><b>弹出条件</b><code>height[i] &gt; height[stack.peek()]</code><span>当前柱比栈顶低点高，才可能封住它的右侧</span></p><div>{step.stack.length === 0 ? <em>空栈</em> : step.stack.map((index) => <span key={index}><small>下标 {index}</small><b>{rainHeights[index]}</b></span>)}</div></div>
}

function PointerPanel({ step }: { step: RainStep }) {
  const leftMax = Math.max(0, ...step.leftMax)
  const rightMax = Math.max(0, ...step.rightMax)
  return <div className={styles.pointerPanel}><div data-side="left"><small>leftMax</small><b>{leftMax}</b></div><p>{step.phase === 'done' ? '左右指针已经相遇' : <>正在结算下标 <b>i = {step.index}</b></>}<br /><span>闪烁的下标就是本轮加入 ans 的位置</span></p><div data-side="right"><small>rightMax</small><b>{rightMax}</b></div></div>
}

function CalculationPanel({ calculation, method, currentWater, total }: { calculation: RainCalculation | null; method: RainMethod; currentWater: number; total: number }) {
  if (!calculation) return <div className={styles.calculationEmpty}><span>{method === 'dp' ? '先填写左右最高柱，之后才能逐格计算水量' : method === 'stack' ? '只有当前柱高于栈顶柱时才弹栈；弹出后仍有左边界，才能计算积水' : '更新两侧最高柱后，从较低的一侧结算当前位置'}</span><b>累计 ans = {total}</b></div>
  if (calculation.kind === 'basin') return <div className={styles.calculationPanel}>
    <div className={styles.sources}>
      <span data-source="left"><small>左墙 L · 下标 {calculation.leftIndex}</small><b>height[L] = {calculation.leftHeight}</b></span>
      <span data-source="bottom"><small>坑底 top · 下标 {calculation.bottomIndex}</small><b>height[top] = {calculation.bottomHeight}</b></span>
      <span data-source="right"><small>当前柱 i（右边界）· 下标 {calculation.rightIndex}</small><b>height[i] = {calculation.rightHeight}</b></span>
    </div>
    <div className={styles.equationLine}><span>宽度：{calculation.rightIndex} − {calculation.leftIndex} − 1 = <b>{calculation.width}</b></span><i>×</i><span>本层水高：min({calculation.leftHeight}, {calculation.rightHeight}) − {calculation.bottomHeight} = <b>{calculation.waterHeight}</b></span><i>=</i><strong>新增 {currentWater}</strong><em>累计 {total}</em></div>
  </div>
  const level = calculation.side === 'left' ? calculation.leftMax : calculation.side === 'right' ? calculation.rightMax : Math.min(calculation.leftMax, calculation.rightMax)
  const sideLabel = calculation.side === 'left' ? 'leftMax（左侧历史最高）' : calculation.side === 'right' ? 'rightMax（右侧历史最高）' : 'min(leftMax, rightMax)'
  return <div className={styles.calculationPanel}>
    <div className={styles.sources}>
      <span data-source="left" data-muted={calculation.side === 'right' || undefined}><small>左侧最高柱</small><b>leftMax = {calculation.leftMax}</b></span>
      <span data-source="bottom"><small>当前柱</small><b>height[i] = {calculation.barHeight}</b></span>
      <span data-source="right" data-muted={calculation.side === 'left' || undefined}><small>右侧最高柱</small><b>rightMax = {calculation.rightMax}</b></span>
    </div>
    <div className={styles.equationLine}><span>可用水位：{sideLabel} = <b>{level}</b></span><i>−</i><span>当前柱高 = <b>{calculation.barHeight}</b></span><i>=</i><strong>当前位置 {currentWater}</strong><em>累计 {total}</em></div>
  </div>
}
