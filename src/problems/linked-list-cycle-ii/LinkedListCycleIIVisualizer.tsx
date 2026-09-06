import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { cycleEntryCode, cycleEntryMethods, cycleEntrySteps } from './steps'
import styles from '../linked-list-cycle/visualizer.module.css'

const nodes = [
  { x: 130, y: 150, value: 3, label: 'head' },
  { x: 345, y: 72, value: 2, label: '环入口 · pos 1' },
  { x: 625, y: 72, value: 0, label: 'node 2' },
  { x: 625, y: 232, value: -4, label: 'node 3' },
]

function Marker({ label, index, tone, offset }: { label: string; index: number; tone: 'slow' | 'fast'; offset: number }) {
  const node = nodes[index]
  return <g className={`${styles.pointer} ${styles[tone]}`} style={{ transform: `translate(${node.x}px, ${node.y + offset}px)` }}><rect x="-24" y="-12" width="48" height="24" rx="12" /><text textAnchor="middle" dy="4">{label}</text></g>
}

export function LinkedListCycleIIVisualizer() {
  const playback = usePlayback(cycleEntrySteps.length, 2200)
  const step = cycleEntrySteps[playback.stepIndex] ?? cycleEntrySteps[0]
  const secondPhase = step.phase === 'reset' || step.phase === 'seek' || step.phase === 'found'

  return (
    <AlgorithmPlayer methods={cycleEntryMethods} activeMethod="floyd-entry" onMethodChange={playback.reset} playback={playback} code={cycleEntryCode} activeLineId={step.lineId}>
      <div className="animation-canvas">
        <div className={styles.metrics}>
          <div data-meet={!secondPhase || undefined}><span>阶段 1</span><b>{secondPhase ? '已相遇' : '环内追逐'}</b><small>slow 1× · fast 2×</small></div>
          <div data-meet={secondPhase || undefined}><span>阶段 2</span><b>{secondPhase ? '同速寻找' : '等待开始'}</b><small>slow 1× · head 1×</small></div>
          <div data-meet={step.phase === 'found' || undefined}><span>返回值</span><b>{step.phase === 'found' ? 'node 2' : '—'}</b><small>{step.phase === 'found' ? 'pos = 1' : '尚未定位'}</small></div>
        </div>
        <div className={styles.scene}>
          <svg viewBox="0 0 900 315" role="img" aria-label="使用 Floyd 两阶段算法寻找链表环入口">
            <defs><marker id="cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" /></marker></defs>
            <g className={styles.track}>
              <path d="M168 136 L305 86" /><path d="M385 72 H585" /><path d="M625 112 V192" /><path className={styles.loopback} d="M585 246 C430 310 280 260 317 108" />
            </g>
            <text className={styles.loopLabel} x="425" y="284">next 回到 pos = 1</text>
            {nodes.map((node, index) => {
              const active = step.slow === index || step.other === index
              const found = step.phase === 'found' && index === 1
              return <g className={styles.node} data-in-cycle={index > 0 || undefined} data-active={active || undefined} data-meet={found || undefined} transform={`translate(${node.x} ${node.y})`} key={node.label}><circle r="38" /><text className={styles.value} textAnchor="middle" dy="7">{node.value}</text><text className={styles.label} textAnchor="middle" y="56">{node.label}</text></g>
            })}
            <Marker label="slow" index={step.slow} tone="slow" offset={-55} />
            <Marker label={step.otherLabel} index={step.other} tone="fast" offset={55} />
          </svg>
        </div>
        <div className={styles.legend}><span><i className={styles.slowDot} />slow：{step.slow}</span><span><i className={styles.fastDot} />{step.otherLabel}：{step.other}</span><span>{secondPhase ? '同速 1×' : '速度差 1×'}</span></div>
        <div className={`step-message ${step.phase === 'found' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'found' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}
