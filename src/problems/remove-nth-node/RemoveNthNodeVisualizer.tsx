import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { removeNthCode, removeNthMethods, removeNthSteps } from './steps'
import styles from './visualizer.module.css'

const values = [1, 2, 3, 4, 5]
export function RemoveNthNodeVisualizer() {
  const playback = usePlayback(removeNthSteps.length, 2100)
  const step = removeNthSteps[playback.stepIndex] ?? removeNthSteps[0]
  return (
    <AlgorithmPlayer methods={removeNthMethods} activeMethod="gap" onMethodChange={playback.reset} playback={playback} code={removeNthCode} activeLineId={step.lineId}>
      <div className="animation-canvas">
        <div className={styles.rule}><span>倒数第 n 个</span><b>n = 2</b><i /><small>{step.phase === 'gap' ? '间距已建立' : step.phase === 'sync' ? '保持 2 格' : step.phase === 'remove' ? '跨过目标' : step.phase === 'done' ? '删除完成' : '准备出发'}</small></div>
        <div className={styles.scene}>
          <div className={styles.list}>
            <div className={styles.wrap} data-pointer={step.slow === -1 || step.fast === -1 || undefined}><div className={styles.pointers}>{step.slow === -1 && <span>slow</span>}{step.fast === -1 && <em>fast</em>}</div><div className={styles.dummy}>dummy</div></div>
            {values.map((value, index) => <div className={styles.wrap} data-removed={step.removed && index === 3 || undefined} data-pointer={step.slow === index || step.fast === index || undefined} key={value}><i className={styles.arrow}>→</i><div className={styles.pointers}>{step.slow === index && <span>slow</span>}{step.fast === index && <em>fast</em>}</div><div className={styles.node}>{value}</div><small>{index === 3 ? '倒数第 2 个' : `node ${index + 1}`}</small></div>)}
            <i className={styles.null}>→ null</i>
            {step.removed && <svg className={styles.bypass} viewBox="0 0 220 50"><path d="M5 42 C55 0 155 0 215 42" /><text x="110" y="14" textAnchor="middle">slow.next = 5</text></svg>}
          </div>
        </div>
        <div className={styles.positions}><span>slow：{step.slow < -1 ? '完成' : step.slow === -1 ? 'dummy' : values[step.slow]}</span><span>fast：{step.fast < -1 ? '完成' : step.fast === -1 ? 'dummy' : values[step.fast]}</span><b>{step.phase === 'remove' ? '3 → 5' : 'fast − slow = 2'}</b></div>
        <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}
