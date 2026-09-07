import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type MissingPhase = 'ready' | 'check' | 'swap' | 'settled' | 'scan' | 'missing' | 'done'
export interface MissingStep {
  phase: MissingPhase
  nums: number[]
  index: number
  targetIndex: number
  scanIndex: number
  valid: boolean
  duplicate: boolean
  answer: number | null
  lineId: string
  message: string
}

export const missingInput = [3, 4, -1, 1, 1]
export const missingMethods: PlayerMethod[] = [{ id: 'placement', label: '原地换座位', complexity: 'O(N) · O(1)', languages: ['java'] }]
export const missingCode: CodeLine[] = [
  { id: 'm-class', text: 'class Solution {' },
  { id: 'm-method', text: '  public int firstMissingPositive(int[] nums) {' },
  { id: 'm-n', text: '    int n = nums.length;' },
  { id: 'm-loop', text: '    for (int i = 0; i < n; i++) {' },
  { id: 'm-while', text: '      while (1 <= nums[i] && nums[i] <= n' },
  { id: 'm-while-2', text: '          && nums[nums[i] - 1] != nums[i]) {' },
  { id: 'm-j', text: '        int j = nums[i] - 1;' },
  { id: 'm-tmp', text: '        int tmp = nums[i];' },
  { id: 'm-left', text: '        nums[i] = nums[j];' },
  { id: 'm-right', text: '        nums[j] = tmp;' },
  { id: 'm-while-close', text: '      }' },
  { id: 'm-loop-close', text: '    }' },
  { id: 'm-blank', text: '' },
  { id: 'm-scan', text: '    for (int i = 0; i < n; i++) {' },
  { id: 'm-if', text: '      if (nums[i] != i + 1) {' },
  { id: 'm-return-missing', text: '        return i + 1;' },
  { id: 'm-if-close', text: '      }' },
  { id: 'm-scan-close', text: '    }' },
  { id: 'm-return-last', text: '    return n + 1;' },
  { id: 'm-method-close', text: '  }' },
  { id: 'm-class-close', text: '}' },
]

const makeStep = (values: Partial<MissingStep>): MissingStep => ({ phase: 'ready', nums: [...missingInput], index: -1, targetIndex: -1, scanIndex: -1, valid: false, duplicate: false, answer: null, lineId: 'm-n', message: '', ...values })

export function makeMissingSteps(): MissingStep[] {
  const nums = [...missingInput]
  const n = nums.length
  const steps: MissingStep[] = [makeStep({ message: '座位编号是 1 到 ' + n + '；学号 x 应坐到下标 x - 1' })]
  for (let i = 0; i < n; i++) {
    while (true) {
      const value = nums[i]
      const valid = value >= 1 && value <= n
      const targetIndex = valid ? value - 1 : -1
      const duplicate = valid && nums[targetIndex] === value
      steps.push(makeStep({ phase: 'check', nums: [...nums], index: i, targetIndex, valid, duplicate, lineId: 'm-while-2', message: valid ? duplicate ? 'nums[' + i + '] = ' + value + '，但座位 ' + value + ' 已经坐着同学号；这是重复值，不能交换' : '学号 ' + value + ' 在 [1, ' + n + '] 内，应去座位 ' + value : 'nums[' + i + '] = ' + value + ' 不在 [1, ' + n + ']，不用安排座位' }))
      if (!valid || duplicate) break
      const before = [...nums]
      const tmp = nums[i]
      nums[i] = nums[targetIndex]
      nums[targetIndex] = tmp
      steps.push(makeStep({ phase: 'swap', nums: [...nums], index: i, targetIndex, valid: true, lineId: 'm-right', message: '交换下标 ' + i + ' 和 ' + targetIndex + '：[' + before.join(', ') + '] → [' + nums.join(', ') + ']' }))
    }
    steps.push(makeStep({ phase: 'settled', nums: [...nums], index: i, targetIndex: -1, lineId: 'm-loop-close', message: '下标 ' + i + ' 暂时处理完成，继续看下一个位置' }))
  }
  for (let i = 0; i < n; i++) {
    const matches = nums[i] === i + 1
    steps.push(makeStep({ phase: 'scan', nums: [...nums], scanIndex: i, answer: matches ? null : i + 1, lineId: 'm-if', message: '检查座位 ' + (i + 1) + '：期望学号 ' + (i + 1) + '，实际是 ' + nums[i] + (matches ? '，匹配' : '，不匹配') }))
    if (!matches) {
      steps.push(makeStep({ phase: 'missing', nums: [...nums], scanIndex: i, answer: i + 1, lineId: 'm-return-missing', message: '第一个不匹配的座位编号是 ' + (i + 1) + '，它就是缺失的最小正整数' }))
      return steps
    }
  }
  steps.push(makeStep({ phase: 'done', nums: [...nums], scanIndex: n - 1, answer: n + 1, lineId: 'm-return-last', message: '1 到 ' + n + ' 全部存在，答案是 ' + (n + 1) }))
  return steps
}
