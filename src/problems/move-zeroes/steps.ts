import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type MovePhase = 'ready' | 'scan' | 'swap' | 'advance' | 'done'

export interface MoveStep {
  nums: number[]
  left: number
  right: number
  phase: MovePhase
  swapPair: number[]
  lineId: string
  message: string
}

export const moveInitial = [2, 0, 1, 0, 3, 12]
export const moveMethods: PlayerMethod[] = [{ id: 'two-pointers', label: '双指针', complexity: 'O(N) · O(1)' }]

export const moveCode: CodeLine[] = [
  { id: 'class', text: 'class Solution {' },
  { id: 'public', text: 'public:' },
  { id: 'method', text: '  void moveZeroes(vector<int>& nums) {' },
  { id: 'init', text: '    int n = nums.size(), left = 0, right = 0;' },
  { id: 'while', text: '    while (right < n) {' },
  { id: 'if', text: '      if (nums[right]) {' },
  { id: 'swap', text: '        swap(nums[left], nums[right]);' },
  { id: 'left', text: '        left++;' },
  { id: 'if-close', text: '      }' },
  { id: 'right', text: '      right++;' },
  { id: 'while-close', text: '    }' },
  { id: 'method-close', text: '  }' },
  { id: 'class-close', text: '};' },
]

export function makeMoveSteps(): MoveStep[] {
  const nums = [...moveInitial]
  const steps: MoveStep[] = [{ nums: [...nums], left: 0, right: 0, phase: 'ready', swapPair: [], lineId: 'init', message: '初始化：left = 0，right = 0；两者都从数组开头出发' }]
  let left = 0

  for (let right = 0; right < nums.length; right++) {
    const value = nums[right]
    steps.push({ nums: [...nums], left, right, phase: 'scan', swapPair: [], lineId: 'if', message: value === 0 ? `nums[${right}] = 0：right 继续寻找非零数，left 留在 ${left}` : `nums[${right}] = ${value}：找到非零数，准备与 nums[${left}] 交换` })
    if (value !== 0) {
      const oldLeft = nums[left]
      ;[nums[left], nums[right]] = [nums[right], nums[left]]
      steps.push({ nums: [...nums], left, right, phase: 'swap', swapPair: [left, right], lineId: 'swap', message: left === right ? `left 与 right 都在 ${left}，元素已经位于正确位置` : `交换 ${oldLeft} 和 ${value}：非零数 ${value} 被放到已处理区末尾` })
      left++
      steps.push({ nums: [...nums], left, right, phase: 'advance', swapPair: [], lineId: 'left', message: `非零区增加一格，left 向右移动到 ${left}` })
    }
    const nextRight = right + 1
    steps.push({
      nums: [...nums], left, right: nextRight, phase: 'advance', swapPair: [], lineId: 'right',
      message: nextRight === nums.length
        ? `right 从 ${right} 移动到 ${nextRight}，此时 right = n = ${nums.length}，已经越过最后一个下标 ${nums.length - 1}`
        : `right 从 ${right} 向右移动到 ${nextRight}，继续检查 nums[${nextRight}]`,
    })
  }

  steps.push({ nums: [...nums], left, right: nums.length, phase: 'done', swapPair: [], lineId: 'while', message: `判断 right < n：${nums.length} < ${nums.length} 为 false，循环结束；所有 0 已移动到末尾` })
  return steps
}
