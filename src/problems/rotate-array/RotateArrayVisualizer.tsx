import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeRotateSteps, rotateCode, rotateInput, rotateK, rotateMethods, type RotatePass } from './steps'
import styles from './visualizer.module.css'

const passes: Array<{ id: RotatePass; label: string; range: string }> = [
  { id: 'all', label: '整体反转', range: '0 ... n - 1' },
  { id: 'front', label: '反转前 k 段', range: '0 ... k - 1' },
  { id: 'back', label: '反转剩余段', range: 'k ... n - 1' },
]

export function RotateArrayVisualizer() {
  const steps = useMemo(() => makeRotateSteps(), [])
  const playback = usePlayback(steps.length, 1200)
  const step = steps[playback.stepIndex]

  return <AlgorithmPlayer methods={rotateMethods} activeMethod="three-reversals" onMethodChange={playback.reset} playback={playback} code={rotateCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.input}><code>nums = [{rotateInput.join(', ')}]</code><span>k <b>{rotateK}</b></span><span>n <b>{rotateInput.length}</b></span></div>
      <div className={styles.array}>{step.nums.map((number, index) => {
        const inRange = index >= step.rangeStart && index <= step.rangeEnd
        const isLeft = index === step.left
        const isRight = index === step.right
        return <div data-range={inRange || undefined} data-swap={step.phase === 'swap' && (isLeft || isRight) || undefined} key={index}>
          <span>{isLeft && step.phase !== 'done' && <b>i</b>}{isRight && step.phase !== 'done' && <b data-right="true">j</b>}</span><strong>{number}</strong><small>{index}</small>
        </div>
      })}</div>
      <div className={styles.range}><small>当前反转范围</small><b>{step.rangeStart < 0 ? '等待开始' : `[${step.rangeStart}, ${step.rangeEnd}]`}</b><span>{step.phase === 'swap' ? `交换下标 ${step.left} 和 ${step.right}` : step.phase === 'move' ? '双指针向中间靠拢' : '确定本轮边界'}</span></div>
      <div className={styles.passes}>{passes.map((pass, index) => <section data-active={step.pass === pass.id || undefined} data-done={step.pass && passes.findIndex((item) => item.id === step.pass) > index || step.phase === 'done' || undefined} key={pass.id}><b>{index + 1}</b><span><strong>{pass.label}</strong><small>{pass.range}</small></span></section>)}</div>
      <div className={styles.explain}><b>为什么是三次反转</b><span>整体反转把最后 k 个元素带到数组前面，后两次反转分别恢复这两段内部的原顺序。</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
