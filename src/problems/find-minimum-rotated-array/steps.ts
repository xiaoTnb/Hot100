import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type FindMinimumPhase = 'ready' | 'probe' | 'move-left' | 'move-right' | 'done'
export interface FindMinimumStep { left: number; right: number; mid: number; phase: FindMinimumPhase; lineId: string; message: string }

export const minimumNums = [3, 4, 5, 1, 2]
export const minimumMethods: PlayerMethod[] = [{ id: 'compare-last', label: '与末尾值比较', complexity: 'O(log N) · O(1)', languages: ['javascript'] }]
export const minimumCode: CodeLine[] = [
  { id: 'method', text: 'function findMin(nums) {' },
  { id: 'left', text: '    let left = -1' },
  { id: 'right', text: '    let right = nums.length - 1' },
  { id: 'loop', text: '    while (left + 1 < right) {' },
  { id: 'mid', text: '        const mid = Math.floor((right + left) / 2)' },
  { id: 'compare', text: '        if (nums[mid] < nums[nums.length - 1]) {' },
  { id: 'move-right', text: '            right = mid' },
  { id: 'else', text: '        } else {' },
  { id: 'move-left', text: '            left = mid' },
  { id: 'if-close', text: '        }' },
  { id: 'loop-close', text: '    }' },
  { id: 'return', text: '    return nums[right]' },
  { id: 'close', text: '}' },
]

export function makeMinimumSteps(): FindMinimumStep[] {
  let left = -1
  let right = minimumNums.length - 1
  const steps: FindMinimumStep[] = [{ left, right, mid: -1, phase: 'ready', lineId: 'right', message: `初始化 left = −1，right = ${right}；末尾值 ${minimumNums.at(-1)} 一定位于最小值所在的右侧段` }]
  while (left + 1 < right) {
    const mid = Math.floor((left + right) / 2)
    steps.push({ left, right, mid, phase: 'probe', lineId: 'compare', message: `mid = ${mid}，比较 nums[mid] = ${minimumNums[mid]} 与末尾值 ${minimumNums.at(-1)}` })
    if (minimumNums[mid] < minimumNums.at(-1)!) {
      right = mid
      steps.push({ left, right, mid, phase: 'move-right', lineId: 'move-right', message: `${minimumNums[mid]} < ${minimumNums.at(-1)}，mid 在右侧段且可能就是最小值，令 right = ${mid}` })
    } else {
      left = mid
      steps.push({ left, right, mid, phase: 'move-left', lineId: 'move-left', message: `${minimumNums[mid]} ≥ ${minimumNums.at(-1)}，mid 在左侧大值段，令 left = ${mid}` })
    }
  }
  steps.push({ left, right, mid: right, phase: 'done', lineId: 'return', message: `left 与 right 已相邻，最小值下标是 ${right}，返回 nums[${right}] = ${minimumNums[right]}` })
  return steps
}
