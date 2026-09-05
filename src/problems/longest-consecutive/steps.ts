import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ConsecutivePhase = 'build' | 'check' | 'skip' | 'start' | 'expand' | 'update' | 'done'

export interface ConsecutiveStep {
  phase: ConsecutivePhase
  arrayIndex: number
  setValues: number[]
  currentNum: number | null
  probe: number | null
  predecessorExists: boolean | null
  duplicateRejected: boolean
  sequence: number[]
  currentStreak: number
  longestStreak: number
  lineId: string
  message: string
}

export const consecutiveNumbers = [100, 4, 200, 1, 3, 2, 2]

export const consecutiveMethods: PlayerMethod[] = [
  { id: 'hash-set', label: '哈希集合', complexity: 'O(N)' },
]

export const consecutiveCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'method', text: '  public int longestConsecutive(int[] nums) {' },
  { id: 'create-set', text: '    Set<Integer> num_set = new HashSet<Integer>();' },
  { id: 'build-loop', text: '    for (int num : nums) {' },
  { id: 'set-add', text: '      num_set.add(num);' },
  { id: 'build-close', text: '    }' },
  { id: 'blank-1', text: '' },
  { id: 'longest-init', text: '    int longestStreak = 0;' },
  { id: 'blank-2', text: '' },
  { id: 'scan-loop', text: '    for (int num : num_set) {' },
  { id: 'check-start', text: '      if (!num_set.contains(num - 1)) {' },
  { id: 'current-init', text: '        int currentNum = num;' },
  { id: 'streak-init', text: '        int currentStreak = 1;' },
  { id: 'blank-3', text: '' },
  { id: 'while', text: '        while (num_set.contains(currentNum + 1)) {' },
  { id: 'increment-number', text: '          currentNum += 1;' },
  { id: 'increment-streak', text: '          currentStreak += 1;' },
  { id: 'while-close', text: '        }' },
  { id: 'blank-4', text: '' },
  { id: 'update-longest', text: '        longestStreak = Math.max(longestStreak, currentStreak);' },
  { id: 'if-close', text: '      }' },
  { id: 'scan-close', text: '    }' },
  { id: 'blank-5', text: '' },
  { id: 'return', text: '    return longestStreak;' },
  { id: 'method-close', text: '  }' },
  { id: 'class-close', text: '}' },
]

export const consecutivePhaseNames = [
  { id: 'build', label: '构建 Set' },
  { id: 'check', label: '判断起点' },
  { id: 'expand', label: '向右扩展' },
  { id: 'update', label: '更新答案' },
] as const

function makeStep(overrides: Partial<ConsecutiveStep>): ConsecutiveStep {
  return {
    phase: 'build', arrayIndex: -1, setValues: [], currentNum: null, probe: null,
    predecessorExists: null, duplicateRejected: false, sequence: [], currentStreak: 0, longestStreak: 0,
    lineId: 'create-set', message: '创建一个空的 Set，用来保存所有数字并自动去重',
    ...overrides,
  }
}

export function makeConsecutiveSteps(): ConsecutiveStep[] {
  const steps: ConsecutiveStep[] = [makeStep({})]
  const set = new Set<number>()

  consecutiveNumbers.forEach((number, arrayIndex) => {
    const duplicateRejected = set.has(number)
    set.add(number)
    steps.push(makeStep({
      arrayIndex,
      setValues: [...set],
      duplicateRejected,
      lineId: 'set-add',
      message: duplicateRejected
        ? `nums[${arrayIndex}] = ${number} 已经存在：Set 拒绝重复值，Set.size 仍是 ${set.size}`
        : `把 nums[${arrayIndex}] = ${number} 加入 Set，Set.size 变为 ${set.size}`,
    }))
  })

  let longestStreak = 0
  const setValues = [...set]

  setValues.forEach((num) => {
    const predecessor = num - 1
    const predecessorExists = set.has(predecessor)
    steps.push(makeStep({
      phase: 'check', arrayIndex: consecutiveNumbers.indexOf(num), setValues,
      currentNum: num, probe: predecessor, predecessorExists, longestStreak, lineId: 'check-start',
      message: predecessorExists
        ? `检查 ${num} - 1 = ${predecessor}：Set 中存在前驱，${num} 不是起点`
        : `检查 ${num} - 1 = ${predecessor}：Set 中没有前驱，${num} 是一段序列的起点`,
    }))

    if (predecessorExists) {
      steps.push(makeStep({
        phase: 'skip', arrayIndex: consecutiveNumbers.indexOf(num), setValues,
        currentNum: num, probe: predecessor, predecessorExists: true, longestStreak, lineId: 'scan-loop',
        message: `跳过 ${num}：它会由更前面的起点负责统计，避免重复扫描`,
      }))
      return
    }

    let currentNum = num
    let currentStreak = 1
    const sequence = [num]
    steps.push(makeStep({
      phase: 'start', arrayIndex: consecutiveNumbers.indexOf(num), setValues,
      currentNum, probe: currentNum + 1, predecessorExists: false, sequence: [...sequence],
      currentStreak, longestStreak, lineId: 'streak-init',
      message: `从 ${num} 开始：currentNum = ${num}，currentStreak = 1`,
    }))

    while (set.has(currentNum + 1)) {
      const next = currentNum + 1
      currentNum = next
      currentStreak += 1
      sequence.push(next)
      steps.push(makeStep({
        phase: 'expand', arrayIndex: consecutiveNumbers.indexOf(num), setValues,
        currentNum, probe: next, predecessorExists: false, sequence: [...sequence], currentStreak,
        longestStreak, lineId: 'increment-streak',
        message: `Set 中存在 ${next}：序列延长为 ${sequence.join(' → ')}，长度变为 ${currentStreak}`,
      }))
    }

    steps.push(makeStep({
      phase: 'expand', arrayIndex: consecutiveNumbers.indexOf(num), setValues,
      currentNum, probe: currentNum + 1, predecessorExists: false, sequence: [...sequence],
      currentStreak, longestStreak, lineId: 'while',
      message: `Set 中不存在 ${currentNum + 1}，这一段连续序列到此结束`,
    }))

    const previousLongest = longestStreak
    longestStreak = Math.max(longestStreak, currentStreak)
    steps.push(makeStep({
      phase: 'update', arrayIndex: consecutiveNumbers.indexOf(num), setValues,
      currentNum, predecessorExists: false, sequence: [...sequence], currentStreak, longestStreak,
      lineId: 'update-longest',
      message: longestStreak > previousLongest
        ? `更新最长长度：max(${previousLongest}, ${currentStreak}) = ${longestStreak}`
        : `当前长度 ${currentStreak} 没有超过 ${longestStreak}，答案保持不变`,
    }))
  })

  steps.push(makeStep({
    phase: 'done', setValues, sequence: [1, 2, 3, 4], currentStreak: 4,
    longestStreak, lineId: 'return', message: `遍历完成，最长连续序列是 1 → 2 → 3 → 4，返回 ${longestStreak}`,
  }))
  return steps
}
