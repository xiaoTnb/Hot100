import { useMemo } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeQueueSteps, queueCode, queueMethods, windowNumbers, windowSize } from './steps'
import styles from './visualizer.module.css'

export function SlidingWindowMaximumVisualizer() {
  const steps = useMemo(() => makeQueueSteps(), [])
  const playback = usePlayback(steps.length, 1700)
  const step = steps[playback.stepIndex]
  const windowReady = step.index - step.left + 1 >= windowSize
  return <AlgorithmPlayer methods={queueMethods} activeMethod="deque" onMethodChange={playback.reset} playback={playback} code={queueCode} activeLineId={step.lineId}>
    <div className={`animation-canvas ${styles.canvas}`}>
      <div className={styles.inputLine}><span>动画用例</span><code>nums = [{windowNumbers.join(', ')}]</code><b>k = {windowSize}</b></div>
      <section className={styles.array}><span>nums</span>{windowNumbers.map((number, index) => <div data-window={index >= step.left && index <= step.index || undefined} data-current={index === step.index || undefined} data-removed={index === step.removedIndex || undefined} data-maximum={step.queue[0] === index && windowReady || undefined} key={index}><i>{index === step.left && step.index >= 0 && <b data-side="left">l</b>}{index === step.index && <b data-side="right">r</b>}</i><strong>{number}</strong><small>{index}</small></div>)}</section>
      <section className={styles.queue}><header><b>单调队列 q · 存下标</b><small>队首 → 队尾，对应数值保持单调递减</small></header><div className={styles.queueBody}><i>队首</i>{step.queue.length === 0 ? <em>空队列</em> : step.queue.map((index, position) => <span data-front={position === 0 || undefined} key={index}><small>下标 {index}</small><b>{windowNumbers[index]}</b></span>)}<i>队尾</i></div></section>
      <div className={styles.logic}>
        <section><small>窗口范围</small><b>{step.index < 0 ? '等待开始' : `[${step.left}, ${step.index}]`}</b><span>{windowReady ? `长度 ${windowSize}，可以记录答案` : `还需 ${Math.max(0, windowSize - (step.index - step.left + 1))} 个数`}</span></section>
        <section><small>当前最大值</small><b>{windowReady && step.queue.length > 0 ? windowNumbers[step.queue[0]] : '—'}</b><span>{windowReady && step.queue.length > 0 ? `q.getFirst() = ${step.queue[0]}` : '窗口未满时暂不记录'}</span></section>
        <section className={styles.answers}><small>ans</small><div>{step.answers.map((answer, index) => <b data-filled={answer !== null || undefined} key={index}>{answer ?? '·'}</b>)}</div></section>
      </div>
      <div className={styles.rule}><span data-active={step.phase === 'inspect' || step.phase === 'prune' || step.phase === 'push' || undefined}>① 右边入：删掉更弱的队尾</span><span data-active={step.phase === 'expire' || undefined}>② 左边出：删除过期队首</span><span data-active={step.phase === 'record' || undefined}>③ 队首记录为最大值</span></div>
      <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
    </div>
  </AlgorithmPlayer>
}
