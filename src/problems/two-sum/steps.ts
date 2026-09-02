import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type TwoSumMethod = 'brute' | 'hash'

export interface TwoSumExample {
  nums: number[]
  target: number
  answer: [number, number]
}

export interface TwoSumStep {
  i: number
  j?: number
  sum?: number
  need?: number
  entries: Array<[number, number]>
  found: boolean
  message: string
  lineId: string
  phase: 'select' | 'calculate' | 'lookup' | 'store' | 'found'
  matched?: boolean
}

export const twoSumExamples: TwoSumExample[] = [
  { nums: [2, 11, 7, 15], target: 9, answer: [0, 2] },
  { nums: [3, 2, 4], target: 6, answer: [1, 2] },
  { nums: [3, 3], target: 6, answer: [0, 1] },
]

export const twoSumMethods: PlayerMethod[] = [
  { id: 'brute', label: '暴力枚举', complexity: 'O(N²)' },
  { id: 'hash', label: '哈希表', complexity: 'O(N)' },
]

const bruteCode: CodeLine[] = [
  { id: 'brute-class', text: 'class Solution {' },
  { id: 'brute-method', text: '  public int[] twoSum(int[] nums, int target) {' },
  { id: 'brute-length', text: '    int n = nums.length;' },
  { id: 'outer-loop', text: '    for (int i = 0; i < n; ++i) {' },
  { id: 'inner-loop', text: '      for (int j = i + 1; j < n; ++j) {' },
  { id: 'compare-sum', text: '        if (nums[i] + nums[j] == target) {' },
  { id: 'return-pair', text: '          return new int[]{i, j};' },
  { id: 'close-if', text: '        }' },
  { id: 'close-inner', text: '      }' },
  { id: 'close-outer', text: '    }' },
  { id: 'brute-empty', text: '    return new int[0];' },
  { id: 'brute-method-close', text: '  }' },
  { id: 'brute-class-close', text: '}' },
]

const hashCode: CodeLine[] = [
  { id: 'hash-class', text: 'class Solution {' },
  { id: 'hash-method', text: '  public int[] twoSum(int[] nums, int target) {' },
  { id: 'create-map', text: '    Map<Integer, Integer> hashtable = new HashMap<Integer, Integer>();' },
  { id: 'iterate-nums', text: '    for (int i = 0; i < nums.length; ++i) {' },
  { id: 'lookup-need', text: '      if (hashtable.containsKey(target - nums[i])) {' },
  { id: 'return-match', text: '        return new int[]{hashtable.get(target - nums[i]), i};' },
  { id: 'close-lookup', text: '      }' },
  { id: 'store-number', text: '      hashtable.put(nums[i], i);' },
  { id: 'close-loop', text: '    }' },
  { id: 'hash-empty', text: '    return new int[0];' },
  { id: 'hash-method-close', text: '  }' },
  { id: 'hash-class-close', text: '}' },
]

export function getTwoSumCode(method: TwoSumMethod): CodeLine[] {
  return method === 'brute' ? bruteCode : hashCode
}

function makeBruteSteps(example: TwoSumExample): TwoSumStep[] {
  const steps: TwoSumStep[] = []
  for (let i = 0; i < example.nums.length; i++) {
    for (let j = i + 1; j < example.nums.length; j++) {
      const sum = example.nums[i] + example.nums[j]
      const found = sum === example.target
      steps.push({
        i, j, sum, found: false, entries: [], lineId: 'inner-loop', phase: 'select',
        message: `固定 i = ${i}，让 j = ${j}，读取 ${example.nums[i]} 和 ${example.nums[j]}`,
      })
      steps.push({
        i, j, sum, found, entries: [], lineId: found ? 'return-pair' : 'compare-sum', phase: found ? 'found' : 'lookup',
        message: found
          ? `${example.nums[i]} + ${example.nums[j]} = ${example.target}，找到答案 [${i}, ${j}]`
          : `${example.nums[i]} + ${example.nums[j]} = ${sum}，不等于 ${example.target}，继续比较`,
      })
      if (found) return steps
    }
  }
  return steps
}

function makeHashSteps(example: TwoSumExample): TwoSumStep[] {
  const map = new Map<number, number>()
  const steps: TwoSumStep[] = []
  for (let i = 0; i < example.nums.length; i++) {
    const value = example.nums[i]
    const need = example.target - value
    const foundIndex = map.get(need)
    steps.push({
      i, need, entries: [...map.entries()], found: false, lineId: 'iterate-nums', phase: 'select',
      message: `遍历到下标 ${i}，取出当前数字 ${value}`,
    })
    steps.push({
      i, need, entries: [...map.entries()], found: false, lineId: 'lookup-need', phase: 'calculate',
      message: `目标是 ${example.target}，当前有 ${value}，先计算还缺少什么：${example.target} − ${value} = ${need}`,
    })
    steps.push({
      i, need, entries: [...map.entries()], found: false, j: foundIndex, lineId: 'lookup-need', phase: 'lookup', matched: foundIndex !== undefined,
      message: foundIndex !== undefined
        ? `带着补数 ${need} 查询哈希表，找到了它对应的下标 ${foundIndex}`
        : `带着补数 ${need} 查询哈希表，当前没有找到`,
    })
    if (foundIndex !== undefined) {
      steps.push({
        i, j: foundIndex, need, entries: [...map.entries()], found: true, lineId: 'return-match', phase: 'found', matched: true,
        message: `补数 ${need} 在下标 ${foundIndex}，所以 nums[${foundIndex}] + nums[${i}] = ${example.target}，返回 [${foundIndex}, ${i}]`,
      })
      return steps
    }
    map.set(value, i)
    steps.push({
      i, need, entries: [...map.entries()], found: false, lineId: 'store-number', phase: 'store',
      message: `存入 ${value} → ${i}，继续查看下一个数字`,
    })
  }
  return steps
}

export function makeTwoSumSteps(method: TwoSumMethod, example: TwoSumExample): TwoSumStep[] {
  return method === 'brute' ? makeBruteSteps(example) : makeHashSteps(example)
}

export function twoSumPhaseLabel(phase: TwoSumStep['phase']) {
  return ({ select: '01 · 取出当前数字', calculate: '02 · 计算补数', lookup: '03 · 查询哈希表', store: '04 · 写入哈希表', found: '05 · 返回答案' })[phase]
}
