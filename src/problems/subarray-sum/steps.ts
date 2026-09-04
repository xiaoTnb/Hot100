import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type PrefixMethod = 'two-pass' | 'one-seed' | 'one-before'
export type PrefixPhase = 'ready' | 'build' | 'seed' | 'sum' | 'query' | 'record' | 'done'
export interface PrefixStep {
  phase: PrefixPhase
  arrayIndex: number
  prefixIndex: number
  prefix: number[]
  sum: number
  need: number
  found: number
  matchedStarts: number[]
  mapEntries: [number, number][]
  activeMapKey: number | null
  ans: number
  lineId: string
  message: string
}

export const prefixNumbers = [1, -1, 2, 1, -1, 2]
export const prefixTarget = 2
export const prefixMethods: PlayerMethod[] = [
  { id: 'two-pass', label: '两次遍历', complexity: 'O(N) · O(N)' },
  { id: 'one-seed', label: '一次遍历 · 先放 0', complexity: 'O(N) · O(N)' },
  { id: 'one-before', label: '一次遍历 · 先记 s', complexity: 'O(N) · O(N)' },
]

const twoPassCode: CodeLine[] = [
  { id: 't-class', text: 'class Solution {' },
  { id: 't-method', text: '  public int subarraySum(int[] nums, int k) {' },
  { id: 't-n', text: '    int n = nums.length;' },
  { id: 't-prefix', text: '    int[] s = new int[n + 1];' },
  { id: 't-build-loop', text: '    for (int i = 0; i < n; i++) {' },
  { id: 't-build', text: '      s[i + 1] = s[i] + nums[i];' },
  { id: 't-build-close', text: '    }' },
  { id: 't-blank-1', text: '' },
  { id: 't-map', text: '    Map<Integer, Integer> cnt = new HashMap<>(n + 1, 1);' },
  { id: 't-ans', text: '    int ans = 0;' },
  { id: 't-loop', text: '    for (int sj : s) {' },
  { id: 't-query', text: '      ans += cnt.getOrDefault(sj - k, 0);' },
  { id: 't-record', text: '      cnt.merge(sj, 1, Integer::sum);' },
  { id: 't-loop-close', text: '    }' },
  { id: 't-return', text: '    return ans;' },
  { id: 't-method-close', text: '  }' },
  { id: 't-class-close', text: '}' },
]

const oneSeedCode: CodeLine[] = [
  { id: 's-class', text: 'class Solution {' },
  { id: 's-method', text: '  public int subarraySum(int[] nums, int k) {' },
  { id: 's-map', text: '    Map<Integer, Integer> cnt = new HashMap<>(nums.length + 1, 1);' },
  { id: 's-seed', text: '    cnt.put(0, 1);' },
  { id: 's-sum', text: '    int s = 0;' },
  { id: 's-ans', text: '    int ans = 0;' },
  { id: 's-loop', text: '    for (int x : nums) {' },
  { id: 's-add', text: '      s += x;' },
  { id: 's-query', text: '      ans += cnt.getOrDefault(s - k, 0);' },
  { id: 's-record', text: '      cnt.merge(s, 1, Integer::sum);' },
  { id: 's-loop-close', text: '    }' },
  { id: 's-return', text: '    return ans;' },
  { id: 's-method-close', text: '  }' },
  { id: 's-class-close', text: '}' },
]

const oneBeforeCode: CodeLine[] = [
  { id: 'b-class', text: 'class Solution {' },
  { id: 'b-method', text: '  public int subarraySum(int[] nums, int k) {' },
  { id: 'b-map', text: '    Map<Integer, Integer> cnt = new HashMap<>(nums.length, 1);' },
  { id: 'b-sum', text: '    int s = 0;' },
  { id: 'b-ans', text: '    int ans = 0;' },
  { id: 'b-loop', text: '    for (int x : nums) {' },
  { id: 'b-record', text: '      cnt.merge(s, 1, Integer::sum);' },
  { id: 'b-add', text: '      s += x;' },
  { id: 'b-query', text: '      ans += cnt.getOrDefault(s - k, 0);' },
  { id: 'b-loop-close', text: '    }' },
  { id: 'b-return', text: '    return ans;' },
  { id: 'b-method-close', text: '  }' },
  { id: 'b-class-close', text: '}' },
]

export const getPrefixCode = (method: PrefixMethod) => method === 'two-pass' ? twoPassCode : method === 'one-seed' ? oneSeedCode : oneBeforeCode
const entries = (map: Map<number, number>): [number, number][] => [...map.entries()]
const positionsFor = (positions: Map<number, number[]>, key: number) => [...(positions.get(key) ?? [])]
const remember = (map: Map<number, number>, positions: Map<number, number[]>, value: number, index: number) => {
  map.set(value, (map.get(value) ?? 0) + 1)
  positions.set(value, [...(positions.get(value) ?? []), index])
}
const base = (values: Partial<PrefixStep>): PrefixStep => ({ phase: 'ready', arrayIndex: -1, prefixIndex: 0, prefix: [0], sum: 0, need: -prefixTarget, found: 0, matchedStarts: [], mapEntries: [], activeMapKey: null, ans: 0, lineId: '', message: '', ...values })

function makeTwoPassSteps(): PrefixStep[] {
  const prefix = Array(prefixNumbers.length + 1).fill(0)
  const steps: PrefixStep[] = [base({ prefix: [...prefix], lineId: 't-prefix', message: '前缀和 s[j] 表示 nums[0] 到 nums[j - 1] 的总和；先固定 s[0] = 0' })]
  for (let i = 0; i < prefixNumbers.length; i++) {
    prefix[i + 1] = prefix[i] + prefixNumbers[i]
    steps.push(base({ phase: 'build', arrayIndex: i, prefixIndex: i + 1, prefix: [...prefix], sum: prefix[i + 1], lineId: 't-build', message: `s[${i + 1}] = s[${i}] + nums[${i}] = ${prefix[i]} + ${prefixNumbers[i]} = ${prefix[i + 1]}` }))
  }
  const map = new Map<number, number>()
  const positions = new Map<number, number[]>()
  let ans = 0
  prefix.forEach((sum, prefixIndex) => {
    const need = sum - prefixTarget
    const starts = positionsFor(positions, need)
    const found = starts.length
    ans += found
    steps.push(base({ phase: 'query', arrayIndex: prefixIndex - 1, prefixIndex, prefix: [...prefix], sum, need, found, matchedStarts: starts, mapEntries: entries(map), activeMapKey: need, ans, lineId: 't-query', message: found === 0 ? `当前 s[${prefixIndex}] = ${sum}，寻找 ${sum} - ${prefixTarget} = ${need}；左侧尚未出现，ans 不变` : `当前 s[${prefixIndex}] = ${sum}，左侧有 ${found} 个前缀和等于 ${need}；新找到 ${found} 个和为 ${prefixTarget} 的子数组，ans = ${ans}` }))
    remember(map, positions, sum, prefixIndex)
    steps.push(base({ phase: 'record', arrayIndex: prefixIndex - 1, prefixIndex, prefix: [...prefix], sum, need, found, mapEntries: entries(map), activeMapKey: sum, ans, lineId: 't-record', message: `查询完成后再记录当前 s[${prefixIndex}] = ${sum}；cnt[${sum}] = ${map.get(sum)}` }))
  })
  steps.push(base({ phase: 'done', prefixIndex: prefix.length - 1, prefix: [...prefix], sum: prefix.at(-1) ?? 0, mapEntries: entries(map), ans, lineId: 't-return', message: `遍历全部前缀和，返回子数组个数 ${ans}` }))
  return steps
}

function makeOneSeedSteps(): PrefixStep[] {
  const prefix = [0]
  const map = new Map<number, number>([[0, 1]])
  const positions = new Map<number, number[]>([[0, [0]]])
  const steps: PrefixStep[] = [base({ phase: 'seed', prefix: [...prefix], mapEntries: entries(map), activeMapKey: 0, lineId: 's-seed', message: '先放入 cnt[0] = 1，表示空前缀 s[0]；这样从下标 0 开始的子数组也能被统计' })]
  let sum = 0
  let ans = 0
  prefixNumbers.forEach((number, arrayIndex) => {
    sum += number
    prefix.push(sum)
    const prefixIndex = arrayIndex + 1
    steps.push(base({ phase: 'sum', arrayIndex, prefixIndex, prefix: [...prefix], sum, mapEntries: entries(map), ans, lineId: 's-add', message: `读入 nums[${arrayIndex}] = ${number}，当前前缀和 s = ${sum}` }))
    const need = sum - prefixTarget
    const starts = positionsFor(positions, need)
    const found = starts.length
    ans += found
    steps.push(base({ phase: 'query', arrayIndex, prefixIndex, prefix: [...prefix], sum, need, found, matchedStarts: starts, mapEntries: entries(map), activeMapKey: need, ans, lineId: 's-query', message: found === 0 ? `查 cnt[${sum} - ${prefixTarget}] = cnt[${need}]，没有历史前缀，ans 保持 ${ans}` : `查 cnt[${sum} - ${prefixTarget}] = cnt[${need}] = ${found}，新增 ${found} 个子数组，ans = ${ans}` }))
    remember(map, positions, sum, prefixIndex)
    steps.push(base({ phase: 'record', arrayIndex, prefixIndex, prefix: [...prefix], sum, need, found, mapEntries: entries(map), activeMapKey: sum, ans, lineId: 's-record', message: `最后记录当前前缀和：cnt[${sum}] = ${map.get(sum)}，供后面的右端点使用` }))
  })
  steps.push(base({ phase: 'done', prefixIndex: prefix.length - 1, prefix: [...prefix], sum, mapEntries: entries(map), ans, lineId: 's-return', message: `一次遍历结束，返回 ${ans}` }))
  return steps
}

function makeOneBeforeSteps(): PrefixStep[] {
  const prefix = [0]
  const map = new Map<number, number>()
  const positions = new Map<number, number[]>()
  const steps: PrefixStep[] = [base({ prefix: [...prefix], lineId: 'b-map', message: '哈希表从空开始；每轮先记录“加 x 之前”的前缀和，再计算新的前缀和' })]
  let sum = 0
  let ans = 0
  prefixNumbers.forEach((number, arrayIndex) => {
    remember(map, positions, sum, arrayIndex)
    steps.push(base({ phase: 'record', arrayIndex, prefixIndex: arrayIndex, prefix: [...prefix], sum, mapEntries: entries(map), activeMapKey: sum, ans, lineId: 'b-record', message: `先记录旧前缀和 s = ${sum}：cnt[${sum}] = ${map.get(sum)}` }))
    sum += number
    prefix.push(sum)
    const prefixIndex = arrayIndex + 1
    steps.push(base({ phase: 'sum', arrayIndex, prefixIndex, prefix: [...prefix], sum, mapEntries: entries(map), ans, lineId: 'b-add', message: `再读入 nums[${arrayIndex}] = ${number}，新前缀和 s = ${sum}` }))
    const need = sum - prefixTarget
    const starts = positionsFor(positions, need)
    const found = starts.length
    ans += found
    steps.push(base({ phase: 'query', arrayIndex, prefixIndex, prefix: [...prefix], sum, need, found, matchedStarts: starts, mapEntries: entries(map), activeMapKey: need, ans, lineId: 'b-query', message: found === 0 ? `cnt[${need}] = 0，本轮没有新子数组` : `cnt[${sum} - ${prefixTarget}] = cnt[${need}] = ${found}，ans 增加到 ${ans}` }))
  })
  steps.push(base({ phase: 'done', prefixIndex: prefix.length - 1, prefix: [...prefix], sum, mapEntries: entries(map), ans, lineId: 'b-return', message: `遍历结束，返回 ${ans}` }))
  return steps
}

export const makePrefixSteps = (method: PrefixMethod) => method === 'two-pass' ? makeTwoPassSteps() : method === 'one-seed' ? makeOneSeedSteps() : makeOneBeforeSteps()
