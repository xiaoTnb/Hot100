import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import styles from '../binary-search-shared/visualizer.module.css'
import { makeRotatedSteps, rotatedCode, rotatedMethods, rotatedNums, rotatedTarget } from './steps'

export function SearchRotatedArrayVisualizer() {
  const steps = useMemo(() => makeRotatedSteps(), [])
  const playback = usePlayback(steps.length, 1250)
  const step = steps[playback.stepIndex]
  const finished = step.pass === 'done'

  return <AlgorithmPlayer methods={rotatedMethods} activeMethod="pivot-bound" onMethodChange={playback.reset} playback={playback} code={rotatedCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.input}><code>nums = [{rotatedNums.join(', ')}]</code><span>target <b>{rotatedTarget}</b></span><span>末尾值 <b>{rotatedNums.at(-1)}</b></span></div>
      <div className={styles.array}>{rotatedNums.map((number, index) => {
        const inRange = step.pass === 'pivot' ? index > step.left && index <= step.right : step.pass === 'search' || step.pass === 'choose' ? index > step.left && index < step.right : true
        return <div className={styles.cell} data-in-range={inRange || undefined} data-discarded={!inRange || undefined} data-mid={index === step.mid || undefined} data-answer={finished && index === step.right || undefined} key={index}>
          <span>{index === step.mid && <b data-kind={finished ? 'answer' : 'mid'}>{finished ? '找到' : 'mid'}</b>}{index === step.pivot && <b data-kind="answer">旋转点</b>}</span><strong>{number}</strong><small>{index}</small>
        </div>
      })}</div>
      <div className={styles.metrics}><section data-accent={step.pass === 'pivot' ? 'blue' : undefined}><small>旋转点 i</small><b>{step.pivot < 0 ? '搜索中' : step.pivot}</b></section><section><small>left / right</small><b>{step.left} / {step.right}</b></section><section data-accent={step.pass === 'search' ? 'orange' : undefined}><small>当前阶段</small><b>{step.pass === 'pivot' ? '定位最小值' : step.pass === 'choose' ? '选择有序段' : step.pass === 'search' ? '段内二分' : '完成'}</b></section><section data-accent={finished ? 'green' : undefined}><small>结果下标</small><b>{finished ? step.right : '待定'}</b></section></div>
      <div className={styles.phaseTrack}><span data-active={step.pass === 'pivot' || undefined} data-done={step.pivot >= 0 || undefined}>① 找旋转点</span><span data-active={step.pass === 'choose' || undefined} data-done={step.pass === 'search' || finished || undefined}>② 选择有序段</span><span data-active={step.pass === 'search' || finished || undefined}>③ lowerBound</span></div>
      <div className={styles.explain}><b>一处断点，两段有序</b><span>旋转点把数组切成 [4,5,6,7] 与 [0,1,2]。target 与末尾值比较后，只需在其中一段继续普通二分。</span></div>
      <div className={`step-message ${finished ? 'success' : ''}`} aria-live="polite"><span>{finished ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
