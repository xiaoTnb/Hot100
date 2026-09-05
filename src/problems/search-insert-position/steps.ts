import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type SearchInsertPhase = 'ready' | 'probe' | 'move-left' | 'move-right' | 'done'
export interface SearchInsertStep {
  left: number
  right: number
  mid: number
  phase: SearchInsertPhase
  lineId: string
  message: string
}

export const searchInsertNums = [1, 3, 5, 6]
export const searchInsertTarget = 5
export const searchInsertMethods: PlayerMethod[] = [{ id: 'open-interval', label: '开区间二分', complexity: 'O(log N) · O(1)', languages: ['javascript'] }]

export const searchInsertCode: CodeLine[] = [
  { id: 'method', text: 'function searchInsert(nums, target) {' },
  { id: 'bounds', text: '    let left = -1, right = nums.length' },
  { id: 'loop', text: '    while (left + 1 < right) {' },
  { id: 'mid', text: '        const mid = Math.floor((left + right) / 2)' },
  { id: 'compare', text: '        if (nums[mid] < target) {' },
  { id: 'left', text: '            left = mid' },
  { id: 'else', text: '        } else {' },
  { id: 'right', text: '            right = mid' },
  { id: 'close-if', text: '        }' },
  { id: 'close-loop', text: '    }' },
  { id: 'return', text: '    return right' },
  { id: 'close', text: '}' },
]

export function makeSearchInsertSteps(): SearchInsertStep[] {
  let left = -1
  let right = searchInsertNums.length
  const steps: SearchInsertStep[] = [{ left, right, mid: -1, phase: 'ready', lineId: 'bounds', message: '初始化开区间 (−1, 4)：left 左侧都小于 target，right 右侧都大于等于 target' }]
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push({ left, right, mid, phase: 'probe', lineId: 'mid', message: `取中点 mid = ⌊(${left} + ${right}) / 2⌋ = ${mid}，nums[mid] = ${searchInsertNums[mid]}` })
    if (searchInsertNums[mid] < searchInsertTarget) {
      left = mid
      steps.push({ left, right, mid, phase: 'move-left', lineId: 'left', message: `${searchInsertNums[mid]} < ${searchInsertTarget}，mid 及其左侧不可能是答案，令 left = ${mid}` })
    } else {
      right = mid
      steps.push({ left, right, mid, phase: 'move-right', lineId: 'right', message: `${searchInsertNums[mid]} ≥ ${searchInsertTarget}，mid 可能是第一个合适位置，令 right = ${mid}` })
    }
  }
  steps.push({ left, right, mid: -1, phase: 'done', lineId: 'return', message: `区间已空，right = ${right} 是第一个大于等于 ${searchInsertTarget} 的位置，返回 ${right}` })
  return steps
}
