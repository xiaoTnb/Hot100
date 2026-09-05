import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type RotatePass = 'all' | 'front' | 'back'
export type RotatePhase = 'normalize' | 'range' | 'swap' | 'move' | 'done'

export interface RotateStep {
  nums: number[]
  pass: RotatePass | null
  phase: RotatePhase
  rangeStart: number
  rangeEnd: number
  left: number
  right: number
  lineId: string
  message: string
}

export const rotateInput = [1, 2, 3, 4, 5, 6, 7]
export const rotateK = 3
export const rotateMethods: PlayerMethod[] = [{ id: 'three-reversals', label: '三次反转', complexity: 'O(N) · O(1)', languages: ['javascript'] }]

export const rotateCode: CodeLine[] = [
  { id: 'rotate-method', text: 'function rotate(nums, k) {' },
  { id: 'rotate-reverse-method', text: '    function reverse(i, j) {' },
  { id: 'rotate-reverse-while', text: '        while (i < j) {' },
  { id: 'rotate-reverse-swap', text: '            [nums[i], nums[j]] = [nums[j], nums[i]]' },
  { id: 'rotate-reverse-left', text: '            i++' },
  { id: 'rotate-reverse-right', text: '            j--' },
  { id: 'rotate-reverse-while-close', text: '        }' },
  { id: 'rotate-reverse-close', text: '    }' },
  { id: 'rotate-n', text: '    const n = nums.length' },
  { id: 'rotate-normalize', text: '    k %= n' },
  { id: 'rotate-first', text: '    reverse(0, n - 1)' },
  { id: 'rotate-second', text: '    reverse(0, k - 1)' },
  { id: 'rotate-third', text: '    reverse(k, n - 1)' },
  { id: 'rotate-close', text: '}' },
]

const passLabels: Record<RotatePass, string> = { all: '整体', front: '前 k 段', back: '剩余段' }

export function makeRotateSteps(): RotateStep[] {
  const nums = [...rotateInput]
  const steps: RotateStep[] = [{ nums: [...nums], pass: null, phase: 'normalize', rangeStart: -1, rangeEnd: -1, left: -1, right: -1, lineId: 'rotate-normalize', message: `n = ${nums.length}，k %= n 后仍为 ${rotateK}` }]

  const reverse = (rangeStart: number, rangeEnd: number, pass: RotatePass, callLineId: string) => {
    let left = rangeStart
    let right = rangeEnd
    steps.push({ nums: [...nums], pass, phase: 'range', rangeStart, rangeEnd, left, right, lineId: callLineId, message: `${passLabels[pass]}反转：调用 reverse(${rangeStart}, ${rangeEnd})` })
    while (left < right) {
      const leftValue = nums[left]
      const rightValue = nums[right]
      ;[nums[left], nums[right]] = [nums[right], nums[left]]
      steps.push({ nums: [...nums], pass, phase: 'swap', rangeStart, rangeEnd, left, right, lineId: 'rotate-reverse-swap', message: `交换 nums[${left}] = ${leftValue} 与 nums[${right}] = ${rightValue}` })
      left++
      steps.push({ nums: [...nums], pass, phase: 'move', rangeStart, rangeEnd, left, right, lineId: 'rotate-reverse-left', message: `i++，左指针移动到 ${left}` })
      right--
      steps.push({ nums: [...nums], pass, phase: 'move', rangeStart, rangeEnd, left, right, lineId: 'rotate-reverse-right', message: `j--，右指针移动到 ${right}${left >= right ? '，本段反转完成' : ''}` })
    }
  }

  reverse(0, nums.length - 1, 'all', 'rotate-first')
  reverse(0, rotateK - 1, 'front', 'rotate-second')
  reverse(rotateK, nums.length - 1, 'back', 'rotate-third')
  steps.push({ nums: [...nums], pass: 'back', phase: 'done', rangeStart: rotateK, rangeEnd: nums.length - 1, left: -1, right: -1, lineId: 'rotate-third', message: '三次反转完成，数组变为 [5, 6, 7, 1, 2, 3, 4]' })
  return steps
}
