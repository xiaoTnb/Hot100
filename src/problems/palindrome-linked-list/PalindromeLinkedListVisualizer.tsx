import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { palindromeCode, palindromeMethods, palindromeSteps } from './steps'
import styles from './visualizer.module.css'

const values = [1, 2, 2, 1]

export function PalindromeLinkedListVisualizer() {
  const playback = usePlayback(palindromeSteps.length, 2100)
  const step = palindromeSteps[playback.stepIndex] ?? palindromeSteps[0]
  const phaseIndex = step.phase === 'start' || step.phase === 'middle' ? 0 : step.phase === 'reverse' ? 1 : 2

  return (
    <AlgorithmPlayer methods={palindromeMethods} activeMethod="reverse-half" onMethodChange={playback.reset} playback={playback} code={palindromeCode} activeLineId={step.lineId}>
      <div className="animation-canvas">
        <div className={styles.phaseRail}>
          {['01 找到中点', '02 反转后半段', '03 两端比较'].map((label, index) => <span data-active={index === phaseIndex || undefined} data-done={index < phaseIndex || undefined} key={label}><i>{index < phaseIndex ? '✓' : index + 1}</i>{label.slice(3)}</span>)}
        </div>

        <div className={styles.board} data-reversed={step.reversed || undefined}>
          <div className={styles.laneLabel}>{step.reversed ? '前半段' : '原链表'}</div>
          <div className={styles.list}>
            {values.map((value, index) => {
              const active = step.slow === index || step.fast === index || step.left === index || step.right === index
              const compared = step.compared.includes(index)
              return (
                <div className={styles.nodeWrap} data-half={index > 1 ? 'right' : 'left'} data-active={active || undefined} data-compared={compared || undefined} style={{ '--slot': step.reversed && index > 1 ? 5 - index : index } as React.CSSProperties} key={index}>
                  <div className={styles.pointers}>
                    {step.slow === index && <span className={styles.slow}>slow</span>}
                    {step.fast === index && <span className={styles.fast}>fast</span>}
                    {step.left === index && <span className={styles.head}>head</span>}
                    {step.right === index && <span className={styles.head2}>head2</span>}
                  </div>
                  <div className={styles.node}>{value}</div>
                  <small>node {index + 1}</small>
                </div>
              )
            })}
            {[0, 1, 2].map((index) => <span className={styles.arrow} data-index={index} key={index}>→</span>)}
          </div>
          {step.reversed && <div className={styles.splitCaption}><span>head 从左向右</span><span>head2 从右半段新表头出发</span></div>}
        </div>

        <div className={styles.comparison} data-visible={step.phase === 'compare' || step.phase === 'done' || undefined}>
          {step.phase === 'done' ? <><b>TRUE</b><span>每一对都相等</span></> : step.left !== null && step.right !== null ? <><strong>{values[step.left]}</strong><i>=</i><strong>{values[step.right]}</strong><span>继续向中间靠拢</span></> : <span>反转完成后，从两端开始比较</span>}
        </div>

        <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite">
          <span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p>
        </div>
      </div>
    </AlgorithmPlayer>
  )
}
