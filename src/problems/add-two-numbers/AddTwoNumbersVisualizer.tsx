import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { addListA, addListB, addNumbersCode, addNumbersMethods, addNumbersSteps } from './steps'
import styles from './visualizer.module.css'

function DigitList({ label, values, active, tone }: { label: string; values: number[]; active: number; tone: 'blue' | 'orange' }) {
  return <div className={styles.row}><b>{label}</b><small>低位</small>{values.map((value, index) => <span data-active={index === active || undefined} data-used={index < active || undefined} data-tone={tone} key={index}>{value}<i>10^{index}</i></span>)}<em>高位</em></div>
}

export function AddTwoNumbersVisualizer() {
  const playback = usePlayback(addNumbersSteps.length, 2200)
  const step = addNumbersSteps[playback.stepIndex] ?? addNumbersSteps[0]
  const done = step.phase === 'done'
  return (
    <AlgorithmPlayer methods={addNumbersMethods} activeMethod="digit-add" onMethodChange={playback.reset} playback={playback} code={addNumbersCode} activeLineId={step.lineId}>
      <div className="animation-canvas">
        <div className={styles.inputBoard}>
          <DigitList label="l1" values={addListA} active={done ? -1 : step.index} tone="blue" />
          <DigitList label="l2" values={addListB} active={done ? -1 : step.index} tone="orange" />
        </div>
        <div className={styles.math} data-done={done || undefined}>
          {done ? <><span>链表表示</span><b>342 + 465 = 807</b><small>逆序节点 [7, 0, 8]</small></> : <><span>第 {step.index + 1} 位</span><b>{step.a} + {step.b} + {step.carryIn} = {step.a + step.b + step.carryIn}</b><small><i>写入 {step.phase === 'start' ? '—' : step.digit}</i><i>carry → {step.carryOut}</i></small></>}
        </div>
        <div className={styles.result}>
          <header><span>结果链表</span><small>dummy.next</small></header>
          <div><em>dummy</em>{step.output.map((value, index) => <span data-new={index === step.output.length - 1 && !done || undefined} key={index}><i>→</i><b>{value}</b>{index === step.output.length - 1 && !done && <small>cur</small>}</span>)}{step.output.length === 0 && <p>等待计算个位</p>}</div>
        </div>
        <div className={`step-message ${done ? 'success' : ''}`} aria-live="polite"><span>{done ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}
