import { Eye, EyeOff, Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Method = 'brute' | 'hash'
interface Example { nums: number[]; target: number; answer: [number, number] }
interface AnimationStep {
  i: number; j?: number; sum?: number; need?: number
  entries: Array<[number, number]>; found: boolean; message: string; line: number
  phase: 'select' | 'calculate' | 'lookup' | 'store' | 'found'; matched?: boolean
}

const examples: Example[] = [
  { nums: [2, 11, 7, 15], target: 9, answer: [0, 2] },
  { nums: [3, 2, 4], target: 6, answer: [1, 2] },
  { nums: [3, 3], target: 6, answer: [0, 1] },
]
const bruteCode = [
  'class Solution {',
  '  public int[] twoSum(int[] nums, int target) {',
  '    int n = nums.length;',
  '    for (int i = 0; i < n; ++i) {',
  '      for (int j = i + 1; j < n; ++j) {',
  '        if (nums[i] + nums[j] == target) {',
  '          return new int[]{i, j};',
  '        }',
  '      }',
  '    }',
  '    return new int[0];',
  '  }',
  '}',
]
const hashCode = [
  'class Solution {',
  '  public int[] twoSum(int[] nums, int target) {',
  '    Map<Integer, Integer> hashtable = new HashMap<Integer, Integer>();',
  '    for (int i = 0; i < nums.length; ++i) {',
  '      if (hashtable.containsKey(target - nums[i])) {',
  '        return new int[]{hashtable.get(target - nums[i]), i};',
  '      }',
  '      hashtable.put(nums[i], i);',
  '    }',
  '    return new int[0];',
  '  }',
  '}',
]

function makeBruteSteps(example: Example): AnimationStep[] {
  const steps: AnimationStep[] = []
  for (let i = 0; i < example.nums.length; i++) {
    for (let j = i + 1; j < example.nums.length; j++) {
      const sum = example.nums[i] + example.nums[j]
      const found = sum === example.target
      steps.push({
        i, j, sum, found: false, entries: [], line: 4, phase: 'select',
        message: `固定 i = ${i}，让 j = ${j}，读取 ${example.nums[i]} 和 ${example.nums[j]}`,
      })
      steps.push({
        i, j, sum, found, entries: [], line: found ? 6 : 5, phase: found ? 'found' : 'lookup',
        message: found
          ? `${example.nums[i]} + ${example.nums[j]} = ${example.target}，找到答案 [${i}, ${j}]`
          : `${example.nums[i]} + ${example.nums[j]} = ${sum}，不等于 ${example.target}，继续比较`,
      })
      if (found) return steps
    }
  }
  return steps
}

function makeHashSteps(example: Example): AnimationStep[] {
  const map = new Map<number, number>()
  const steps: AnimationStep[] = []
  for (let i = 0; i < example.nums.length; i++) {
    const value = example.nums[i]
    const need = example.target - value
    const foundIndex = map.get(need)
    steps.push({
      i, need, entries: [...map.entries()], found: false, line: 3, phase: 'select',
      message: `遍历到下标 ${i}，取出当前数字 ${value}`,
    })
    steps.push({
      i, need, entries: [...map.entries()], found: false, line: 4, phase: 'calculate',
      message: `目标是 ${example.target}，当前有 ${value}，先计算还缺少什么：${example.target} − ${value} = ${need}`,
    })
    steps.push({
      i, need, entries: [...map.entries()], found: false, j: foundIndex, line: 4, phase: 'lookup', matched: foundIndex !== undefined,
      message: foundIndex !== undefined
        ? `带着补数 ${need} 查询哈希表，找到了它对应的下标 ${foundIndex}`
        : `带着补数 ${need} 查询哈希表，当前没有找到`,
    })
    if (foundIndex !== undefined) {
      steps.push({
        i, j: foundIndex, need, entries: [...map.entries()], found: true, line: 5, phase: 'found', matched: true,
        message: `补数 ${need} 在下标 ${foundIndex}，所以 nums[${foundIndex}] + nums[${i}] = ${example.target}，返回 [${foundIndex}, ${i}]`,
      })
      return steps
    }
    map.set(value, i)
    steps.push({
      i, need, entries: [...map.entries()], found: false, line: 7, phase: 'store',
      message: `存入 ${value} → ${i}，继续查看下一个数字`,
    })
  }
  return steps
}

function phaseLabel(phase: AnimationStep['phase']) {
  return ({ select: '01 · 取出当前数字', calculate: '02 · 计算补数', lookup: '03 · 查询哈希表', store: '04 · 写入哈希表', found: '05 · 返回答案' })[phase]
}

export function TwoSumVisualizer() {
  const [method, setMethod] = useState<Method>('hash')
  const [exampleIndex, setExampleIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [showCode, setShowCode] = useState(true)
  const example = examples[exampleIndex]
  const steps = useMemo(() => method === 'brute' ? makeBruteSteps(example) : makeHashSteps(example), [method, example])
  const step = steps[stepIndex] ?? steps[0]
  const code = method === 'brute' ? bruteCode : hashCode

  useEffect(() => {
    if (!playing) return
    if (stepIndex >= steps.length - 1) {
      const stopTimer = window.setTimeout(() => setPlaying(false), 0)
      return () => window.clearTimeout(stopTimer)
    }
    const timer = window.setTimeout(() => {
      const nextStep = stepIndex + 1
      setStepIndex(nextStep)
      if (nextStep >= steps.length - 1) setPlaying(false)
    }, 2400)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, steps.length])

  const reset = () => { setStepIndex(0); setPlaying(false) }
  const next = () => { setStepIndex((current) => Math.min(current + 1, steps.length - 1)); setPlaying(false) }

  return (
    <div className="algorithm-player">
      <div className="player-toolbar">
        <div className="method-tabs" aria-label="选择解法">
          <button className={method === 'brute' ? 'active' : ''} onClick={() => { setMethod('brute'); setStepIndex(0); setPlaying(false) }}>暴力枚举 <small>O(N²)</small></button>
          <button className={method === 'hash' ? 'active' : ''} onClick={() => { setMethod('hash'); setStepIndex(0); setPlaying(false) }}>哈希表 <small>O(N)</small></button>
        </div>
        <div className="example-tabs" aria-label="选择示例">
          <span>示例</span>
          {examples.map((item, index) => <button className={exampleIndex === index ? 'active' : ''} onClick={() => { setExampleIndex(index); setStepIndex(0); setPlaying(false) }} key={item.nums.join('-')}>{index + 1}</button>)}
        </div>
        <button className="code-toggle" onClick={() => setShowCode((visible) => !visible)} aria-pressed={showCode}>
          {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
          {showCode ? '隐藏代码' : '显示代码'}
        </button>
      </div>

      <div className={`player-body ${showCode ? '' : 'code-hidden'}`}>
        <div className="animation-canvas">
          <div className="input-readout"><code>nums = [{example.nums.join(', ')}]</code><span>target <b>{example.target}</b></span></div>
          <div className="array-visual" aria-label={`数组 ${example.nums.join(', ')}`}>
            {example.nums.map((value, index) => {
              const isI = index === step.i
              const isPair = index === step.j
              const isFound = step.found && (isI || isPair)
              return (
                <div className={`array-item ${isI ? 'is-i' : ''} ${isPair ? method === 'hash' ? 'is-need' : 'is-j' : ''} ${isFound ? 'is-found' : ''}`} key={`${value}-${index}`}>
                  <div className="pointer-space">
                    {isI && <span className="index-pointer pointer-i">i</span>}
                    {isPair && <span className={`index-pointer ${method === 'hash' ? 'pointer-need' : 'pointer-j'}`}>{method === 'hash' ? 'need' : 'j'}</span>}
                  </div>
                  <strong>{value}</strong><small>index {index}</small>
                </div>
              )
            })}
          </div>

          {method === 'hash' ? (
            <>
              <div className="hash-area">
                <div className={`operation-card phase-${step.phase}`}>
                  <small>{phaseLabel(step.phase)}</small>
                  {step.phase === 'select'
                    ? <><span>当前数字</span><b>{example.nums[step.i]}</b></>
                    : <><span>{example.target} − {example.nums[step.i]}</span><b>= {step.need}</b></>}
                </div>
                <div className="hash-table">
                  <header><span>哈希表</span><small>数字 → 下标</small></header>
                  <div className="hash-entries">
                    {step.entries.length === 0 && <em>目前是空的</em>}
                    {step.entries.map(([value, index]) => <span className={step.matched && value === step.need ? 'matched' : ''} key={`${value}-${index}`}><b>{value}</b><i>→</i>{index}</span>)}
                  </div>
                </div>
              </div>
              <div className="phase-track" aria-label={`当前操作：${phaseLabel(step.phase)}`}>
                {(['select', 'calculate', 'lookup', 'store', 'found'] as const).map((phase, index) => (
                  <span className={phase === step.phase ? 'active' : ''} key={phase}><b>{index + 1}</b>{phaseLabel(phase).slice(5)}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="compare-equation">
              <span>{example.nums[step.i]}</span><i>+</i><span>{example.nums[step.j ?? 0]}</span><i>=</i><b className={step.found ? 'success' : ''}>{step.sum}</b>
              <small>{step.found ? `等于 target ${example.target}` : `不等于 target ${example.target}`}</small>
            </div>
          )}

          <div className={`step-message ${step.found ? 'success' : ''}`} aria-live="polite">
            <span>{step.found ? <i className="check-symbol">✓</i> : String(stepIndex + 1).padStart(2, '0')}</span><p>{step.message}</p>
          </div>
        </div>

        {showCode && <div className="live-code">
          <header><span>Solution.java</span><i>同步高亮</i></header>
          <pre><code>{code.map((line, index) => <span className={step.line === index ? 'active-line' : ''} key={line + index}><b>{String(index + 1).padStart(2, '0')}</b><i className="code-text">{line}</i></span>)}</code></pre>
        </div>}
      </div>

      <div className="player-controls">
        <button className="round-button" onClick={reset} aria-label="重新开始"><RotateCcw size={16} /></button>
        <button className="play-button" onClick={() => { if (stepIndex >= steps.length - 1) setStepIndex(0); setPlaying(!playing) }}>
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}{playing ? '暂停' : stepIndex >= steps.length - 1 ? '重播' : '播放'}
        </button>
        <button className="round-button" onClick={next} aria-label="下一步"><SkipForward size={17} /></button>
        <div className="timeline"><i><b style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></i><span>{stepIndex + 1} / {steps.length}</span></div>
      </div>
    </div>
  )
}
