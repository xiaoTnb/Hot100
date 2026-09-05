import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type RotatedPass = 'pivot' | 'choose' | 'search' | 'done'
export type RotatedPhase = 'ready' | 'probe' | 'move-left' | 'move-right' | 'choose' | 'found' | 'done'
export interface RotatedStep { left: number; right: number; mid: number; pivot: number; pass: RotatedPass; phase: RotatedPhase; lineId: string; message: string }

export const rotatedNums = [4, 5, 6, 7, 0, 1, 2]
export const rotatedTarget = 0
export const rotatedMethods: PlayerMethod[] = [{ id: 'pivot-bound', label: '旋转点 + 二分', complexity: 'O(log N) · O(1)', languages: ['javascript'] }]
export const rotatedCode: CodeLine[] = [
  { id: 'find-method', text: 'function findMin(nums) {' },
  { id: 'find-left', text: '    let left = -1' },
  { id: 'find-right', text: '    let right = nums.length - 1' },
  { id: 'find-loop', text: '    while (left + 1 < right) {' },
  { id: 'find-mid', text: '        const mid = Math.floor((right + left) / 2)' },
  { id: 'find-compare', text: '        if (nums[mid] < nums[nums.length - 1]) {' },
  { id: 'find-move-right', text: '            right = mid' },
  { id: 'find-else', text: '        } else {' },
  { id: 'find-move-left', text: '            left = mid' },
  { id: 'find-if-close', text: '        }' },
  { id: 'find-loop-close', text: '    }' },
  { id: 'find-return', text: '    return right' },
  { id: 'find-close', text: '}' },
  { id: 'lower-method', text: 'function lowerBound(nums, left, right, target) {' },
  { id: 'lower-loop', text: '    while (left + 1 < right) {' },
  { id: 'lower-mid', text: '        const mid = Math.floor((right + left) / 2)' },
  { id: 'lower-compare', text: '        if (nums[mid] < target) {' },
  { id: 'lower-left', text: '            left = mid' },
  { id: 'lower-else', text: '        } else {' },
  { id: 'lower-right', text: '            right = mid' },
  { id: 'lower-if-close', text: '        }' },
  { id: 'lower-loop-close', text: '    }' },
  { id: 'lower-return', text: '    return nums[right] === target ? right : -1' },
  { id: 'lower-close', text: '}' },
  { id: 'method', text: 'function search(nums, target) {' },
  { id: 'pivot', text: '    const i = findMin(nums)' },
  { id: 'choose', text: '    if (target > nums[nums.length - 1]) {' },
  { id: 'first-range', text: '        return lowerBound(nums, -1, i, target)' },
  { id: 'choose-close', text: '    }' },
  { id: 'second-range', text: '    return lowerBound(nums, i - 1, nums.length, target)' },
  { id: 'close', text: '}' },
]

export function makeRotatedSteps(): RotatedStep[] {
  let left = -1
  let right = rotatedNums.length - 1
  let pivot = -1
  const steps: RotatedStep[] = [{ left, right, mid: -1, pivot, pass: 'pivot', phase: 'ready', lineId: 'find-right', message: `第一阶段：用末尾值 ${rotatedNums.at(-1)} 判断中点位于旋转点的哪一侧` }]
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push({ left, right, mid, pivot, pass: 'pivot', phase: 'probe', lineId: 'find-compare', message: `nums[${mid}] = ${rotatedNums[mid]}，与末尾值 ${rotatedNums.at(-1)} 比较` })
    if (rotatedNums[mid] < rotatedNums.at(-1)!) {
      right = mid
      steps.push({ left, right, mid, pivot, pass: 'pivot', phase: 'move-right', lineId: 'find-move-right', message: `${rotatedNums[mid]} < ${rotatedNums.at(-1)}，mid 位于最小值一侧，令 right = ${mid}` })
    } else {
      left = mid
      steps.push({ left, right, mid, pivot, pass: 'pivot', phase: 'move-left', lineId: 'find-move-left', message: `${rotatedNums[mid]} ≥ ${rotatedNums.at(-1)}，mid 仍在较大值一段，令 left = ${mid}` })
    }
  }
  pivot = right
  steps.push({ left, right, mid: -1, pivot, pass: 'choose', phase: 'choose', lineId: 'pivot', message: `旋转点 i = ${pivot}，最小值是 nums[${pivot}] = ${rotatedNums[pivot]}` })
  if (rotatedTarget > rotatedNums.at(-1)!) {
    left = -1
    right = pivot
    steps.push({ left, right, mid: -1, pivot, pass: 'choose', phase: 'choose', lineId: 'first-range', message: `${rotatedTarget} > ${rotatedNums.at(-1)}，在旋转点左侧区间 [0, ${pivot - 1}] 查找` })
  } else {
    left = pivot - 1
    right = rotatedNums.length
    steps.push({ left, right, mid: -1, pivot, pass: 'choose', phase: 'choose', lineId: 'second-range', message: `${rotatedTarget} ≤ ${rotatedNums.at(-1)}，在旋转点右侧区间 [${pivot}, ${rotatedNums.length - 1}] 查找` })
  }
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push({ left, right, mid, pivot, pass: 'search', phase: 'probe', lineId: 'lower-mid', message: `第二阶段：mid = ${mid}，nums[mid] = ${rotatedNums[mid]}` })
    if (rotatedNums[mid] < rotatedTarget) {
      left = mid
      steps.push({ left, right, mid, pivot, pass: 'search', phase: 'move-left', lineId: 'lower-left', message: `${rotatedNums[mid]} < ${rotatedTarget}，令 left = ${mid}` })
    } else {
      right = mid
      steps.push({ left, right, mid, pivot, pass: 'search', phase: 'move-right', lineId: 'lower-right', message: `${rotatedNums[mid]} ≥ ${rotatedTarget}，令 right = ${mid}` })
    }
  }
  const found = rotatedNums[right] === rotatedTarget
  steps.push({ left, right, mid: right, pivot, pass: 'done', phase: found ? 'found' : 'done', lineId: 'lower-return', message: found ? `nums[${right}] = ${rotatedTarget}，返回下标 ${right}` : `nums[${right}] 不是 ${rotatedTarget}，返回 −1` })
  return steps
}
