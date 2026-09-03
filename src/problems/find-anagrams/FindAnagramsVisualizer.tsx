import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { anagramMethods, getAnagramCode, makeAnagramSteps, patternText, sourceText, type AnagramMethod, type AnagramStep } from './steps'
import styles from './visualizer.module.css'

export function FindAnagramsVisualizer() {
  const [method, setMethod] = useState<AnagramMethod>('fixed')
  const steps = useMemo(() => makeAnagramSteps(method), [method])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as AnagramMethod); playback.reset() }
  return <AlgorithmPlayer methods={anagramMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getAnagramCode(method)} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <StringWindow step={step} />
      <div className={styles.pattern}><span>目标 p</span><code>“{patternText}”</code><small>目标长度 = {patternText.length}</small><b>{method === 'fixed' ? '窗口满 3 个后比较计数' : 'cnt < 0 时收缩窗口'}</b></div>
      <div className={styles.countsArea}>
        {method === 'fixed' ? <><CounterGrid label="窗口计数 cntS" values={step.cntS} step={step} /><CounterGrid label="目标计数 cntP" values={step.cntP} step={step} /></> : <CounterGrid label="cnt：p 剩余可用配额" values={step.cnt} step={step} />}
      </div>
      <div className={styles.result}><span>匹配的起始下标</span><div>{step.answers.length === 0 ? <em>暂无</em> : step.answers.map((index) => <b key={index}>{index}</b>)}</div></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function StringWindow({ step }: { step: AnagramStep }) {
  return <div className={styles.sourceRow}><span>s</span>{[...sourceText].map((char, index) => <div data-window={index >= step.left && index <= step.right || undefined} data-left={index === step.left && step.right >= step.left || undefined} data-right={index === step.right || undefined} data-active={char.charCodeAt(0) - 97 === step.activeIndex || undefined} key={index}><strong>{char}</strong><small>{index}</small></div>)}</div>
}

function CounterGrid({ label, values, step }: { label: string; values: number[]; step: AnagramStep }) {
  return <section className={styles.counter}><header><b>{label}</b><small>完整展示 26 个字母位置</small></header><div>{values.map((value, index) => <span data-active={step.activeIndex === index || undefined} data-nonzero={value !== 0 || undefined} data-negative={value < 0 || undefined} key={index}><small>{index}</small><b>{String.fromCharCode(97 + index)}</b><i>{value}</i></span>)}</div></section>
}
