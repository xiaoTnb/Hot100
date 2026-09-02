import { useMemo, useState } from 'react'
import { AlgorithmPlayer } from '../../components/player/AlgorithmPlayer'
import { usePlayback } from '../../components/player/usePlayback'
import { getGroupCode, groupMethods, groupPhaseNames, groupWords, makeGroupSteps, nonzeroCounts, type Group, type GroupMethod, type GroupPhase } from './steps'
import styles from './visualizer.module.css'

export function GroupAnagramsVisualizer() {
  const [method, setMethod] = useState<GroupMethod>('sort')
  const steps = useMemo(() => makeGroupSteps(method), [method])
  const playback = usePlayback(steps.length, 1900)
  const step = steps[playback.stepIndex]

  const selectMethod = (methodId: string) => {
    setMethod(methodId as GroupMethod)
    playback.reset()
  }

  return (
    <AlgorithmPlayer
      methods={groupMethods}
      activeMethod={method}
      onMethodChange={selectMethod}
      playback={playback}
      code={getGroupCode(method)}
      activeLineId={step.lineId}
      toolbarExtra={<span className={styles.wordCount}>{groupWords.length} 个字符串</span>}
    >
      <div className={`animation-canvas ${styles.canvas}`}>
        <div className={styles.stringInput}><span>strs</span>{groupWords.map((word, index) => <b data-state={index === step.wordIndex && step.phase !== 'done' ? 'active' : index < step.wordIndex || step.phase === 'done' ? 'used' : 'idle'} key={`${word}-${index}`}>“{word}”</b>)}</div>
        {step.phase === 'done' ? <div className={styles.resultGroups}><small>返回 map.values()</small><GroupBuckets groups={step.groups} currentKey="" phase="done" /></div> : <>
          <div className={styles.wordTransform} data-method={method}>
            <div className={styles.wordCard}><small>当前字符串</small><b>“{step.word}”</b></div>
            <span data-active={step.phase !== 'select' || undefined}>{method === 'sort' ? '排序 ↓' : '统计 ↓'}</span>
            {method === 'count' && <div className={styles.countsCard} data-visible={step.phase !== 'select' || undefined}><small>非零计数</small><b>{step.phase === 'select' ? '?' : nonzeroCounts(step.counts).map(([letter, count]) => <i key={letter}>{letter}:{count}</i>)}</b></div>}
            <div className={styles.keyCard} data-visible={step.phase === 'key' || step.phase === 'lookup' || step.phase === 'add' || undefined}><small>哈希表 key</small><b>“{step.phase === 'select' || step.phase === 'transform' ? '?' : step.key}”</b></div>
          </div>
          {method === 'count' && <div className={styles.countArray} data-visible={step.phase !== 'select' || undefined}>
            <header><span>counts[26]</span><small>下标 = 字母 − 'a'</small></header>
            <div>{step.counts.map((count, index) => <span data-nonzero={count > 0 || undefined} key={index}><small>{index}</small><b>{String.fromCharCode(97 + index)}</b><i>{count}</i></span>)}</div>
          </div>}
          <div className={styles.groupArea}><header><span>哈希表：key → 分组</span><small>{step.phase === 'lookup' ? '正在查询' : step.phase === 'add' ? '已写入' : '等待操作'}</small></header><GroupBuckets groups={step.groups} currentKey={step.key} phase={step.phase} /></div>
          <div className={styles.phaseTrack}>{(['select', 'transform', 'key', 'lookup', 'add'] as const).map((phase, index) => <span data-active={step.phase === phase || undefined} key={phase}><b>{index + 1}</b>{groupPhaseNames[phase]}</span>)}</div>
        </>}
        <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(playback.stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
    </AlgorithmPlayer>
  )
}

function GroupBuckets({ groups, currentKey, phase }: { groups: Group; currentKey: string; phase: GroupPhase }) {
  const entries = Object.entries(groups)
  return <div className={styles.groupBuckets}>{entries.length === 0 && <em>还没有分组</em>}{entries.map(([key, values]) => <div className={styles.groupBucket} data-current={key === currentKey && (phase === 'lookup' || phase === 'add') || undefined} key={key}><b>key “{key}”</b><span>{values.map((word, index) => <i key={`${word}-${index}`}>“{word}”</i>)}</span></div>)}</div>
}
