import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { makeSortSteps, samples, sortCode, sortFacts, sortMethods, type SortId } from './steps'
import styles from './visualizer.module.css'

const speeds = [
  { label: '慢速', ms: 1300 },
  { label: '正常', ms: 780 },
  { label: '快速', ms: 380 },
]

export function SortingAlgorithmsVisualizer() {
  const [method, setMethod] = useState<SortId>('bubble')
  const [sample, setSample] = useState(0)
  const [speed, setSpeed] = useState(1)
  const steps = useMemo(() => makeSortSteps(method, samples[sample].values), [method, sample])
  const playback = usePlayback(steps.length, speeds[speed].ms)
  const step = steps[Math.min(playback.stepIndex, steps.length - 1)]
  const facts = sortFacts[method]
  const values = samples[sample].values
  const min = Math.min(...values)
  const max = Math.max(...values)

  const changeMethod = (id: string) => {
    playback.reset()
    setMethod(id as SortId)
  }
  const changeSample = (index: number) => {
    playback.reset()
    setSample(index)
  }

  return (
    <AlgorithmPlayer methods={sortMethods} activeMethod={method} onMethodChange={changeMethod} playback={playback} code={sortCode(method)} activeLineId={step.lineId} className={styles.player}>
      <div className={`animation-canvas ${styles.canvas}`}>
        <div className={styles.options}>
          <div className={styles.optionGroup} role="group" aria-label="选择数据样例"><span>数据样例</span>{samples.map((item, index) => <button key={item.label} className={sample === index ? styles.selected : ''} onClick={() => changeSample(index)} aria-pressed={sample === index}>{item.label}</button>)}</div>
          <div className={styles.optionGroup} role="group" aria-label="播放速度"><span>播放速度</span>{speeds.map((item, index) => <button key={item.label} className={speed === index ? styles.selected : ''} onClick={() => setSpeed(index)} aria-pressed={speed === index}>{item.label}</button>)}</div>
        </div>

        <div className={styles.summary}><b>{sortMethods.find(item => item.id === method)?.label}排序</b><span>{facts.idea}</span></div>
        <div className={styles.board}>
          <header><span>排序过程</span><span>比较 {step.comparisons} 次 <i>·</i> 写入 {step.writes} 次</span></header>
          <div className={styles.bars} aria-label={`当前数组：${step.items.map(item => item.value).join('、')}`}>
            {step.items.map((item, index) => {
              const height = 24 + ((item.value - min) / Math.max(1, max - min)) * 76
              const state = step.done || step.fixed.includes(index) ? 'fixed' : step.pivot === index ? 'pivot' : step.active.includes(index) ? 'active' : 'idle'
              return <div className={styles.barSlot} data-state={state} data-outside={step.range && (index < step.range[0] || index > step.range[1]) || undefined} key={index}>
                <span className={styles.barValue}>{item.value}</span>
                <div className={styles.barTrack}><div className={styles.bar} style={{ height: `${height}%` }} /></div>
                <span className={styles.barIndex}>#{item.id + 1}</span>
              </div>
            })}
          </div>
          <footer><span>原始位置 # 用来观察相同数值的顺序</span><span>{step.done ? '已完成' : `步骤 ${playback.stepIndex + 1} / ${steps.length}`}</span></footer>
        </div>

        {step.auxiliary && <div className={styles.auxiliary}><div className={styles.auxTitle}><b>{step.auxiliary.title}</b><span>辅助数组</span></div><div className={styles.auxCells}>{step.auxiliary.cells.map((cell, index) => <span key={index} data-active={step.auxiliary?.active === index || undefined}>{cell}</span>)}</div></div>}

        <div className={styles.facts}><span><b>平均时间</b>{sortMethods.find(item => item.id === method)?.complexity}</span><span><b>额外空间</b>{facts.space}</span><span><b>稳定性</b>{facts.stable ? '稳定' : '不稳定'}</span></div>
        <div className={`step-message ${step.done ? 'success' : ''}`} aria-live="polite"><span>{step.done ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}
