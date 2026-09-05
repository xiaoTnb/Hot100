import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type RangePass = 'start' | 'end' | 'done'
export type RangePhase = 'ready' | 'probe' | 'move-left' | 'move-right' | 'capture' | 'done'
export interface RangeStep { left: number; right: number; mid: number; boundTarget: number; pass: RangePass; phase: RangePhase; start: number; end: number; lineId: string; message: string }

export const rangeNums = [5, 7, 7, 8, 8, 10]
export const rangeTarget = 8
export const rangeMethods: PlayerMethod[] = [{ id: 'two-bounds', label: '两次 lowerBound', complexity: 'O(log N) · O(1)', languages: ['javascript'] }]
export const rangeCode: CodeLine[] = [
  { id: 'lower-method', text: 'function lowerBound(nums, target) {' },
  { id: 'bounds', text: '    let left = -1, right = nums.length' },
  { id: 'loop', text: '    while (left + 1 < right) {' },
  { id: 'mid', text: '        const mid = Math.floor((left + right) / 2)' },
  { id: 'compare', text: '        if (nums[mid] < target) {' },
  { id: 'left', text: '            left = mid' },
  { id: 'else', text: '        } else {' },
  { id: 'right', text: '            right = mid' },
  { id: 'if-close', text: '        }' },
  { id: 'loop-close', text: '    }' },
  { id: 'lower-return', text: '    return right' },
  { id: 'lower-close', text: '}' },
  { id: 'method', text: 'function searchRange(nums, target) {' },
  { id: 'start', text: '    const start = lowerBound(nums, target)' },
  { id: 'missing', text: '    if (start === nums.length || nums[start] !== target) {' },
  { id: 'missing-return', text: '        return [-1, -1]' },
  { id: 'missing-close', text: '    }' },
  { id: 'end', text: '    const end = lowerBound(nums, target + 1) - 1' },
  { id: 'return', text: '    return [start, end]' },
  { id: 'close', text: '}' },
]

export function makeRangeSteps(): RangeStep[] {
  let start = -1
  let end = -1
  const steps: RangeStep[] = []
  const runBound = (boundTarget: number, pass: 'start' | 'end') => {
    let left = -1
    let right = rangeNums.length
    const label = pass === 'start' ? '左边界' : '右边界后一位'
    steps.push({ left, right, mid: -1, boundTarget, pass, phase: 'ready', start, end, lineId: pass === 'start' ? 'start' : 'end', message: `${pass === 'start' ? '第一次' : '第二次'} lowerBound：查找 ${label}，本轮 target = ${boundTarget}` })
    while (left + 1 < right) {
      const mid = Math.floor((left + right) / 2)
      steps.push({ left, right, mid, boundTarget, pass, phase: 'probe', start, end, lineId: 'mid', message: `mid = ${mid}，nums[mid] = ${rangeNums[mid]}，与本轮 target ${boundTarget} 比较` })
      if (rangeNums[mid] < boundTarget) {
        left = mid
        steps.push({ left, right, mid, boundTarget, pass, phase: 'move-left', start, end, lineId: 'left', message: `${rangeNums[mid]} < ${boundTarget}，令 left = ${mid}` })
      } else {
        right = mid
        steps.push({ left, right, mid, boundTarget, pass, phase: 'move-right', start, end, lineId: 'right', message: `${rangeNums[mid]} ≥ ${boundTarget}，令 right = ${mid}` })
      }
    }
    if (pass === 'start') start = right
    else end = right - 1
    steps.push({ left, right, mid: -1, boundTarget, pass, phase: 'capture', start, end, lineId: pass === 'start' ? 'start' : 'end', message: pass === 'start' ? `lowerBound(8) = ${right}，记录 start = ${start}` : `lowerBound(9) = ${right}，所以 end = ${right} − 1 = ${end}` })
  }
  runBound(rangeTarget, 'start')
  runBound(rangeTarget + 1, 'end')
  steps.push({ left: -1, right: rangeNums.length, mid: -1, boundTarget: rangeTarget, pass: 'done', phase: 'done', start, end, lineId: 'return', message: `两个边界都已确定，返回 [${start}, ${end}]` })
  return steps
}
