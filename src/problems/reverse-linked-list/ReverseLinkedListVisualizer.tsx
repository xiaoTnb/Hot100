import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getReverseCode, makeReverseSteps, reverseMethods, type ReverseMethod } from './steps'
import styles from './visualizer.module.css'
export function ReverseLinkedListVisualizer() {
  const [method, setMethod] = useState<ReverseMethod>('iterative'), steps = useMemo(() => makeReverseSteps(method), [method]), playback = usePlayback(steps.length, 1450), step = steps[playback.stepIndex]
  const change = (id: string) => { setMethod(id as ReverseMethod); playback.reset() }
  return <AlgorithmPlayer methods={reverseMethods} activeMethod={method} onMethodChange={change} playback={playback} code={getReverseCode(method)} activeLineId={step.lineId}>
    <div className={'animation-canvas ' + styles.canvas}>
      {method === 'recursive' && <section className={styles.stack}><header><b>递归调用栈</b><small>右侧是栈顶</small></header><div>{step.stack.length ? step.stack.map((value) => <span key={value}>head = {value}</span>) : <em>已全部返回</em>}</div></section>}
      <section className={styles.lanes}>
        <Chain title={method === 'iterative' ? 'pre · 已反转' : 'revHead · 回程结果'} values={step.reversed} kind="done" />
        <div className={styles.bridge}><b>{step.phase === 'link' || step.phase === 'unwind' ? '改写 next' : '→'}</b><small>{step.cur === null ? 'cur = null' : 'cur = ' + step.cur}{step.next === null ? '' : '，nxt = ' + step.next}</small></div>
        <Chain title={method === 'iterative' ? 'cur · 尚未处理' : '尚未回程的节点'} values={step.remaining} kind="todo" />
      </section>
      <div className={styles.rule}><span data-active={step.phase === 'save' || undefined}>① 先保存 nxt</span><span data-active={step.phase === 'link' || step.phase === 'unwind' || undefined}>② 反转当前 next</span><span data-active={step.phase === 'move' || step.phase === 'descend' || undefined}>③ 移动指针 / 递归</span></div>
      <div className={'step-message ' + (step.phase === 'done' ? 'success' : '')}><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
function Chain({ title, values, kind }: { title: string; values: number[]; kind: 'done' | 'todo' }) {
  return <section className={styles.chain} data-kind={kind}><header><b>{title}</b><small>{values.length ? values.length + ' 个节点' : 'null'}</small></header><div>{values.length ? values.map((value, index) => <span key={value}><b>{value}</b>{index < values.length - 1 && <i>→</i>}</span>) : <em>null</em>}</div></section>
}
