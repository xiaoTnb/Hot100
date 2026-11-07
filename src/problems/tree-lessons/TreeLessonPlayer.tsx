import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import type { LessonNode, TreeFrame, TreeLesson } from './model'
import styles from './treeLesson.module.css'

function layout(nodes: LessonNode[], root: number | null) {
  const positions = new Map<number, { x: number; y: number }>()
  let depth = 0
  const walk = (id: number | null, level: number, left: number, right: number) => {
    if (id === null || positions.has(id)) return
    const x = (left + right) / 2
    positions.set(id, { x, y: 52 + level * 88 })
    depth = Math.max(depth, level)
    const node = nodes.find(item => item.id === id)
    if (!node) return
    walk(node.left, level + 1, left, x)
    walk(node.right, level + 1, x, right)
  }
  walk(root, 0, 20, 620)
  return { positions, height: Math.max(255, 105 + depth * 88) }
}

function TreeDiagram({ frame }: { frame: TreeFrame }) {
  const { positions, height } = layout(frame.nodes, frame.root)
  const highlightedPath = frame.path ?? []
  return <div className={styles.treeScroll}>
    <svg className={styles.tree} viewBox={`0 0 640 ${height}`} style={{ height }} role="img" aria-label={`${frame.title}，当前节点：${frame.active.map(id => frame.nodes.find(node => node.id === id)?.value).join('、') || '无'}`}>
      {frame.nodes.flatMap(node => [node.left, node.right].flatMap(child => {
        const from = positions.get(node.id)
        const to = child === null ? undefined : positions.get(child)
        if (!from || !to || child === null) return []
        const dx = to.x - from.x, dy = to.y - from.y, distance = Math.hypot(dx, dy)
        const onPath = highlightedPath.some((id, i) => i > 0 && ((id === node.id && highlightedPath[i - 1] === child) || (id === child && highlightedPath[i - 1] === node.id)))
        return [<line className={styles.edge} data-path={onPath || undefined} key={`${node.id}-${child}`} x1={from.x + dx / distance * 24} y1={from.y + dy / distance * 24} x2={to.x - dx / distance * 25} y2={to.y - dy / distance * 25} />]
      }))}
      {frame.nodes.map(node => {
        const point = positions.get(node.id)
        if (!point) return null
        return <g className={styles.node} style={{ transform: `translate(${point.x}px, ${point.y}px)` }} data-active={frame.active.includes(node.id) || undefined} data-completed={frame.completed.includes(node.id) || undefined} data-failed={frame.failed && frame.active.includes(node.id) || undefined} key={node.id}>
          <circle r="23" /><text className={styles.value} style={String(node.value).length > 5 ? { fontSize: 7 } : undefined}>{node.value}</text><text className={styles.nodeId} y="39">node {node.id}</text>
        </g>
      })}
      {frame.root === null && <text x="320" y="125" className={styles.emptyTree}>root = null · 空树</text>}
    </svg>
  </div>
}

export function TreeLessonPlayer({ lesson }: { lesson: TreeLesson }) {
  const [methodId, setMethodId] = useState(lesson.methods[0].id)
  const [scenarioId, setScenarioId] = useState(lesson.scenarios[0].id)
  const scenario = lesson.scenarios.find(item => item.id === scenarioId) ?? lesson.scenarios[0]
  const method = lesson.methods.find(item => item.id === methodId) ?? lesson.methods[0]
  const frames = useMemo(() => lesson.makeFrames(methodId, scenario), [lesson, methodId, scenario])
  const playback = usePlayback(frames.length, 1800)
  const frame = frames[Math.min(playback.stepIndex, frames.length - 1)]
  const previous = frames[playback.stepIndex - 1]
  const next = frames[playback.stepIndex + 1]
  const recursive = method.execution !== 'iterative'
  const returning = recursive && frame.stack.length > 0 && next !== undefined && next.stack.length < frame.stack.length
  const resumed = recursive && previous !== undefined && previous.stack.length > frame.stack.length && frame.stack.length > 0
  const entered = recursive && frame.stack.length > (previous?.stack.length ?? 0)
  const currentCall = frame.stack.at(-1)
  const parentCall = frame.stack.at(-2)
  const executionTitle = frame.done ? recursive ? '所有递归调用已返回' : '迭代处理完成' : returning ? '本层返回 → 继续上一层' : resumed ? '回到上一层继续执行' : entered ? '进入下一层递归' : recursive ? '当前层继续执行' : '当前循环步骤'
  const activeCode = method.code.find(line => line.id === frame.lineId)?.text.trim()
  return <AlgorithmPlayer methods={lesson.methods} activeMethod={methodId} onMethodChange={id => { setMethodId(id); playback.reset() }} playback={playback} code={method.code} activeLineId={frame.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.examples} role="group" aria-label="选择演示案例">{lesson.scenarios.map(item => <button key={item.id} className={item.id === scenarioId ? styles.selected : ''} aria-pressed={item.id === scenarioId} onClick={() => { setScenarioId(item.id); playback.reset() }}>{item.label}</button>)}</div>
      <div className={styles.status}><b>{frame.title}</b><span>{lesson.legend}</span></div>
      <div className={styles.workspace}>
        <section className={styles.treePanel}><header>输入 [{scenario.input.map(value => value ?? 'null').join(', ')}]</header><TreeDiagram frame={frame} /></section>
        <section className={styles.inspector}><header>当前状态</header>
          <dl>{frame.variables.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
          <div className={styles.execution}>
            <h3>{recursive ? '递归调用过程' : '迭代处理过程'}</h3>
            <p>{recursive ? '程序自动记录每层的执行位置；子调用返回后，上一层继续执行。无需手动创建 Stack。' : '通过循环逐项处理，当前任务如下。'}</p>
            <div className={styles.executionStatus} data-returning={returning || undefined}>{executionTitle}</div>
            <div className={styles.calls}>{frame.stack.length ? frame.stack.map((entry, index) => <div className={styles.call} data-current={index === frame.stack.length - 1 || undefined} key={`${entry}-${index}`}>
              <small>{recursive ? `第 ${index + 1} 层` : '当前任务'}</small><b>{entry}</b>
              <span>{index < frame.stack.length - 1 ? `等待 ${frame.stack[index + 1]} 返回` : recursive ? returning ? '本层即将返回' : resumed ? '子调用已返回，继续执行' : '正在执行' : '正在处理'}</span>
            </div>) : <em>{frame.done ? '执行结束' : recursive ? '即将调用递归函数' : '准备下一项任务'}</em>}</div>
            {returning && <div className={styles.returnTo}>{currentCall} 返回后，{parentCall ? `${parentCall} 继续执行` : '回到入口方法，得到最终结果'}。</div>}
            {lesson.showCurrentStatement !== false && currentCall && activeCode && <div className={styles.currentCode}><small>{recursive ? '当前层对应的 Java 语句' : '当前 Java 语句'}</small><code>{activeCode}</code></div>}
          </div>
        </section>
      </div>
      <div className={styles.rows}>{frame.rows.map((row, index) => <div className={styles.row} data-tone={row.tone ?? 'blue'} key={`${row.label}-${index}`}><small>{row.label}</small><div>{row.items.length ? row.items.map((value, i) => <span key={`${value}-${i}`}>{value}</span>) : <em>空</em>}</div></div>)}</div>
      <div className={`step-message ${frame.done && !frame.failed ? 'success' : ''}`} aria-live="polite"><span>{String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{frame.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
