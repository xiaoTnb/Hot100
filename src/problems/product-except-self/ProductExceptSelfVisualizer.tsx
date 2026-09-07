import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getProductCode, makeProductSteps, productMethods, productNumbers, type ProductMethod } from './steps'
import styles from './visualizer.module.css'

export function ProductExceptSelfVisualizer() {
  const [method, setMethod] = useState<ProductMethod>('optimized')
  const steps = useMemo(() => makeProductSteps(method), [method])
  const playback = usePlayback(steps.length, 1450)
  const step = steps[playback.stepIndex]
  const leftValues = step.index >= 0 ? productNumbers.slice(0, step.index) : []
  const rightValues = step.index >= 0 ? productNumbers.slice(step.index + 1) : []
  const leftProduct = leftValues.reduce((product, value) => product * value, 1)
  const preEnd = step.phase === 'pre-move' ? step.index + 1 : Math.max(step.index, 0)
  const preFactors = productNumbers.slice(0, preEnd)
  const preEquation = ['1', ...preFactors.map(String)].join(' × ')
  const selectMethod = (id: string) => { setMethod(id as ProductMethod); playback.reset() }
  return <AlgorithmPlayer methods={productMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getProductCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.matrix}>
        <ArrayRow label="nums" values={productNumbers} activeIndex={step.index} />
        <ArrayRow label={method === 'arrays' ? 'pre' : 'pre 轨迹'} values={step.pre} activeIndex={method === 'arrays' ? step.phase === 'pre' || step.phase === 'pre-seed' ? step.index : -1 : step.phase === 'pre-move' && step.index + 1 < productNumbers.length ? step.index + 1 : step.phase === 'pre-seed' || step.phase === 'answer' ? step.index : -1} trace={method === 'optimized'} />
        <ArrayRow label={method === 'arrays' ? 'suf' : 'suf → ans'} values={step.suf} activeIndex={step.phase === 'suf' || step.phase === 'suf-seed' || method === 'optimized' && step.phase === 'answer' ? step.index : -1} answer={method === 'optimized'} reused={method === 'optimized'} finalThrough={step.phase === 'answer' || step.phase === 'pre-move' || step.phase === 'done' ? step.index : -1} />
        {method === 'arrays' && <ArrayRow label="ans" values={step.answer} activeIndex={step.phase === 'answer' ? step.index : -1} answer />}
      </div>
      {method === 'optimized' && <div className={styles.storageGuide}>
        <section><b>suf[]</b><span>一个数组</span><small>先存每个位置的右积，再直接覆盖成最终答案</small></section>
        <section><b>pre</b><span>一个整数变量</span><small>上方 pre 轨迹只是把每轮变量值展开，Java 代码没有创建 pre[]</small></section>
      </div>}
      {method === 'optimized' && step.phase.startsWith('suf') && <div className={styles.sideLesson}>
        <small>suf[{step.index}] 只记录 nums[{step.index}] 右边</small>
        <b>{rightValues.length ? rightValues.join(' × ') : '右边为空，记作 1'}</b>
        <strong>= {step.index === productNumbers.length - 1 ? 1 : step.rightProduct}</strong>
      </div>}
      {method === 'optimized' && (step.phase === 'pre-seed' || step.phase === 'answer' || step.phase === 'pre-move') && <>
        <div className={styles.split}>
          <section><small>左边（pre）</small><b>{leftValues.length ? leftValues.join(' × ') : '空乘积'}</b><strong>= {leftProduct}</strong></section>
          <section className={styles.excluded}><small>题目要求排除</small><b>{step.index >= 0 ? 'nums[' + step.index + '] = ' + productNumbers[step.index] : '等待开始'}</b><strong>计算 answer[{step.index}] 时不乘它</strong></section>
          <section><small>右边（suf 原值）</small><b>{rightValues.length ? rightValues.join(' × ') : '空乘积'}</b><strong>= {step.rightProduct ?? (step.index === productNumbers.length - 1 ? 1 : '待计算')}</strong></section>
        </div>
        <div className={styles.preTrack}>
          <small>pre 的累积来源</small>
          <b>pre = {preEquation} = {step.preValue}</b>
          <span>{step.phase === 'pre-move' ? step.index + 1 < productNumbers.length ? `刚执行 pre *= nums[${step.index}]，也就是乘以 ${productNumbers[step.index]}；结果留给下一轮 i = ${step.index + 1}` : '最后一轮也按代码更新 pre，但循环随后结束，不会再使用它' : step.index === 0 ? '当前 i = 0，左边为空，所以 pre 初始化为 1' : `这些数字来自 nums[0] 到 nums[${step.index - 1}]，也就是当前 i 的左边`}</span>
        </div>
      </>}
      <div className={styles.formula} data-phase={step.phase}><small>当前计算</small><b>{step.formula}</b><span>{step.phase === 'answer' ? '左侧 × 右侧，不包含自身' : step.phase === 'pre-move' ? '更新给下一个位置使用的 pre' : step.phase.startsWith('pre') ? '构造左侧乘积' : '构造右侧乘积'}</span></div>
      <div className={styles.flow}>{method === 'arrays' ? <><span data-active={step.phase.startsWith('pre') || undefined}>① 从左构造 pre</span><span data-active={step.phase.startsWith('suf') || undefined}>② 从右构造 suf</span><span data-active={step.phase === 'answer' || undefined}>③ pre × suf</span></> : <><span data-active={step.phase.startsWith('suf') || undefined}>① 先把右积写入 suf</span><span data-active={step.phase === 'pre-seed' || step.phase === 'answer' || undefined}>② 用 pre 乘出当前答案</span><span data-active={step.phase === 'pre-move' || undefined}>③ 更新 pre，准备下一轮</span></>}</div>
      <div className={styles.rule}><b>为什么不会乘到自身</b><span>左侧乘积停在 i 前面，右侧乘积从 i 后面开始，两边都不包含 nums[i]。</span></div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function ArrayRow({ label, values, activeIndex, answer = false, reused = false, finalThrough = -1, trace = false }: { label: string; values: Array<number | null>; activeIndex: number; answer?: boolean; reused?: boolean; finalThrough?: number; trace?: boolean }) {
  return <section data-answer={answer || undefined} data-trace={trace || undefined}><b>{label}</b>{values.map((value, index) => <span data-active={index === activeIndex || undefined} data-filled={value !== null || undefined} data-final={reused && index <= finalThrough || undefined} key={index}><small>{trace ? 'i = ' + index : label + '[' + index + ']'}</small><strong>{value ?? '·'}</strong>{reused && value !== null && <em>{index <= finalThrough ? '最终答案' : '右侧乘积'}</em>}</span>)}</section>
}
