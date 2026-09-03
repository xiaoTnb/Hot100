import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { anagramMethods, getAnagramCode, makeAnagramSteps, patternText, sourceText, type AnagramMethod, type AnagramStep } from './steps'
import styles from './visualizer.module.css'

export function FindAnagramsVisualizer() {
  const [method, setMethod] = useState<AnagramMethod>('counts')
  const steps = useMemo(() => makeAnagramSteps(method), [method])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const selectMethod = (id: string) => { setMethod(id as AnagramMethod); playback.reset() }
  return <AlgorithmPlayer methods={anagramMethods} activeMethod={method} onMethodChange={selectMethod} playback={playback} code={getAnagramCode(method)} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <StringWindow step={step} />
      <div className={styles.pattern}><span>目标 p</span><code>“{patternText}”</code><small>固定窗口长度 = {patternText.length}</small><b>{method === 'differ' ? `differ = ${step.differ}` : '比较 26 个位置'}</b></div>
      <div className={styles.countsArea}>
        {method === 'counts' ? <><CounterGrid label="窗口 sCount" values={step.sCount} step={step} /><CounterGrid label="目标 pCount" values={step.pCount} step={step} /></> : <CounterGrid label="count = 窗口 − p" values={step.count} step={step} />}
      </div>
      <div className={styles.result}><span>匹配的起始下标</span><div>{step.answers.length === 0 ? <em>暂无</em> : step.answers.map((index) => <b key={index}>{index}</b>)}</div></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function StringWindow({ step }: { step: AnagramStep }) {
  const end = step.start + patternText.length - (step.phase === 'remove' ? 2 : 1)
  return <div className={styles.sourceRow}><span>s</span>{[...sourceText].map((char, index) => <div data-window={index >= step.start && index <= end || undefined} data-outgoing={index === step.outgoing && step.phase === 'remove' || undefined} data-incoming={index === step.incoming && step.phase === 'add' || undefined} key={index}><strong>{char}</strong><small>{index}</small></div>)}</div>
}

function CounterGrid({ label, values, step }: { label: string; values: number[]; step: AnagramStep }) {
  const activeLetter = step.phase === 'remove' && step.outgoing >= 0 ? sourceText[step.outgoing] : step.phase === 'add' && step.incoming >= 0 ? sourceText[step.incoming] : ''
  return <section className={styles.counter}><header><b>{label}</b><small>下标 = 字母 − 'a'</small></header><div>{values.map((value, index) => <span data-active={activeLetter.charCodeAt(0) - 97 === index || undefined} data-nonzero={value !== 0 || undefined} key={index}><small>{index}</small><b>{String.fromCharCode(97 + index)}</b><i>{value}</i></span>)}</div></section>
}
