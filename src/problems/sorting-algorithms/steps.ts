import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type SortId = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge' | 'heap' | 'counting' | 'radix'
export interface SortItem { id: number; value: number }
export interface SortStep {
  items: SortItem[]
  active: number[]
  fixed: number[]
  pivot?: number
  range?: [number, number]
  auxiliary?: { title: string; cells: string[]; active?: number }
  comparisons: number
  writes: number
  lineId: string
  message: string
  done?: boolean
}

export const samples = [
  { label: '重复值', values: [12, 24, 12, 23, 31, 11, 22] },
  { label: '逆序', values: [31, 27, 24, 22, 18, 14, 11] },
  { label: '近乎有序', values: [11, 12, 16, 15, 22, 24, 31] },
]

export const sortMethods: PlayerMethod[] = [
  { id: 'bubble', label: '冒泡', complexity: 'O(n²)', languages: ['javascript'] },
  { id: 'selection', label: '选择', complexity: 'O(n²)', languages: ['javascript'] },
  { id: 'insertion', label: '插入', complexity: 'O(n²)', languages: ['javascript'] },
  { id: 'quick', label: '快速', complexity: '平均 O(n log n)', languages: ['javascript'] },
  { id: 'merge', label: '归并', complexity: 'O(n log n)', languages: ['javascript'] },
  { id: 'heap', label: '堆', complexity: 'O(n log n)', languages: ['javascript'] },
  { id: 'counting', label: '计数', complexity: 'O(n + k)', languages: ['javascript'] },
  { id: 'radix', label: '基数', complexity: 'O(d(n + k))', languages: ['javascript'] },
]

export const sortFacts: Record<SortId, { stable: boolean; space: string; idea: string }> = {
  bubble: { stable: true, space: 'O(1)', idea: '相邻比较，把较大的值逐轮推向右端。' },
  selection: { stable: false, space: 'O(1)', idea: '每轮找出未排序区的最小值，放到左端。' },
  insertion: { stable: true, space: 'O(1)', idea: '将当前值插入左侧已经有序的区间。' },
  quick: { stable: false, space: '平均 O(log n)', idea: '选一个基准，把小值放左边、大值放右边，再递归。' },
  merge: { stable: true, space: 'O(n)', idea: '先二分，再把两个有序区间按大小合并。' },
  heap: { stable: false, space: 'O(1)', idea: '维护大顶堆，反复把堆顶最大值移到末尾。' },
  counting: { stable: true, space: 'O(n + k)', idea: '统计每个值的频次，再从右往左放入输出数组。' },
  radix: { stable: true, space: 'O(n + k)', idea: '从个位到高位，逐位进行稳定的计数排序。' },
}

const source: Record<SortId, [string, string][]> = {
  bubble: [
    ['start', 'function bubbleSort(a) {'],
    ['outer', '  for (let end = a.length - 1; end > 0; end--) {'],
    ['changed', '    let changed = false'],
    ['inner', '    for (let i = 0; i < end; i++) {'],
    ['compare', '      if (a[i].value > a[i + 1].value) {'],
    ['swap', '        [a[i], a[i + 1]] = [a[i + 1], a[i]]'],
    ['mark-changed', '        changed = true'],
    ['close', '      }'],
    ['inner-end', '    }'],
    ['early-exit', '    if (!changed) break'],
    ['outer-end', '  }'],
    ['return', '  return a'],
    ['end', '}'],
  ],
  selection: [
    ['start', 'function selectionSort(a) {'],
    ['outer', '  for (let i = 0; i < a.length - 1; i++) {'],
    ['min', '    let min = i'],
    ['compare', '    for (let j = i + 1; j < a.length; j++) {'],
    ['new-min', '      if (a[j].value < a[min].value) min = j'],
    ['inner-end', '    }'],
    ['swap', '    [a[i], a[min]] = [a[min], a[i]]'],
    ['outer-end', '  }'],
    ['return', '  return a'],
    ['end', '}'],
  ],
  insertion: [
    ['start', 'function insertionSort(a) {'],
    ['outer', '  for (let i = 1; i < a.length; i++) {'],
    ['key', '    const key = a[i]'],
    ['index', '    let j = i - 1'],
    ['compare', '    while (j >= 0 && a[j].value > key.value) {'],
    ['shift', '      a[j + 1] = a[j]; j--'],
    ['while-end', '    }'],
    ['insert', '    a[j + 1] = key'],
    ['outer-end', '  }'],
    ['return', '  return a'],
    ['end', '}'],
  ],
  quick: [
    ['start', 'function quickSort(a, lo = 0, hi = a.length - 1) {'],
    ['base', '  if (lo >= hi) return a'],
    ['pivot', '  const pivot = a[hi].value'],
    ['boundary', '  let boundary = lo'],
    ['compare', '  for (let j = lo; j < hi; j++) {'],
    ['partition', '    if (a[j].value < pivot) {'],
    ['swap', '      [a[j], a[boundary]] = [a[boundary], a[j]]'],
    ['advance', '      boundary++'],
    ['if-end', '    }'],
    ['loop-end', '  }'],
    ['place', '  [a[boundary], a[hi]] = [a[hi], a[boundary]]'],
    ['left', '  quickSort(a, lo, boundary - 1)'],
    ['right', '  quickSort(a, boundary + 1, hi)'],
    ['return', '  return a'],
    ['end', '}'],
  ],
  merge: [
    ['start', 'function mergeSort(a, lo = 0, hi = a.length) {'],
    ['base', '  if (hi - lo <= 1) return a'],
    ['middle', '  const mid = Math.floor((lo + hi) / 2)'],
    ['left', '  mergeSort(a, lo, mid)'],
    ['right', '  mergeSort(a, mid, hi)'],
    ['copy', '  const left = a.slice(lo, mid), right = a.slice(mid, hi)'],
    ['pointers', '  let i = 0, j = 0, k = lo'],
    ['compare', '  while (i < left.length && j < right.length) {'],
    ['write', '    a[k++] = left[i].value <= right[j].value ? left[i++] : right[j++]'],
    ['while-end', '  }'],
    ['rest-left', '  while (i < left.length) a[k++] = left[i++]'],
    ['rest-right', '  while (j < right.length) a[k++] = right[j++]'],
    ['return', '  return a'],
    ['end', '}'],
  ],
  heap: [
    ['start', 'function heapSort(a) {'],
    ['heapify', '  function siftDown(root, end) {'],
    ['child', '    let child = root * 2 + 1'],
    ['loop', '    while (child < end) {'],
    ['right', '      if (child + 1 < end && a[child + 1].value > a[child].value) child++'],
    ['compare', '      if (a[root].value >= a[child].value) break'],
    ['swap', '      [a[root], a[child]] = [a[child], a[root]]'],
    ['advance', '      root = child; child = root * 2 + 1'],
    ['loop-end', '    }'],
    ['function-end', '  }'],
    ['build', '  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) siftDown(i, a.length)'],
    ['extract', '  for (let end = a.length - 1; end > 0; end--) {'],
    ['root-swap', '    [a[0], a[end]] = [a[end], a[0]]'],
    ['repair', '    siftDown(0, end)'],
    ['outer-end', '  }'],
    ['return', '  return a'],
    ['end', '}'],
  ],
  counting: [
    ['start', 'function countingSort(a) {'],
    ['minmax', '  const min = Math.min(...a.map(x => x.value))'],
    ['max', '  const max = Math.max(...a.map(x => x.value))'],
    ['counts', '  const count = Array(max - min + 1).fill(0)'],
    ['tally', '  for (const item of a) count[item.value - min]++'],
    ['prefix', '  for (let i = 1; i < count.length; i++) count[i] += count[i - 1]'],
    ['output', '  const out = Array(a.length)'],
    ['place', '  for (let i = a.length - 1; i >= 0; i--) {'],
    ['write', '    out[--count[a[i].value - min]] = a[i]'],
    ['loop-end', '  }'],
    ['return', '  return out'],
    ['end', '}'],
  ],
  radix: [
    ['start', 'function radixSort(a) {'],
    ['max', '  const max = Math.max(...a.map(x => x.value))'],
    ['pass', '  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {'],
    ['counts', '    const count = Array(10).fill(0), out = Array(a.length)'],
    ['digit', '    for (const item of a) count[Math.floor(item.value / exp) % 10]++'],
    ['prefix', '    for (let i = 1; i < 10; i++) count[i] += count[i - 1]'],
    ['place', '    for (let i = a.length - 1; i >= 0; i--) {'],
    ['write', '      const digit = Math.floor(a[i].value / exp) % 10'],
    ['output', '      out[--count[digit]] = a[i]'],
    ['loop-end', '    }'],
    ['copy', '    a = out'],
    ['pass-end', '  }'],
    ['return', '  return a'],
    ['end', '}'],
  ],
}

export function sortCode(method: SortId): CodeLine[] {
  return source[method].map(([id, text]) => ({ id, text }))
}

export function makeSortSteps(method: SortId, values: number[]): SortStep[] {
  const a: SortItem[] = values.map((value, id) => ({ id, value }))
  const steps: SortStep[] = []
  let comparisons = 0
  let writes = 0
  const push = (lineId: string, message: string, active: number[] = [], fixed: number[] = [], options: Partial<Pick<SortStep, 'pivot' | 'range' | 'auxiliary' | 'done'>> = {}) => {
    steps.push({ items: [...a], active, fixed, comparisons, writes, lineId, message, ...options })
  }
  const swap = (i: number, j: number) => {
    if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; writes += 2 }
  }
  push('start', `原始数组：${values.join('、')}。选择播放，观察每一步。`)
  const n = a.length

  if (method === 'bubble') {
    for (let end = n - 1; end > 0; end--) {
      let changed = false
      for (let i = 0; i < end; i++) {
        comparisons++
        push('compare', `比较 ${a[i].value} 与 ${a[i + 1].value}。`, [i, i + 1], Array.from({ length: n - end - 1 }, (_, k) => n - 1 - k))
        if (a[i].value > a[i + 1].value) {
          swap(i, i + 1); changed = true
          push('swap', '左边更大，交换这两个相邻元素。', [i, i + 1])
        }
      }
      push('outer', `第 ${n - end} 轮结束，位置 ${end} 已确定。`, [], Array.from({ length: n - end }, (_, k) => end + k))
      if (!changed) {
        push('early-exit', '本轮没有交换，数组已经有序，可以提前结束。', [], Array.from({ length: n }, (_, k) => k))
        break
      }
    }
  } else if (method === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let min = i
      push('min', `从位置 ${i + 1} 开始寻找最小值。`, [min], Array.from({ length: i }, (_, k) => k))
      for (let j = i + 1; j < n; j++) {
        comparisons++
        push('compare', `比较当前最小值 ${a[min].value} 与 ${a[j].value}。`, [min, j])
        if (a[j].value < a[min].value) {
          min = j
          push('new-min', `更新最小值为 ${a[min].value}。`, [min])
        }
      }
      swap(i, min)
      push('swap', `把最小值放到位置 ${i + 1}。`, [i], Array.from({ length: i + 1 }, (_, k) => k))
    }
  } else if (method === 'insertion') {
    push('outer', '第一个元素本身有序。', [], [0])
    for (let i = 1; i < n; i++) {
      const key = a[i]
      let j = i - 1
      push('key', `取出 ${key.value}，向左寻找插入位置。`, [i])
      while (j >= 0) {
        comparisons++
        push('compare', `比较 ${a[j].value} 与待插入的 ${key.value}。`, [j, j + 1])
        if (a[j].value <= key.value) break
        a[j + 1] = a[j]; writes++
        push('shift', `${a[j].value} 向右移动一格。`, [j, j + 1])
        j--
      }
      a[j + 1] = key; writes++
      push('insert', `${key.value} 插入位置 ${j + 2}；左侧已有序。`, [j + 1], Array.from({ length: i + 1 }, (_, k) => k))
    }
  } else if (method === 'quick') {
    const fixed = new Set<number>()
    const quick = (lo: number, hi: number) => {
      if (lo > hi) return
      if (lo === hi) { fixed.add(lo); push('base', `位置 ${lo + 1} 只有一个元素，已经有序。`, [lo], [...fixed]); return }
      const pivot = a[hi].value
      let boundary = lo
      push('pivot', `选 ${pivot} 为基准，处理位置 ${lo + 1}–${hi + 1}。`, [hi], [...fixed], { pivot: hi, range: [lo, hi] })
      for (let j = lo; j < hi; j++) {
        comparisons++
        push('compare', `比较 ${a[j].value} 与基准 ${pivot}。`, [j, hi], [...fixed], { pivot: hi, range: [lo, hi] })
        if (a[j].value < pivot) {
          swap(j, boundary)
          push('swap', `小于基准，移入左侧分区。`, [j, boundary], [...fixed], { pivot: hi, range: [lo, hi] })
          boundary++
        }
      }
      swap(boundary, hi); fixed.add(boundary)
      push('place', `基准 ${pivot} 落在最终位置 ${boundary + 1}。`, [boundary], [...fixed], { pivot: boundary, range: [lo, hi] })
      quick(lo, boundary - 1)
      quick(boundary + 1, hi)
    }
    quick(0, n - 1)
  } else if (method === 'merge') {
    const merge = (lo: number, hi: number) => {
      if (hi - lo <= 1) return
      const mid = Math.floor((lo + hi) / 2)
      push('middle', `拆分区间 ${lo + 1}–${hi}，中点在 ${mid} 后。`, [], [], { range: [lo, hi - 1] })
      merge(lo, mid); merge(mid, hi)
      const left = a.slice(lo, mid), right = a.slice(mid, hi)
      let i = 0, j = 0, k = lo
      push('copy', `合并 [${left.map(x => x.value).join(', ')}] 与 [${right.map(x => x.value).join(', ')}]。`, [], [], { range: [lo, hi - 1] })
      while (i < left.length && j < right.length) {
        comparisons++
        push('compare', `比较左右首项 ${left[i].value} 与 ${right[j].value}。`, [k], [], { range: [lo, hi - 1] })
        a[k] = left[i].value <= right[j].value ? left[i++] : right[j++]
        writes++
        push('write', `写入 ${a[k].value}；相等时先取左边，保持稳定。`, [k], [], { range: [lo, hi - 1] })
        k++
      }
      while (i < left.length) { a[k] = left[i++]; writes++; push('rest-left', `左侧余项 ${a[k].value} 直接写入。`, [k], [], { range: [lo, hi - 1] }); k++ }
      while (j < right.length) { a[k] = right[j++]; writes++; push('rest-right', `右侧余项 ${a[k].value} 直接写入。`, [k], [], { range: [lo, hi - 1] }); k++ }
    }
    merge(0, n)
  } else if (method === 'heap') {
    let end = n
    const siftDown = (initialRoot: number) => {
      let root = initialRoot
      let child = root * 2 + 1
      while (child < end) {
        if (child + 1 < end) {
          comparisons++
          push('right', `比较左右子节点 ${a[child].value} 与 ${a[child + 1].value}。`, [child, child + 1], Array.from({ length: n - end }, (_, k) => end + k))
          if (a[child + 1].value > a[child].value) child++
        }
        comparisons++
        push('compare', `比较父节点 ${a[root].value} 与较大子节点 ${a[child].value}。`, [root, child])
        if (a[root].value >= a[child].value) break
        swap(root, child)
        push('swap', '子节点更大，交换后继续向下调整。', [root, child])
        root = child; child = root * 2 + 1
      }
    }
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) { push('build', `从位置 ${i + 1} 向下调整大顶堆。`, [i]); siftDown(i) }
    for (end = n - 1; end > 0; end--) {
      swap(0, end)
      push('root-swap', `最大值 ${a[end].value} 移到位置 ${end + 1}。`, [0, end], Array.from({ length: n - end }, (_, k) => end + k))
      push('repair', '缩小堆的范围，重新调整堆顶。', [0], Array.from({ length: n - end }, (_, k) => end + k))
      siftDown(0)
    }
  } else if (method === 'counting') {
    const min = Math.min(...values), max = Math.max(...values)
    const count = Array(max - min + 1).fill(0) as number[]
    const countView = (title: string, active?: number) => ({ title, cells: count.map((value, index) => `${min + index}:${value}`), active })
    push('counts', `建立从 ${min} 到 ${max} 的计数表。`, [], [], { auxiliary: countView('数值 : 频次') })
    for (let i = 0; i < n; i++) {
      count[a[i].value - min]++
      push('tally', `${a[i].value} 出现次数加一。`, [i], [], { auxiliary: countView('数值 : 频次', a[i].value - min) })
    }
    for (let i = 1; i < count.length; i++) count[i] += count[i - 1]
    push('prefix', '前缀和给出每个值在输出数组中的右边界。', [], [], { auxiliary: countView('数值 : 累计个数') })
    const out: (SortItem | undefined)[] = Array(n)
    for (let i = n - 1; i >= 0; i--) {
      const value = a[i].value
      const position = --count[value - min]
      out[position] = a[i]; writes++
      push('write', `从右往左取 ${value}，放到输出位置 ${position + 1}。`, [i], [], { auxiliary: { title: '输出数组', cells: out.map(item => item ? `${item.value}·${item.id + 1}` : '—'), active: position } })
    }
    a.splice(0, n, ...(out as SortItem[]))
    push('return', '按原始顺序处理相等值，输出保持稳定。', [], Array.from({ length: n }, (_, i) => i))
  } else if (method === 'radix') {
    const max = Math.max(...values)
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const count = Array(10).fill(0) as number[]
      const label = exp === 1 ? '个位' : exp === 10 ? '十位' : `${exp} 位`
      const digit = (item: SortItem) => Math.floor(item.value / exp) % 10
      push('pass', `开始按${label}排序。`, [], [], { auxiliary: { title: `${label} : 频次`, cells: count.map((v, i) => `${i}:${v}`) } })
      for (let i = 0; i < n; i++) {
        count[digit(a[i])]++
        push('digit', `${a[i].value} 的${label}是 ${digit(a[i])}，对应桶加一。`, [i], [], { auxiliary: { title: `${label} : 频次`, cells: count.map((v, j) => `${j}:${v}`), active: digit(a[i]) } })
      }
      for (let i = 1; i < 10; i++) count[i] += count[i - 1]
      push('prefix', '累计计数，确定各位数字在输出中的位置。', [], [], { auxiliary: { title: `${label} : 累计个数`, cells: count.map((v, i) => `${i}:${v}`) } })
      const out: (SortItem | undefined)[] = Array(n)
      for (let i = n - 1; i >= 0; i--) {
        const position = --count[digit(a[i])]
        out[position] = a[i]; writes++
        push('output', `${a[i].value} 放入第 ${position + 1} 格。逆向放置保持本轮稳定。`, [i], [], { auxiliary: { title: `${label}排序 · 输出数组`, cells: out.map(item => item ? `${item.value}·${item.id + 1}` : '—'), active: position } })
      }
      a.splice(0, n, ...(out as SortItem[]))
      push('copy', `${label}排序完成，结果成为下一轮输入。`, [], [], { auxiliary: { title: `${label}排序结果`, cells: a.map(item => `${item.value}·${item.id + 1}`) } })
    }
  }

  push('return', `排序完成：${a.map(item => item.value).join('、')}。`, [], Array.from({ length: n }, (_, i) => i), { done: true })
  return steps
}
