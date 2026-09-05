import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type Interval = [number, number]
export type MergePhase = 'sort' | 'select' | 'compare' | 'merge' | 'append' | 'done'

export interface MergeStep {
  phase: MergePhase
  currentIndex: number
  current: Interval | null
  previous: Interval | null
  results: Interval[]
  overlaps: boolean | null
  lineId: string
  message: string
}

export const mergeInput: Interval[] = [[1, 3], [2, 6], [8, 10], [15, 18]]
export const mergeSorted = mergeInput.map(([start, end]) => [start, end] as Interval).sort((a, b) => a[0] - b[0])
export const mergeMethods: PlayerMethod[] = [{ id: 'sort-scan', label: '排序后扫描', complexity: 'O(N logN)', languages: ['javascript'] }]

export const mergeCode: CodeLine[] = [
  { id: 'merge-method', text: 'function merge(intervals) {' },
  { id: 'merge-sort', text: '    intervals.sort((p, q) => (p[0] - q[0]))' },
  { id: 'merge-answer', text: '    const ans = []' },
  { id: 'merge-blank-1', text: '' },
  { id: 'merge-loop', text: '    for (const p of intervals) {' },
  { id: 'merge-length', text: '        const m = ans.length' },
  { id: 'merge-if', text: '        if (m && p[0] <= ans[m - 1][1]) {' },
  { id: 'merge-update', text: '            ans[m - 1][1] = Math.max(p[1], ans[m - 1][1])' },
  { id: 'merge-else', text: '        } else {' },
  { id: 'merge-push', text: '            ans.push(p)' },
  { id: 'merge-close', text: '        }' },
  { id: 'merge-loop-close', text: '    }' },
  { id: 'merge-blank-2', text: '' },
  { id: 'merge-return', text: '    return ans' },
  { id: 'merge-method-close', text: '}' },
]

const copy = (intervals: Interval[]) => intervals.map(([start, end]) => [start, end] as Interval)

export function makeMergeSteps(): MergeStep[] {
  const answer: Interval[] = []
  const steps: MergeStep[] = [{ phase: 'sort', currentIndex: -1, current: null, previous: null, results: [], overlaps: null, lineId: 'merge-sort', message: '先按左端点升序排列；当前示例已经有序，顺序保持不变' }]

  mergeSorted.forEach((interval, currentIndex) => {
    const current = [...interval] as Interval
    const previous = answer.length ? [...answer[answer.length - 1]] as Interval : null
    steps.push({ phase: 'select', currentIndex, current, previous, results: copy(answer), overlaps: null, lineId: 'merge-loop', message: `取出当前区间 [${current.join(', ')}]，此时 ans.length = ${answer.length}` })
    const overlaps = previous !== null && current[0] <= previous[1]
    steps.push({ phase: 'compare', currentIndex, current, previous, results: copy(answer), overlaps, lineId: 'merge-if', message: previous === null ? '答案为空，没有上一区间，进入 else 分支' : overlaps ? `当前左端点 ${current[0]} ≤ 上一区间右端点 ${previous[1]}，两个区间重叠` : `当前左端点 ${current[0]} > 上一区间右端点 ${previous[1]}，两个区间不重叠` })
    if (overlaps) {
      const before = answer[answer.length - 1][1]
      answer[answer.length - 1][1] = Math.max(current[1], before)
      steps.push({ phase: 'merge', currentIndex, current, previous, results: copy(answer), overlaps: true, lineId: 'merge-update', message: `右端点更新为 max(${current[1]}, ${before}) = ${answer[answer.length - 1][1]}，合并得到 [${answer[answer.length - 1].join(', ')}]` })
    } else {
      answer.push(current)
      steps.push({ phase: 'append', currentIndex, current, previous, results: copy(answer), overlaps: false, lineId: 'merge-push', message: `把 [${current.join(', ')}] 作为新区间加入答案` })
    }
  })

  steps.push({ phase: 'done', currentIndex: mergeSorted.length - 1, current: null, previous: null, results: copy(answer), overlaps: null, lineId: 'merge-return', message: '扫描完成，返回 [[1, 6], [8, 10], [15, 18]]' })
  return steps
}
