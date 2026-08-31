import { Eye, EyeOff, Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Phase = 'select' | 'sort' | 'lookup' | 'add' | 'done'
type Group = Record<string, string[]>

interface Step {
  wordIndex: number
  word: string
  key: string
  groups: Group
  phase: Phase
  exists: boolean
  message: string
  line: number
}

const words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']
const sourceCode = [
  'Map<String, List<String>> map = new HashMap<>();',
  'for (String str : strs) {',
  '  char[] chars = str.toCharArray();',
  '  Arrays.sort(chars);',
  '  String key = new String(chars);',
  '  List<String> group = map.getOrDefault(key, new ArrayList<>());',
  '  group.add(str);',
  '  map.put(key, group);',
  '}',
]

function copyGroups(groups: Group): Group {
  return Object.fromEntries(Object.entries(groups).map(([key, values]) => [key, [...values]]))
}

function makeSteps(): Step[] {
  const groups: Group = {}
  const steps: Step[] = []
  words.forEach((word, wordIndex) => {
    const key = [...word].sort().join('')
    const before = copyGroups(groups)
    const exists = Boolean(groups[key])
    steps.push({ wordIndex, word, key, groups: before, exists, phase: 'select', line: 1, message: `取出第 ${wordIndex + 1} 个字符串 “${word}”` })
    steps.push({ wordIndex, word, key, groups: before, exists, phase: 'sort', line: 3, message: `将 “${word}” 的字母排序，得到统一标记 key = “${key}”` })
    steps.push({ wordIndex, word, key, groups: before, exists, phase: 'lookup', line: 5, message: exists ? `哈希表里已经有 key “${key}” 的分组，直接取出这个桶` : `哈希表里还没有 key “${key}”，准备新建一个桶` })
    if (!groups[key]) groups[key] = []
    groups[key].push(word)
    steps.push({ wordIndex, word, key, groups: copyGroups(groups), exists, phase: 'add', line: 6, message: `把原字符串 “${word}” 放进 key 为 “${key}” 的分组` })
  })
  steps.push({ wordIndex: words.length - 1, word: '', key: '', groups: copyGroups(groups), exists: false, phase: 'done', line: 8, message: '遍历完成：哈希表中的每个桶，就是一组字母异位词' })
  return steps
}

const phaseNames: Record<Phase, string> = { select: '取出字符串', sort: '排序生成 key', lookup: '查询分组', add: '放入分组', done: '得到结果' }

export function GroupAnagramsVisualizer() {
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showCode, setShowCode] = useState(true)
  const steps = useMemo(() => makeSteps(), [])
  const step = steps[stepIndex]

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= steps.length - 1) {
      const timer = window.setTimeout(() => setPlaying(false), 0)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => {
      const nextStep = stepIndex + 1
      setStepIndex(nextStep)
      if (nextStep >= steps.length - 1) setPlaying(false)
    }, 1900)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, steps.length])

  const reset = () => { setStepIndex(0); setPlaying(false) }
  const next = () => { setStepIndex((current) => Math.min(current + 1, steps.length - 1)); setPlaying(false) }

  return (
    <div className="algorithm-player anagram-player">
      <div className="player-toolbar">
        <div className="method-tabs"><span className="active static-tab">排序作为 key <small>O(NK logK)</small></span></div>
        <span className="word-count">6 个字符串</span>
        <button className="code-toggle" onClick={() => setShowCode((visible) => !visible)} aria-pressed={showCode}>
          {showCode ? <EyeOff size={15} /> : <Eye size={15} />}{showCode ? '隐藏代码' : '显示代码'}
        </button>
      </div>

      <div className={`player-body ${showCode ? '' : 'code-hidden'}`}>
        <div className="animation-canvas anagram-canvas">
          <div className="string-input"><span>strs</span>{words.map((word, index) => <b className={index === step.wordIndex && step.phase !== 'done' ? 'active' : index < step.wordIndex || step.phase === 'done' ? 'used' : ''} key={`${word}-${index}`}>“{word}”</b>)}</div>

          {step.phase === 'done' ? (
            <div className="result-groups"><small>返回 map.values()</small><GroupBuckets groups={step.groups} currentKey="" phase="done" /></div>
          ) : (
            <>
              <div className="word-transform">
                <div className="word-card"><small>当前字符串</small><b>“{step.word}”</b></div>
                <span className={step.phase === 'sort' || step.phase === 'lookup' || step.phase === 'add' ? 'active' : ''}>排序 ↓</span>
                <div className={`key-card ${step.phase === 'sort' || step.phase === 'lookup' || step.phase === 'add' ? 'visible' : ''}`}><small>哈希表 key</small><b>“{step.phase === 'select' ? '?' : step.key}”</b></div>
              </div>
              <div className="group-area"><header><span>哈希表：key → 分组</span><small>{step.phase === 'lookup' ? '正在查询' : step.phase === 'add' ? '已写入' : '等待操作'}</small></header><GroupBuckets groups={step.groups} currentKey={step.key} phase={step.phase} /></div>
              <div className="anagram-track">{(['select', 'sort', 'lookup', 'add'] as const).map((phase, index) => <span className={step.phase === phase ? 'active' : ''} key={phase}><b>{index + 1}</b>{phaseNames[phase]}</span>)}</div>
            </>
          )}

          <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
        </div>

        {showCode && <div className="live-code">
          <header><span>Solution.java</span><i>同步高亮</i></header>
          <pre><code>{sourceCode.map((line, index) => <span className={step.line === index ? 'active-line' : ''} key={line}><b>{String(index + 1).padStart(2, '0')}</b>{line}</span>)}</code></pre>
        </div>}
      </div>

      <div className="player-controls">
        <button className="round-button" onClick={reset} aria-label="重新开始"><RotateCcw size={16} /></button>
        <button className="play-button" onClick={() => { if (stepIndex >= steps.length - 1) setStepIndex(0); setPlaying(!playing) }}>{playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}{playing ? '暂停' : stepIndex >= steps.length - 1 ? '重播' : '播放'}</button>
        <button className="round-button" onClick={next} aria-label="下一步"><SkipForward size={17} /></button>
        <div className="timeline"><i><b style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></i><span>{stepIndex + 1} / {steps.length}</span></div>
      </div>
    </div>
  )
}

function GroupBuckets({ groups, currentKey, phase }: { groups: Group; currentKey: string; phase: Phase }) {
  const entries = Object.entries(groups)
  return <div className="group-buckets">
    {entries.length === 0 && <em>还没有分组</em>}
    {entries.map(([key, values]) => <div className={`group-bucket ${key === currentKey && (phase === 'lookup' || phase === 'add') ? 'current' : ''}`} key={key}><b>key “{key}”</b><span>{values.map((word, index) => <i key={`${word}-${index}`}>“{word}”</i>)}</span></div>)}
  </div>
}
