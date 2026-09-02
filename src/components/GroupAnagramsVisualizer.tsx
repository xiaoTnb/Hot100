import { Eye, EyeOff, Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Method = 'sort' | 'count'
type Phase = 'select' | 'transform' | 'key' | 'lookup' | 'add' | 'done'
type Group = Record<string, string[]>
type Counts = number[]

interface Step { wordIndex: number; word: string; key: string; counts: Counts; groups: Group; phase: Phase; exists: boolean; message: string; line: number }

const words = ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']
const sortCode = [
  'Map<String, List<String>> map = new HashMap<>();', 'for (String str : strs) {', '  char[] chars = str.toCharArray();',
  '  Arrays.sort(chars);', '  String key = new String(chars);', '  List<String> group = map.getOrDefault(key, new ArrayList<>());',
  '  group.add(str);', '  map.put(key, group);', '}',
]
const countCode = [
  'class Solution {',
  '  public List<List<String>> groupAnagrams(String[] strs) {',
  '    Map<String, List<String>> map = new HashMap<String, List<String>>();',
  '    for (String str : strs) {',
  '      int[] counts = new int[26];',
  '      int length = str.length();',
  '      for (int i = 0; i < length; i++) {',
  '        counts[str.charAt(i) - \'a\']++;',
  '      }',
  '      StringBuffer sb = new StringBuffer();',
  '      for (int i = 0; i < 26; i++) {',
  '        if (counts[i] != 0) {',
  '          sb.append((char) (\'a\' + i));',
  '          sb.append(counts[i]);',
  '        }',
  '      }',
  '      String key = sb.toString();',
  '      List<String> list = map.getOrDefault(key, new ArrayList<String>());',
  '      list.add(str);',
  '      map.put(key, list);',
  '    }',
  '    return new ArrayList<List<String>>(map.values());',
  '  }',
  '}',
]

const phaseNames: Record<Phase, string> = { select: '取出字符串', transform: '生成标记', key: '得到 key', lookup: '查询分组', add: '放入分组', done: '得到结果' }

function copyGroups(groups: Group): Group { return Object.fromEntries(Object.entries(groups).map(([key, values]) => [key, [...values]])) }
function countLetters(word: string): Counts {
  const counts = Array<number>(26).fill(0)
  for (const letter of word) counts[letter.charCodeAt(0) - 97]++
  return counts
}
function nonzeroCounts(counts: Counts): Array<[string, number]> {
  return counts.flatMap((count, index) => count === 0 ? [] : [[String.fromCharCode(97 + index), count]])
}
function makeKey(word: string, method: Method) {
  const counts = countLetters(word)
  return { counts, key: method === 'sort' ? [...word].sort().join('') : nonzeroCounts(counts).map(([letter, count]) => `${letter}${count}`).join('') }
}
function makeSteps(method: Method): Step[] {
  const groups: Group = {}; const steps: Step[] = []
  words.forEach((word, wordIndex) => {
    const { key, counts } = makeKey(word, method); const before = copyGroups(groups); const exists = Boolean(groups[key])
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'select', line: method === 'sort' ? 1 : 3, message: `取出第 ${wordIndex + 1} 个字符串 “${word}”` })
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'transform', line: method === 'sort' ? 3 : 7, message: method === 'sort' ? `把 “${word}” 按字母排序` : `在长度为 26 的 counts 数组中，累计 “${word}” 每个字母的出现次数` })
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'key', line: method === 'sort' ? 4 : 12, message: method === 'sort' ? `排序结果 “${key}” 作为哈希表的 key` : `只拼接非零的字母和次数，得到 key = “${key}”` })
    steps.push({ wordIndex, word, key, counts, groups: before, exists, phase: 'lookup', line: method === 'sort' ? 5 : 17, message: exists ? `找到已有 key “${key}” 的分组` : `没有 key “${key}” 的分组，准备新建桶` })
    if (!groups[key]) groups[key] = []; groups[key].push(word)
    steps.push({ wordIndex, word, key, counts, groups: copyGroups(groups), exists, phase: 'add', line: method === 'sort' ? 6 : 18, message: `把原字符串 “${word}” 放进 key 为 “${key}” 的分组，再写回哈希表` })
  })
  steps.push({ wordIndex: words.length - 1, word: '', key: '', counts: Array<number>(26).fill(0), groups: copyGroups(groups), exists: false, phase: 'done', line: method === 'sort' ? 7 : 21, message: '遍历完成：哈希表的每个桶，就是一组字母异位词' })
  return steps
}

export function GroupAnagramsVisualizer() {
  const [method, setMethod] = useState<Method>('sort')
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showCode, setShowCode] = useState(true)
  const steps = useMemo(() => makeSteps(method), [method])
  const step = steps[stepIndex]
  const code = method === 'sort' ? sortCode : countCode
  const resetMethod = (nextMethod: Method) => { setMethod(nextMethod); setStepIndex(0); setPlaying(false) }

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= steps.length - 1) { const timer = window.setTimeout(() => setPlaying(false), 0); return () => window.clearTimeout(timer) }
    const timer = window.setTimeout(() => { const nextStep = stepIndex + 1; setStepIndex(nextStep); if (nextStep >= steps.length - 1) setPlaying(false) }, 1900)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, steps.length])

  return <div className="algorithm-player anagram-player">
    <div className="player-toolbar">
      <div className="method-tabs" aria-label="选择解法">
        <button className={method === 'sort' ? 'active' : ''} onClick={() => resetMethod('sort')}>排序作为 key <small>O(NK logK)</small></button>
        <button className={method === 'count' ? 'active' : ''} onClick={() => resetMethod('count')}>计数作为 key <small>O(N(K+26))</small></button>
      </div>
      <span className="word-count">6 个字符串</span>
      <button className="code-toggle" onClick={() => setShowCode((visible) => !visible)} aria-pressed={showCode}>{showCode ? <EyeOff size={15} /> : <Eye size={15} />}{showCode ? '隐藏代码' : '显示代码'}</button>
    </div>

    <div className={`player-body ${showCode ? '' : 'code-hidden'}`}>
      <div className="animation-canvas anagram-canvas">
        <div className="string-input"><span>strs</span>{words.map((word, index) => <b className={index === step.wordIndex && step.phase !== 'done' ? 'active' : index < step.wordIndex || step.phase === 'done' ? 'used' : ''} key={`${word}-${index}`}>“{word}”</b>)}</div>
        {step.phase === 'done' ? <div className="result-groups"><small>返回 map.values()</small><GroupBuckets groups={step.groups} currentKey="" phase="done" /></div> : <>
          <div className={`word-transform ${method === 'count' ? 'count-transform' : ''}`}>
            <div className="word-card"><small>当前字符串</small><b>“{step.word}”</b></div>
            <span className={step.phase !== 'select' ? 'active' : ''}>{method === 'sort' ? '排序 ↓' : '统计 ↓'}</span>
            {method === 'count' && <div className={`counts-card ${step.phase !== 'select' ? 'visible' : ''}`}><small>非零计数</small><b>{step.phase === 'select' ? '?' : nonzeroCounts(step.counts).map(([letter, count]) => <i key={letter}>{letter}:{count}</i>)}</b></div>}
            <div className={`key-card ${step.phase === 'key' || step.phase === 'lookup' || step.phase === 'add' ? 'visible' : ''}`}><small>哈希表 key</small><b>“{step.phase === 'select' || step.phase === 'transform' ? '?' : step.key}”</b></div>
          </div>
          {method === 'count' && <div className={`count-array ${step.phase === 'select' ? '' : 'visible'}`}>
            <header><span>counts[26]</span><small>下标 = 字母 − 'a'</small></header>
            <div>{step.counts.map((count, index) => <span className={count > 0 ? 'nonzero' : ''} key={index}><small>{index}</small><b>{String.fromCharCode(97 + index)}</b><i>{count}</i></span>)}</div>
          </div>}
          <div className="group-area"><header><span>哈希表：key → 分组</span><small>{step.phase === 'lookup' ? '正在查询' : step.phase === 'add' ? '已写入' : '等待操作'}</small></header><GroupBuckets groups={step.groups} currentKey={step.key} phase={step.phase} /></div>
          <div className="anagram-track">{(['select', 'transform', 'key', 'lookup', 'add'] as const).map((phase, index) => <span className={step.phase === phase ? 'active' : ''} key={phase}><b>{index + 1}</b>{phaseNames[phase]}</span>)}</div>
        </>}
        <div className={`step-message ${step.phase === 'done' ? 'success' : ''}`} aria-live="polite"><span>{step.phase === 'done' ? <i className="check-symbol">✓</i> : String(stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p></div>
      </div>
      {showCode && <div className="live-code"><header><span>Solution.java</span><i>同步高亮</i></header><pre><code>{code.map((line, index) => <span className={step.line === index ? 'active-line' : ''} key={line}><b>{String(index + 1).padStart(2, '0')}</b><i className="code-text">{line}</i></span>)}</code></pre></div>}
    </div>
    <div className="player-controls">
      <button className="round-button" onClick={() => { setStepIndex(0); setPlaying(false) }} aria-label="重新开始"><RotateCcw size={16} /></button>
      <button className="play-button" onClick={() => { if (stepIndex >= steps.length - 1) setStepIndex(0); setPlaying(!playing) }}>{playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}{playing ? '暂停' : stepIndex >= steps.length - 1 ? '重播' : '播放'}</button>
      <button className="round-button" onClick={() => { setStepIndex((current) => Math.min(current + 1, steps.length - 1)); setPlaying(false) }} aria-label="下一步"><SkipForward size={17} /></button>
      <div className="timeline"><i><b style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></i><span>{stepIndex + 1} / {steps.length}</span></div>
    </div>
  </div>
}

function GroupBuckets({ groups, currentKey, phase }: { groups: Group; currentKey: string; phase: Phase }) {
  const entries = Object.entries(groups)
  return <div className="group-buckets">{entries.length === 0 && <em>还没有分组</em>}{entries.map(([key, values]) => <div className={`group-bucket ${key === currentKey && (phase === 'lookup' || phase === 'add') ? 'current' : ''}`} key={key}><b>key “{key}”</b><span>{values.map((word, index) => <i key={`${word}-${index}`}>“{word}”</i>)}</span></div>)}</div>
}
