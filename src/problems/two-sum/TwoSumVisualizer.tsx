import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getTwoSumCode, makeTwoSumSteps, twoSumExamples, twoSumMethods, twoSumPhaseLabel, type TwoSumMethod } from './steps'
import styles from './visualizer.module.css'

export function TwoSumVisualizer() {
  const [method, setMethod] = useState<TwoSumMethod>('hash')
  const [exampleIndex, setExampleIndex] = useState(0)
  const example = twoSumExamples[exampleIndex]
  const steps = useMemo(() => makeTwoSumSteps(method, example), [method, example])
  const playback = usePlayback(steps.length, 2400)
  const step = steps[playback.stepIndex] ?? steps[0]

  const selectMethod = (methodId: string) => {
    setMethod(methodId as TwoSumMethod)
    playback.reset()
  }

  const selectExample = (index: number) => {
    setExampleIndex(index)
    playback.reset()
  }

  return (
    <AlgorithmPlayer
      methods={twoSumMethods}
      activeMethod={method}
      onMethodChange={selectMethod}
      playback={playback}
      code={getTwoSumCode(method)}
      activeLineId={step.lineId}
      toolbarExtra={(
        <div className="example-tabs" aria-label="选择示例">
          <span>示例</span>
          {twoSumExamples.map((item, index) => (
            <button className={exampleIndex === index ? 'active' : ''} onClick={() => selectExample(index)} key={item.nums.join('-')}>{index + 1}</button>
          ))}
        </div>
      )}
    >
      <div className="animation-canvas">
        <div className={styles.inputReadout}><code>nums = [{example.nums.join(', ')}]</code><span>target <b>{example.target}</b></span></div>
        <div className={styles.array} aria-label={`数组 ${example.nums.join(', ')}`}>
          {example.nums.map((value, index) => {
            const isI = index === step.i
            const isPair = index === step.j
            const isFound = step.found && (isI || isPair)
            return (
              <div className={styles.item} data-role={isI ? 'current' : isPair ? method === 'hash' ? 'need' : 'candidate' : 'idle'} data-found={isFound || undefined} key={`${value}-${index}`}>
                <div className={styles.pointerSpace}>
                  {isI && <span className={`${styles.pointer} ${styles.pointerI}`}>i</span>}
                  {isPair && <span className={`${styles.pointer} ${method === 'hash' ? styles.pointerNeed : styles.pointerJ}`}>{method === 'hash' ? 'need' : 'j'}</span>}
                </div>
                <strong>{value}</strong><small>index {index}</small>
              </div>
            )
          })}
        </div>

        {method === 'hash' ? (
          <>
            <div className={styles.hashArea}>
              <div className={styles.operationCard} data-phase={step.phase}>
                <small>{twoSumPhaseLabel(step.phase)}</small>
                {step.phase === 'select'
                  ? <><span>当前数字</span><b>{example.nums[step.i]}</b></>
                  : <><span>{example.target} − {example.nums[step.i]}</span><b>= {step.need}</b></>}
              </div>
              <div className={styles.hashTable}>
                <header><span>哈希表</span><small>数字 → 下标</small></header>
                <div className={styles.hashEntries}>
                  {step.entries.length === 0 && <em>目前是空的</em>}
                  {step.entries.map(([value, index]) => <span data-matched={step.matched && value === step.need || undefined} key={`${value}-${index}`}><b>{value}</b><i>→</i>{index}</span>)}
                </div>
              </div>
            </div>
            <div className={styles.phaseTrack} aria-label={`当前操作：${twoSumPhaseLabel(step.phase)}`}>
              {(['select', 'calculate', 'lookup', 'store', 'found'] as const).map((phase, index) => (
                <span data-active={phase === step.phase || undefined} key={phase}><b>{index + 1}</b>{twoSumPhaseLabel(phase).slice(5)}</span>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.equation}>
            <span>{example.nums[step.i]}</span><i>+</i><span>{example.nums[step.j ?? 0]}</span><i>=</i><b data-success={step.found || undefined}>{step.sum}</b>
            <small>{step.found ? `等于 target ${example.target}` : `不等于 target ${example.target}`}</small>
          </div>
        )}

        <div className={`step-message ${step.found ? 'success' : ''}`} aria-live="polite">
          <span>{step.found ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p>
        </div>
      </div>
    </AlgorithmPlayer>
  )
}
