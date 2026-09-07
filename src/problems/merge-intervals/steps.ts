import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type Interval = [number, number]
export type MergeMethod = 'sort-mutate' | 'sort-build' | 'difference' | 'sweep'
export type MergePhase = 'sort' | 'select' | 'compare' | 'merge' | 'append' | 'mark' | 'scan' | 'open' | 'close' | 'done'

export interface MergeStep {
  phase: MergePhase
  currentIndex: number
  current: Interval | null
  previous: Interval | null
  results: Interval[]
  overlaps: boolean | null
  events: Array<[number, number]>
  eventIndex: number
  scanPosition: number
  delta: number
  count: number
  start: number
  lineId: string
  message: string
}

export const mergeInput: Interval[] = [[1, 6], [2, 3], [8, 10], [9, 12], [15, 18]]
export const mergeSorted = mergeInput.map(([start, end]) => [start, end] as Interval).sort((a, b) => a[0] - b[0])
export const mergeMethods: PlayerMethod[] = [
  { id: 'difference', label: '差分数组', complexity: 'O(N + U)', languages: ['java'] },
  { id: 'sort-mutate', label: '排序 · 修改末尾', complexity: 'O(N logN)', languages: ['java'] },
  { id: 'sort-build', label: '排序 · 直接生成', complexity: 'O(N logN)', languages: ['java'] },
  { id: 'sweep', label: '扫描线', complexity: 'O(N logN)', languages: ['java'] },
]

const sortMutateCode: CodeLine[] = [
  { id: 'sm-class', text: 'class Solution {' },
  { id: 'sm-method', text: '  public int[][] merge(int[][] intervals) {' },
  { id: 'sm-sort', text: '    Arrays.sort(intervals, (p, q) -> p[0] - q[0]);' },
  { id: 'sm-ans', text: '    List<int[]> ans = new ArrayList<>();' },
  { id: 'sm-loop', text: '    for (int[] p : intervals) {' },
  { id: 'sm-size', text: '      int m = ans.size();' },
  { id: 'sm-if', text: '      if (m > 0 && p[0] <= ans.get(m - 1)[1]) {' },
  { id: 'sm-update', text: '        ans.get(m - 1)[1] = Math.max(ans.get(m - 1)[1], p[1]);' },
  { id: 'sm-else', text: '      } else {' },
  { id: 'sm-add', text: '        ans.add(p);' },
  { id: 'sm-close-if', text: '      }' },
  { id: 'sm-close-loop', text: '    }' },
  { id: 'sm-return', text: '    return ans.toArray(new int[ans.size()][]);' },
  { id: 'sm-close-method', text: '  }' },
  { id: 'sm-close-class', text: '}' },
]

const sortBuildCode: CodeLine[] = [
  { id: 'sb-class', text: 'class Solution {' },
  { id: 'sb-method', text: '  public int[][] merge(int[][] intervals) {' },
  { id: 'sb-sort', text: '    Arrays.sort(intervals, (p, q) -> p[0] - q[0]);' },
  { id: 'sb-n', text: '    int n = intervals.length;' },
  { id: 'sb-ans', text: '    List<int[]> ans = new ArrayList<>();' },
  { id: 'sb-left', text: '    int left = Integer.MAX_VALUE;' },
  { id: 'sb-right', text: '    int right = Integer.MIN_VALUE;' },
  { id: 'sb-loop', text: '    for (int i = 0; i < n; i++) {' },
  { id: 'sb-update-left', text: '      left = Math.min(left, intervals[i][0]);' },
  { id: 'sb-update-right', text: '      right = Math.max(right, intervals[i][1]);' },
  { id: 'sb-if', text: '      if (i == n - 1 || intervals[i + 1][0] > right) {' },
  { id: 'sb-add', text: '        ans.add(new int[]{left, right});' },
  { id: 'sb-reset', text: '        left = Integer.MAX_VALUE;' },
  { id: 'sb-close-if', text: '      }' },
  { id: 'sb-close-loop', text: '    }' },
  { id: 'sb-return', text: '    return ans.toArray(new int[ans.size()][]);' },
  { id: 'sb-close-method', text: '  }' },
  { id: 'sb-close-class', text: '}' },
]

const differenceCode: CodeLine[] = [
  { id: 'd-class', text: 'class Solution {' },
  { id: 'd-method', text: '  public int[][] merge(int[][] intervals) {' },
  { id: 'd-mx', text: '    int mx = 0;' },
  { id: 'd-max-loop', text: '    for (int[] p : intervals) mx = Math.max(mx, p[1]);' },
  { id: 'd-diff', text: '    int[] diff = new int[mx * 2 + 2];' },
  { id: 'd-mark-loop', text: '    for (int[] p : intervals) {' },
  { id: 'd-start-event', text: '      diff[p[0] * 2]++;' },
  { id: 'd-end-event', text: '      diff[p[1] * 2 + 1]--;' },
  { id: 'd-mark-close', text: '    }' },
  { id: 'd-ans', text: '    List<int[]> ans = new ArrayList<>();' },
  { id: 'd-sum', text: '    int sumD = 0;' },
  { id: 'd-start', text: '    int start = -1;' },
  { id: 'd-scan-loop', text: '    for (int i = 0; i < diff.length; i++) {' },
  { id: 'd-prefix', text: '      sumD += diff[i];' },
  { id: 'd-open-if', text: '      if (sumD > 0 && start < 0) {' },
  { id: 'd-open', text: '        start = i;' },
  { id: 'd-close-if', text: '      } else if (sumD == 0 && start >= 0) {' },
  { id: 'd-add', text: '        ans.add(new int[]{start / 2, i / 2});' },
  { id: 'd-reset', text: '        start = -1;' },
  { id: 'd-branch-close', text: '      }' },
  { id: 'd-loop-close', text: '    }' },
  { id: 'd-return', text: '    return ans.toArray(new int[ans.size()][]);' },
  { id: 'd-method-close', text: '  }' },
  { id: 'd-class-close', text: '}' },
]

const sweepCode: CodeLine[] = [
  { id: 'sw-class', text: 'class Solution {' },
  { id: 'sw-method', text: '  public int[][] merge(int[][] intervals) {' },
  { id: 'sw-map', text: '    Map<Integer, Integer> events = new TreeMap<>();' },
  { id: 'sw-mark-loop', text: '    for (int[] p : intervals) {' },
  { id: 'sw-start-event', text: '      events.merge(p[0], 1, Integer::sum);' },
  { id: 'sw-end-event', text: '      events.merge(p[1], -1, Integer::sum);' },
  { id: 'sw-mark-close', text: '    }' },
  { id: 'sw-ans', text: '    List<int[]> ans = new ArrayList<>();' },
  { id: 'sw-count', text: '    int cnt = 0;' },
  { id: 'sw-start', text: '    int start = 0;' },
  { id: 'sw-loop', text: '    for (Map.Entry<Integer, Integer> e : events.entrySet()) {' },
  { id: 'sw-x', text: '      int x = e.getKey();' },
  { id: 'sw-open-if', text: '      if (cnt == 0) start = x;' },
  { id: 'sw-update', text: '      cnt += e.getValue();' },
  { id: 'sw-close-if', text: '      if (cnt == 0) {' },
  { id: 'sw-add', text: '        ans.add(new int[]{start, x});' },
  { id: 'sw-close-branch', text: '      }' },
  { id: 'sw-loop-close', text: '    }' },
  { id: 'sw-return', text: '    return ans.toArray(new int[ans.size()][]);' },
  { id: 'sw-method-close', text: '  }' },
  { id: 'sw-class-close', text: '}' },
]

export const getMergeCode = (method: MergeMethod) => ({ 'sort-mutate': sortMutateCode, 'sort-build': sortBuildCode, difference: differenceCode, sweep: sweepCode })[method]
const copy = (intervals: Interval[]) => intervals.map(([start, end]) => [start, end] as Interval)
const base = (values: Partial<MergeStep>): MergeStep => ({ phase: 'sort', currentIndex: -1, current: null, previous: null, results: [], overlaps: null, events: [], eventIndex: -1, scanPosition: -1, delta: 0, count: 0, start: -1, lineId: '', message: '', ...values })

function sortMutateSteps(): MergeStep[] {
  const answer: Interval[] = []
  const steps = [base({ lineId: 'sm-sort', message: '按左端点升序排列；示例已经有序' })]
  mergeSorted.forEach((interval, currentIndex) => {
    const current = [...interval] as Interval
    const previous = answer.length ? [...answer[answer.length - 1]] as Interval : null
    steps.push(base({ phase: 'select', currentIndex, current, previous, results: copy(answer), lineId: 'sm-loop', message: '取出当前区间 [' + current.join(', ') + ']' }))
    const overlaps = previous !== null && current[0] <= previous[1]
    steps.push(base({ phase: 'compare', currentIndex, current, previous, results: copy(answer), overlaps, lineId: 'sm-if', message: previous === null ? 'ans 为空，当前区间直接加入' : overlaps ? current[0] + ' ≤ ' + previous[1] + '，与答案末尾重叠' : current[0] + ' > ' + previous[1] + '，开启新区间' }))
    if (overlaps) {
      const before = answer[answer.length - 1][1]
      answer[answer.length - 1][1] = Math.max(before, current[1])
      steps.push(base({ phase: 'merge', currentIndex, current, previous, results: copy(answer), overlaps, lineId: 'sm-update', message: '右端点 max(' + before + ', ' + current[1] + ') = ' + answer[answer.length - 1][1] }))
    } else {
      answer.push(current)
      steps.push(base({ phase: 'append', currentIndex, current, previous, results: copy(answer), overlaps, lineId: 'sm-add', message: '加入新区间 [' + current.join(', ') + ']' }))
    }
  })
  steps.push(base({ phase: 'done', results: copy(answer), lineId: 'sm-return', message: '返回互不重叠的合并结果' }))
  return steps
}

function sortBuildSteps(): MergeStep[] {
  const answer: Interval[] = []
  const steps = [base({ lineId: 'sb-sort', message: '排序后，用 left、right 维护当前正在生成的区间' })]
  let left = Number.MAX_SAFE_INTEGER
  let right = Number.MIN_SAFE_INTEGER
  mergeSorted.forEach((interval, currentIndex) => {
    left = Math.min(left, interval[0])
    right = Math.max(right, interval[1])
    const current: Interval = [left, right]
    steps.push(base({ phase: 'merge', currentIndex, current, previous: answer.length ? answer[answer.length - 1] : null, results: copy(answer), lineId: 'sb-update-right', message: '吸收 [' + interval.join(', ') + ']，当前区间变为 [' + left + ', ' + right + ']' }))
    const next = mergeSorted[currentIndex + 1]
    if (!next || next[0] > right) {
      answer.push([left, right])
      steps.push(base({ phase: 'append', currentIndex, current, results: copy(answer), overlaps: false, lineId: 'sb-add', message: next ? '下一区间左端点 ' + next[0] + ' > ' + right + '，当前区间已经封闭' : '已到最后一个区间，保存当前结果' }))
      left = Number.MAX_SAFE_INTEGER
    } else {
      steps.push(base({ phase: 'compare', currentIndex, current, results: copy(answer), overlaps: true, lineId: 'sb-if', message: '下一区间左端点 ' + next[0] + ' ≤ ' + right + '，继续合并' }))
    }
  })
  steps.push(base({ phase: 'done', results: copy(answer), lineId: 'sb-return', message: '返回直接生成的区间数组' }))
  return steps
}

function differenceSteps(): MergeStep[] {
  const max = Math.max(...mergeInput.map((p) => p[1]))
  const diff = Array(max * 2 + 2).fill(0) as number[]
  const steps: MergeStep[] = []
  mergeInput.forEach((p, currentIndex) => {
    diff[p[0] * 2]++
    diff[p[1] * 2 + 1]--
    const events = diff.map((value, index) => [index, value] as [number, number]).filter((event) => event[1] !== 0)
    steps.push(base({ phase: 'mark', currentIndex, current: p, events, eventIndex: p[0] * 2, lineId: 'd-end-event', message: '[' + p.join(', ') + '] 放大为 [' + p[0] * 2 + ', ' + p[1] * 2 + ']：起点 +1，终点后一格 -1' }))
  })
  const events = diff.map((value, index) => [index, value] as [number, number]).filter((event) => event[1] !== 0)
  const answer: Interval[] = []
  let count = 0
  let start = -1
  for (let i = 0; i < diff.length; i++) {
    const before = count
    count += diff[i]
    if (diff[i] !== 0) steps.push(base({ phase: 'scan', results: copy(answer), events, eventIndex: i, scanPosition: i, delta: diff[i], count, start, lineId: 'd-prefix', message: 'i = ' + i + '：覆盖数 ' + before + (diff[i] >= 0 ? ' + ' : ' - ') + Math.abs(diff[i]) + ' = ' + count }))
    if (count > 0 && start < 0) {
      start = i
      steps.push(base({ phase: 'open', results: copy(answer), events, eventIndex: i, scanPosition: i, delta: diff[i], count, start, lineId: 'd-open', message: '覆盖数从 0 变为正数，记录放大后的左端点 ' + i }))
    } else if (count === 0 && start >= 0) {
      answer.push([start / 2, Math.floor(i / 2)])
      steps.push(base({ phase: 'close', results: copy(answer), events, eventIndex: i, scanPosition: i, delta: diff[i], count, start, lineId: 'd-add', message: '覆盖数回到 0，[' + start + ', ' + (i - 1) + '] 除以 2 得 [' + answer[answer.length - 1].join(', ') + ']' }))
      start = -1
    }
  }
  steps.push(base({ phase: 'done', results: copy(answer), events, count, lineId: 'd-return', message: '差分前缀和扫描完成' }))
  return steps
}

function sweepSteps(): MergeStep[] {
  const map = new Map<number, number>()
  const steps: MergeStep[] = []
  mergeInput.forEach((p, currentIndex) => {
    map.set(p[0], (map.get(p[0]) || 0) + 1)
    map.set(p[1], (map.get(p[1]) || 0) - 1)
    const events = [...map.entries()].sort((a, b) => a[0] - b[0])
    steps.push(base({ phase: 'mark', currentIndex, current: p, events, eventIndex: p[0], lineId: 'sw-end-event', message: '[' + p.join(', ') + '] 产生左端点 +1、右端点 -1 两个事件' }))
  })
  const events = [...map.entries()].sort((a, b) => a[0] - b[0]) as Array<[number, number]>
  const answer: Interval[] = []
  let count = 0
  let start = 0
  events.forEach(([x, delta], eventIndex) => {
    if (count === 0) {
      start = x
      steps.push(base({ phase: 'open', results: copy(answer), events, eventIndex, scanPosition: x, delta, count, start, lineId: 'sw-open-if', message: '扫描到 x = ' + x + ' 前 cnt = 0，新合并区间从这里开始' }))
    }
    const before = count
    count += delta
    steps.push(base({ phase: 'scan', results: copy(answer), events, eventIndex, scanPosition: x, delta, count, start, lineId: 'sw-update', message: 'x = ' + x + ' 的合并事件为 ' + (delta >= 0 ? '+' : '') + delta + '，cnt：' + before + ' → ' + count }))
    if (count === 0) {
      answer.push([start, x])
      steps.push(base({ phase: 'close', results: copy(answer), events, eventIndex, scanPosition: x, delta, count, start, lineId: 'sw-add', message: 'cnt 回到 0，区间 [' + start + ', ' + x + '] 合并完成' }))
    }
  })
  steps.push(base({ phase: 'done', results: copy(answer), events, count, lineId: 'sw-return', message: '扫描线处理完所有端点事件' }))
  return steps
}

export const makeMergeSteps = (method: MergeMethod) => ({ 'sort-mutate': sortMutateSteps, 'sort-build': sortBuildSteps, difference: differenceSteps, sweep: sweepSteps })[method]()
