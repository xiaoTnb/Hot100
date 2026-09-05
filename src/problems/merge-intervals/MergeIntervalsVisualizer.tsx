import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeMergeSteps, mergeCode, mergeMethods, mergeSorted, type Interval } from './steps'
import styles from './visualizer.module.css'

export function MergeIntervalsVisualizer() {
  const steps = useMemo(() => makeMergeSteps(), [])
  const playback = usePlayback(steps.length, 1700)
  const step = steps[playback.stepIndex]

  return <AlgorithmPlayer methods={mergeMethods} activeMethod="sort-scan" onMethodChange={playback.reset} playback={playback} code={mergeCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <IntervalTrack intervals={mergeSorted} activeIndex={step.currentIndex} />
      <div className={styles.comparison} data-overlap={step.overlaps === true ? 'yes' : step.overlaps === false ? 'no' : undefined}>
        <section><small>答案末尾</small><b>{step.previous ? `[${step.previous.join(', ')}]` : '空'}</b></section>
        <strong>{step.previous && step.current ? `${step.current[0]} ${step.overlaps ? '≤' : '>'} ${step.previous[1]}` : '等待比较'}</strong>
        <section><small>当前区间 p</small><b>{step.current ? `[${step.current.join(', ')}]` : '暂无'}</b></section>
      </div>
      <div className={styles.rule}><span data-active={step.phase === 'sort' || undefined}>按左端点排序</span><span data-active={step.phase === 'compare' || undefined}>和答案末尾比较</span><span data-active={step.phase === 'merge' || undefined}>重叠则延长右端点</span><span data-active={step.phase === 'append' || undefined}>不重叠则追加</span></div>
      <section className={styles.answer}><header><b>ans</b><small>始终保持互不重叠</small></header><div>{step.results.length === 0 ? <em>空数组</em> : step.results.map((interval) => <span key={interval.join('-')}>[{interval.join(', ')}]</span>)}</div></section>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}

function IntervalTrack({ intervals, activeIndex }: { intervals: Interval[]; activeIndex: number }) {
  return <section className={styles.track}><header><b>排序后的区间</b><small>横向位置对应数轴 0-18</small></header><div className={styles.grid}>
    {intervals.map((interval, index) => <span data-active={index === activeIndex || undefined} style={{ gridColumn: `${interval[0] + 1} / ${interval[1] + 2}` }} key={interval.join('-')}><b>[{interval.join(', ')}]</b></span>)}
  </div><div className={styles.axis}>{[0, 3, 6, 9, 12, 15, 18].map((value) => <i key={value}>{value}</i>)}</div></section>
}
