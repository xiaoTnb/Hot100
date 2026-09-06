import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { cycleCode, cycleMethods, cycleSteps } from './steps'
import styles from './visualizer.module.css'

const nodes = [
  { x: 130, y: 150, value: 3, label: 'head' },
  { x: 345, y: 72, value: 2, label: '环入口 · pos 1' },
  { x: 625, y: 72, value: 0, label: 'node 2' },
  { x: 625, y: 232, value: -4, label: 'node 3' },
]

function Pointer({ kind, index }: { kind: 'slow' | 'fast'; index: number }) {
  const node = nodes[index]
  const yOffset = kind === 'slow' ? -55 : 55
  return <g className={`${styles.pointer} ${styles[kind]}`} style={{ transform: `translate(${node.x}px, ${node.y + yOffset}px)` }}><rect x="-23" y="-12" width="46" height="24" rx="12" /><text textAnchor="middle" dy="4">{kind}</text></g>
}

export function LinkedListCycleVisualizer() {
  const playback = usePlayback(cycleSteps.length, 2200)
  const step = cycleSteps[playback.stepIndex] ?? cycleSteps[0]

  return (
    <AlgorithmPlayer methods={cycleMethods} activeMethod="floyd" onMethodChange={playback.reset} playback={playback} code={cycleCode} activeLineId={step.lineId}>
      <div className="animation-canvas">
        <div className={styles.metrics}>
          <div><span>slow</span><b>1×</b><small>每轮一步</small></div>
          <div><span>fast</span><b>2×</b><small>每轮两步</small></div>
          <div data-meet={step.phase === 'meet' || undefined}><span>检测结果</span><b>{step.phase === 'meet' ? '有环' : '追逐中'}</b><small>{step.phase === 'meet' ? 'fast === slow' : `第 ${playback.stepIndex} 轮`}</small></div>
        </div>

        <div className={styles.scene}>
          <svg viewBox="0 0 900 315" role="img" aria-label="尾节点回到第二个节点形成的环形链表">
            <defs><marker id="cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" /></marker></defs>
            <g className={styles.track}>
              <path d="M168 136 L305 86" />
              <path d="M385 72 H585" />
              <path d="M625 112 V192" />
              <path className={styles.loopback} d="M585 246 C430 310 280 260 317 108" />
            </g>
            <text className={styles.loopLabel} x="425" y="284">next 回到 pos = 1</text>
            {nodes.map((node, index) => {
              const active = step.slow === index || step.fast === index
              const meet = step.phase === 'meet' && active
              return <g className={styles.node} data-in-cycle={index > 0 || undefined} data-active={active || undefined} data-meet={meet || undefined} transform={`translate(${node.x} ${node.y})`} key={node.label}>
                <circle r="38" /><text className={styles.value} textAnchor="middle" dy="7">{node.value}</text><text className={styles.label} textAnchor="middle" y="56">{node.label}</text>
              </g>
            })}
            <Pointer kind="slow" index={step.slow} />
            <Pointer kind="fast" index={step.fast} />
          </svg>
        </div>

        <div className={styles.legend}><span><i className={styles.slowDot} />slow 轨迹 {step.slowTrail.join(' → ')}</span><span><i className={styles.fastDot} />fast 轨迹 {step.fastTrail.join(' → ')}</span></div>
        <div className={`step-message ${step.phase === 'meet' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'meet' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}
