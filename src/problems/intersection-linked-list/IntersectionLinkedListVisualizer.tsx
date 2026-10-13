import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { intersectionCode, intersectionMethods, intersectionSteps, type PointerPosition } from './steps'
import styles from './visualizer.module.css'

const positions: Record<PointerPosition, [number, number]> = {
  a0: [130, 65], a1: [280, 65],
  b0: [130, 235], b1: [255, 235], b2: [380, 235],
  c0: [520, 150], c1: [680, 150], c2: [840, 150],
  // 逻辑上分别是 p/q 走到 null；图上都落在同一个真实尾端。
  'null-a': [918, 150], 'null-b': [918, 150],
}

const nodes = [
  { id: 'a0', value: 4, label: 'a₁', x: 130, y: 65, kind: 'a' },
  { id: 'a1', value: 1, label: 'a₂', x: 280, y: 65, kind: 'a' },
  { id: 'b0', value: 5, label: 'b₁', x: 130, y: 235, kind: 'b' },
  { id: 'b1', value: 6, label: 'b₂', x: 255, y: 235, kind: 'b' },
  { id: 'b2', value: 1, label: 'b₃', x: 380, y: 235, kind: 'b' },
  { id: 'c0', value: 8, label: 'c₁', x: 520, y: 150, kind: 'shared' },
  { id: 'c1', value: 4, label: 'c₂', x: 680, y: 150, kind: 'shared' },
  { id: 'c2', value: 5, label: 'c₃', x: 840, y: 150, kind: 'shared' },
] as const

function Pointer({ name, position, offset }: { name: 'p' | 'q'; position: PointerPosition; offset: number }) {
  const [x, y] = positions[position]
  return (
    <g className={`${styles.pointer} ${styles[name]}`} style={{ transform: `translate(${x}px, ${y + offset}px)` }} aria-label={`${name} 位于 ${position}`}>
      <circle r="17" />
      <text textAnchor="middle" dy="4">{name}</text>
    </g>
  )
}

export function IntersectionLinkedListVisualizer() {
  const playback = usePlayback(intersectionSteps.length, 1900)
  const step = intersectionSteps[playback.stepIndex] ?? intersectionSteps[0]
  const visited = useMemo(() => {
    const ids = new Set<PointerPosition>()
    intersectionSteps.slice(0, playback.stepIndex + 1).forEach((item) => { ids.add(item.p); ids.add(item.q) })
    return ids
  }, [playback.stepIndex])

  return (
    <AlgorithmPlayer
      methods={intersectionMethods}
      activeMethod="two-pointer"
      onMethodChange={playback.reset}
      playback={playback}
      code={intersectionCode}
      activeLineId={step.lineId}
    >
      <div className="animation-canvas">
        <div className={styles.readout}>
          <div><span>p 路线</span><b>A → B</b><small>{step.pDistance} 步</small></div>
          <div><span>q 路线</span><b>B → A</b><small>{step.qDistance} 步</small></div>
          <div className={styles.status} data-phase={step.phase}><span>当前阶段</span><b>{step.phase === 'start' ? '从表头出发' : step.phase === 'switch' ? '交换路线' : step.phase === 'found' ? '找到交点' : '同步前进'}</b></div>
        </div>

        <div className={styles.scene}>
          <svg viewBox="0 0 970 340" role="img" aria-label="链表 A 和链表 B 在值为 8 的节点开始相交">
            <defs><marker id="intersection-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
            <text className={styles.rowLabel} x="18" y="70">headA</text>
            <text className={styles.rowLabel} x="18" y="240">headB</text>
            <g className={styles.edges}>
              <path d="M 167 65 H 243" />
              <path d="M 317 65 L 483 139" />
              <path d="M 167 235 H 218" />
              <path d="M 292 235 H 343" />
              <path d="M 417 235 L 483 165" />
              <path d="M 557 150 H 643" />
              <path d="M 717 150 H 803" />
              <path d="M 877 150 H 910" />
            </g>
            <text className={styles.nullEnd} x="918" y="154">null</text>
            {nodes.map((node) => {
              const active = step.p === node.id || step.q === node.id
              const found = step.phase === 'found' && node.id === 'c0'
              return <g className={styles.node} data-kind={node.kind} data-visited={visited.has(node.id)} data-active={active || undefined} data-found={found || undefined} transform={`translate(${node.x} ${node.y})`} key={node.id}>
                <circle r="36" />
                <text className={styles.value} textAnchor="middle" dy="7">{node.value}</text>
                <text className={styles.nodeLabel} textAnchor="middle" y="52">{node.label}</text>
              </g>
            })}
            <Pointer name="p" position={step.p} offset={-58} />
            <Pointer name="q" position={step.q} offset={78} />
          </svg>
        </div>

        <div className={styles.distanceTrack}>
          <span>0</span><i><b style={{ width: `${(step.pDistance / 9) * 100}%` }} /></i><strong>{step.pDistance} / 9</strong><small>两指针始终走过相同距离</small>
        </div>
        <div className={`step-message ${step.phase === 'found' ? 'success' : ''}`} aria-live="polite">
          <span>{step.phase === 'found' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p>
        </div>
      </div>
    </AlgorithmPlayer>
  )
}
