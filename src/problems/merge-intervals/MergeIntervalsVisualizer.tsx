import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getMergeCode, makeMergeSteps, mergeInput, mergeMethods, mergeSorted, type Interval, type MergeMethod } from './steps'
import styles from './visualizer.module.css'

export function MergeIntervalsVisualizer() {
  const [method, setMethod] = useState<MergeMethod>('sort-mutate')
  const steps = useMemo(() => makeMergeSteps(method), [method])
  const playback = usePlayback(steps.length, 1500)
  const step = steps[playback.stepIndex]
  const isSort = method.startsWith('sort')
  const changeMethod = (value: string) => { setMethod(value as MergeMethod); playback.reset() }

  return <AlgorithmPlayer methods={mergeMethods} activeMethod={method} onMethodChange={changeMethod} playback={playback} code={getMergeCode(method)} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <IntervalTrack intervals={isSort ? mergeSorted : mergeInput} activeIndex={step.currentIndex} title={isSort ? '按左端点排序后的区间' : '原始区间'} />
      {isSort ? <>
        <div className={styles.comparison} data-overlap={step.overlaps === true ? 'yes' : step.overlaps === false ? 'no' : undefined}>
          <section><small>{method === 'sort-build' ? '正在生成' : '答案末尾'}</small><b>{step.previous ? '[' + step.previous.join(', ') + ']' : step.current ? '[' + step.current.join(', ') + ']' : '空'}</b></section>
          <strong>{step.previous && step.current ? step.current[0] + ' ' + (step.overlaps ? '≤' : '>') + ' ' + step.previous[1] : step.phase === 'merge' ? '扩展边界' : '等待比较'}</strong>
          <section><small>当前区间</small><b>{step.current ? '[' + step.current.join(', ') + ']' : '暂无'}</b></section>
        </div>
        <div className={styles.rule}><span data-active={step.phase === 'sort' || undefined}>按左端点排序</span><span data-active={step.phase === 'compare' || undefined}>判断是否断开</span><span data-active={step.phase === 'merge' || undefined}>更新当前右端点</span><span data-active={step.phase === 'append' || undefined}>保存完整区间</span></div>
      </> : <EventBoard events={step.events} active={step.eventIndex} method={method} position={step.scanPosition} delta={step.delta} count={step.count} start={step.start} />}
      <Answer intervals={step.results} />
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function EventBoard({ events, active, method, position, delta, count, start }: { events: Array<[number, number]>; active: number; method: MergeMethod; position: number; delta: number; count: number; start: number }) {
  const activePosition = method === 'difference' ? active : events[active]?.[0]
  return <section className={styles.eventBoard}>
    <header><b>{method === 'difference' ? '放大 2 倍后的差分事件' : 'TreeMap 中按坐标排序的事件'}</b><small>{method === 'difference' ? '相邻不重叠区间会留出一个空格' : '同一坐标的增减会先合并'}</small></header>
    <div className={styles.events}>{events.length ? events.map(([x, value]) => <span key={x} data-active={x === activePosition || undefined}><i>x = {x}</i><b>{value > 0 ? '+' : ''}{value}</b></span>) : <em>正在创建端点事件…</em>}</div>
    <div className={styles.metrics}><span><small>当前位置</small><b>{position < 0 ? '—' : position}</b></span><span><small>本次变化</small><b>{delta > 0 ? '+' : ''}{delta}</b></span><span><small>覆盖数 cnt</small><b>{count}</b></span><span><small>区间起点</small><b>{start < 0 ? '未记录' : start}</b></span></div>
  </section>
}

function Answer({ intervals }: { intervals: Interval[] }) {
  return <section className={styles.answer}><header><b>ans</b><small>已经闭合的合并区间</small></header><div>{intervals.length === 0 ? <em>空数组</em> : intervals.map((interval) => <span key={interval.join('-')}>[{interval.join(', ')}]</span>)}</div></section>
}

function IntervalTrack({ intervals, activeIndex, title }: { intervals: Interval[]; activeIndex: number; title: string }) {
  return <section className={styles.track}><header><b>{title}</b><small>横向位置对应数轴 0–18</small></header><div className={styles.grid}>
    {intervals.map((interval, index) => <span data-active={index === activeIndex || undefined} style={{ gridColumn: (interval[0] + 1) + ' / ' + (interval[1] + 2) }} key={interval.join('-')}><b>[{interval.join(', ')}]</b></span>)}
  </div><div className={styles.axis}>{[0, 3, 6, 9, 12, 15, 18].map((value) => <i key={value}>{value}</i>)}</div></section>
}
