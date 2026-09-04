import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getWindowCode, makeWindowSteps, windowMethods, windowSource, windowTarget, type WindowMethod, type WindowStep } from './steps'
import styles from './visualizer.module.css'

const asciiCells = [
  { type: 'edge', index: 0 },
  { type: 'gap', label: '1 … 64' },
  { type: 'char', index: 65, char: 'A' },
  { type: 'char', index: 66, char: 'B' },
  { type: 'char', index: 67, char: 'C' },
  { type: 'gap', label: '68 … 126' },
  { type: 'edge', index: 127 },
] as const

export function MinimumWindowSubstringVisualizer() {
  const [method, setMethod] = useState<WindowMethod>('counts')
  const steps = useMemo(() => makeWindowSteps(method), [method])
  const playback = usePlayback(steps.length, 1650)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as WindowMethod); playback.reset() }
  const answer = step.ansLeft < 0 ? '' : windowSource.slice(step.ansLeft, step.ansRight + 1)
  return <AlgorithmPlayer methods={windowMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getWindowCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      <div className={styles.inputLine}><span>动画用例</span><code>s = “{windowSource}”</code><b>t = “{windowTarget}”</b></div>
      <section className={styles.stringRow}>{[...windowSource].map((char, index) => <div data-window={index >= step.left && index <= step.right || undefined} data-best={step.ansLeft >= 0 && index >= step.ansLeft && index <= step.ansRight || undefined} data-active={index === step.activePosition || undefined} key={index}><i>{index === step.left && step.right >= 0 && <b data-side="left">l</b>}{index === step.right && <b data-side="right">r</b>}</i><strong>{char}</strong><small>{index}</small></div>)}</section>
      <div className={styles.status}>
        <span><small>当前窗口</small><b>{step.right < step.left ? '空' : '“' + windowSource.slice(step.left, step.right + 1) + '”'}</b></span>
        <span data-covered={step.phase === 'covered' || step.phase === 'update' || undefined}><small>涵盖判断</small><b>{method === 'counts' ? 'cntS 每项 ≥ cntT' : 'geCnt = ' + step.geCnt + ' / kinds = ' + step.kinds}</b></span>
        <span data-answer="true"><small>目前最短答案</small><b>{answer === '' ? '尚未找到' : '“' + answer + '”'}</b></span>
      </div>
      <div className={styles.countArea}>{method === 'counts' ? <>
        <AsciiRow label="cntT · 目标需要数量" values={step.cntT} step={step} />
        <AsciiRow label="cntS · 当前窗口数量" values={step.cntS} step={step} />
      </> : <AsciiRow label="diff = 窗口数量 − 目标数量" values={step.diff} step={step} />}</div>
      <div className={styles.explain}>{method === 'counts' ? <><b>如何判断涵盖</b><span>逐个检查目标字符：窗口的数量 <code>cntS</code> 必须全部不少于 <code>cntT</code>。</span></> : <><b>为什么 geCnt 有效</b><span><code>diff[x] = 0</code> 表示字符 x 刚好够用；够用的目标字符种类达到 <code>kinds</code>，窗口就涵盖 t。</span></>}</div>
      <div className={styles.flow}><span data-active={step.phase === 'target' || undefined}>① 统计 t</span><span data-active={step.phase === 'add' || undefined}>② r 加入字符</span><span data-active={step.phase === 'covered' || step.phase === 'update' || undefined}>③ 涵盖后更新答案</span><span data-active={step.phase === 'remove' || step.phase === 'move' || undefined}>④ 移动 l 缩短窗口</span></div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function AsciiRow({ label, values, step }: { label: string; values: number[]; step: WindowStep }) {
  return <section className={styles.ascii}><header><b>{label}</b><small>数组长度 128，字符的 ASCII 值就是下标</small></header><div>{asciiCells.map((cell) => cell.type === 'gap'
    ? <span className={styles.gap} key={cell.label}><b>…</b><small>{cell.label}</small></span>
    : <span data-active={cell.index === step.activeCode || undefined} data-used={values[cell.index] !== 0 || undefined} key={cell.index}><small>下标 {cell.index}</small><b>{cell.type === 'char' ? cell.char : '·'}</b><i>{values[cell.index]}</i></span>)}</div></section>
}
