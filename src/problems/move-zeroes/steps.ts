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

export const moveInitial = [2, 5, 0, 1, 0, 3, 12]
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
    steps.push({ nums: [...nums], left, right, phase: 'scan', swapPair: [], lineId: 'if', message: value === 0 ? `nums[${right}] = 0：r 继续向右寻找非零数，l 留在 ${left}` : `r 从左到右找到第 ${left + 1} 个非零数 ${value}，准备把它放到 nums[${left}]` })
    if (value !== 0) {
      const oldLeft = nums[left]
      ;[nums[left], nums[right]] = [nums[right], nums[left]]
      steps.push({ nums: [...nums], left, right, phase: 'swap', swapPair: [left, right], lineId: 'swap', message: left === right ? `l 与 r 都在 ${left}，${value} 已经位于正确位置，原地交换不会改变数组` : `交换 ${oldLeft} 和 ${value}：按发现顺序把非零数 ${value} 放到 nums[${left}]` })
      left++
      steps.push({ nums: [...nums], left, right, phase: 'advance', swapPair: [], lineId: 'left', message: `非零区增加一格，l 向右移动到 ${left}` })
    }
    const nextRight = right + 1
    steps.push({
      nums: [...nums], left, right: nextRight, phase: 'advance', swapPair: [], lineId: 'right',
      message: nextRight === nums.length
        ? `r 从 ${right} 移动到 ${nextRight}，此时 r = n = ${nums.length}，已经越过最后一个下标 ${nums.length - 1}`
        : `r 从 ${right} 向右移动到 ${nextRight}，继续检查 nums[${nextRight}]`,
    })
  }

  steps.push({ nums: [...nums], left, right: nums.length, phase: 'done', swapPair: [], lineId: 'while', message: `判断 right < n：${nums.length} < ${nums.length} 为 false，循环结束；r 按从左到右的顺序处理非零数，所以它们的相对顺序没有改变` })
  return steps
}
