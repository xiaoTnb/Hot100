import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type RainMethod = 'dp' | 'stack' | 'pointers'
export type RainPhase = 'left-max' | 'right-max' | 'collect' | 'push' | 'pop' | 'done'
export type RainCalculation =
  | { kind: 'column'; side: 'left' | 'right' | 'both'; leftMax: number; rightMax: number; barHeight: number }
  | { kind: 'basin'; leftIndex: number; bottomIndex: number; rightIndex: number; leftHeight: number; bottomHeight: number; rightHeight: number; width: number; waterHeight: number }
export interface RainStep {
  phase: RainPhase; index: number; left: number; right: number; leftMax: number[]; rightMax: number[];
  stack: number[]; waterAt: number[]; currentWater: number; total: number; basin: number[]; calculation: RainCalculation | null; lineId: string; message: string
}

export const rainHeights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
export const rainMethods: PlayerMethod[] = [
  { id: 'dp', label: '动态规划', complexity: 'O(N) · O(N)' },
  { id: 'stack', label: '单调栈', complexity: 'O(N) · O(N)' },
  { id: 'pointers', label: '双指针', complexity: 'O(N) · O(1)' },
]

const dpCode: CodeLine[] = [
  { id: 'dp-class', text: 'class Solution {' },
  { id: 'dp-method', text: '  public int trap(int[] height) {' },
  { id: 'dp-n', text: '    int n = height.length;' },
  { id: 'dp-empty', text: '    if (n == 0) {' },
  { id: 'dp-zero', text: '      return 0;' },
  { id: 'dp-empty-close', text: '    }' },
  { id: 'dp-left-array', text: '    int[] leftMax = new int[n];' },
  { id: 'dp-left-first', text: '    leftMax[0] = height[0];' },
  { id: 'dp-left-loop', text: '    for (int i = 1; i < n; ++i) {' },
  { id: 'dp-left-update', text: '      leftMax[i] = Math.max(leftMax[i - 1], height[i]);' },
  { id: 'dp-left-close', text: '    }' },
  { id: 'dp-right-array', text: '    int[] rightMax = new int[n];' },
  { id: 'dp-right-last', text: '    rightMax[n - 1] = height[n - 1];' },
  { id: 'dp-right-loop', text: '    for (int i = n - 2; i >= 0; --i) {' },
  { id: 'dp-right-update', text: '      rightMax[i] = Math.max(rightMax[i + 1], height[i]);' },
  { id: 'dp-right-close', text: '    }' },
  { id: 'dp-answer', text: '    int ans = 0;' },
  { id: 'dp-sum-loop', text: '    for (int i = 0; i < n; ++i) {' },
  { id: 'dp-add', text: '      ans += Math.min(leftMax[i], rightMax[i]) - height[i];' },
  { id: 'dp-sum-close', text: '    }' },
  { id: 'dp-return', text: '    return ans;' },
  { id: 'dp-method-close', text: '  }' },
  { id: 'dp-class-close', text: '}' },
]

const stackCode: CodeLine[] = [
  { id: 'stack-class', text: 'class Solution {' },
  { id: 'stack-method', text: '  public int trap(int[] height) {' },
  { id: 'stack-answer', text: '    int ans = 0;' },
  { id: 'stack-create', text: '    Deque<Integer> stack = new LinkedList<Integer>();' },
  { id: 'stack-n', text: '    int n = height.length;' },
  { id: 'stack-loop', text: '    for (int i = 0; i < n; ++i) {' },
  { id: 'stack-while', text: '      while (!stack.isEmpty() && height[i] > height[stack.peek()]) {' },
  { id: 'stack-pop', text: '        int top = stack.pop();' },
  { id: 'stack-empty', text: '        if (stack.isEmpty()) {' },
  { id: 'stack-break', text: '          break;' },
  { id: 'stack-empty-close', text: '        }' },
  { id: 'stack-left', text: '        int left = stack.peek();' },
  { id: 'stack-width', text: '        int currWidth = i - left - 1;' },
  { id: 'stack-height', text: '        int currHeight = Math.min(height[left], height[i]) - height[top];' },
  { id: 'stack-add', text: '        ans += currWidth * currHeight;' },
  { id: 'stack-while-close', text: '      }' },
  { id: 'stack-push', text: '      stack.push(i);' },
  { id: 'stack-loop-close', text: '    }' },
  { id: 'stack-return', text: '    return ans;' },
  { id: 'stack-method-close', text: '  }' },
  { id: 'stack-class-close', text: '}' },
]

const pointerCode: CodeLine[] = [
  { id: 'pointer-class', text: 'class Solution {' },
  { id: 'pointer-method', text: '  public int trap(int[] height) {' },
  { id: 'pointer-answer', text: '    int ans = 0;' },
  { id: 'pointer-init', text: '    int left = 0, right = height.length - 1;' },
  { id: 'pointer-max', text: '    int leftMax = 0, rightMax = 0;' },
  { id: 'pointer-while', text: '    while (left < right) {' },
  { id: 'pointer-left-max', text: '      leftMax = Math.max(leftMax, height[left]);' },
  { id: 'pointer-right-max', text: '      rightMax = Math.max(rightMax, height[right]);' },
  { id: 'pointer-if', text: '      if (height[left] < height[right]) {' },
  { id: 'pointer-add-left', text: '        ans += leftMax - height[left];' },
  { id: 'pointer-left', text: '        ++left;' },
  { id: 'pointer-else', text: '      } else {' },
  { id: 'pointer-add-right', text: '        ans += rightMax - height[right];' },
  { id: 'pointer-right', text: '        --right;' },
  { id: 'pointer-close', text: '      }' },
  { id: 'pointer-while-close', text: '    }' },
  { id: 'pointer-return', text: '    return ans;' },
  { id: 'pointer-method-close', text: '  }' },
  { id: 'pointer-class-close', text: '}' },
]

export const getRainCode = (method: RainMethod) => method === 'dp' ? dpCode : method === 'stack' ? stackCode : pointerCode
const zeros = () => Array<number>(rainHeights.length).fill(0)
const step = (values: Partial<RainStep>): RainStep => ({ phase: 'collect', index: -1, left: -1, right: -1, leftMax: zeros(), rightMax: zeros(), stack: [], waterAt: zeros(), currentWater: 0, total: 0, basin: [], calculation: null, lineId: '', message: '', ...values })

function makeDpSteps(): RainStep[] {
  const leftMax = zeros(), rightMax = zeros(), waterAt = zeros(), steps: RainStep[] = []
  leftMax[0] = rainHeights[0]
  steps.push(step({ phase: 'left-max', index: 0, leftMax: [...leftMax], lineId: 'dp-left-first', message: '从左开始：leftMax[0] = height[0] = 0' }))
  for (let i = 1; i < rainHeights.length; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], rainHeights[i])
    steps.push(step({ phase: 'left-max', index: i, leftMax: [...leftMax], lineId: 'dp-left-update', message: `leftMax[${i}] = max(${leftMax[i - 1]}, ${rainHeights[i]}) = ${leftMax[i]}` }))
  }
  rightMax[rainHeights.length - 1] = rainHeights.at(-1)!
  steps.push(step({ phase: 'right-max', index: rainHeights.length - 1, leftMax: [...leftMax], rightMax: [...rightMax], lineId: 'dp-right-last', message: '从右开始填写 rightMax 数组' }))
  for (let i = rainHeights.length - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], rainHeights[i])
    steps.push(step({ phase: 'right-max', index: i, leftMax: [...leftMax], rightMax: [...rightMax], lineId: 'dp-right-update', message: `rightMax[${i}] = max(${rightMax[i + 1]}, ${rainHeights[i]}) = ${rightMax[i]}` }))
  }
  let total = 0
  for (let i = 0; i < rainHeights.length; i++) {
    const currentWater = Math.min(leftMax[i], rightMax[i]) - rainHeights[i]
    waterAt[i] = currentWater
    total += currentWater
    steps.push(step({ phase: 'collect', index: i, leftMax: [...leftMax], rightMax: [...rightMax], waterAt: [...waterAt], currentWater, total, calculation: { kind: 'column', side: 'both', leftMax: leftMax[i], rightMax: rightMax[i], barHeight: rainHeights[i] }, lineId: 'dp-add', message: `下标 ${i}：左侧最高 ${leftMax[i]}，右侧最高 ${rightMax[i]}，水面只能到较低的 ${Math.min(leftMax[i], rightMax[i])}；减去柱高 ${rainHeights[i]}，这里接水 ${currentWater}` }))
  }
  steps.push(step({ phase: 'done', leftMax, rightMax, waterAt, total, lineId: 'dp-return', message: '三个遍历阶段完成，共接到 6 个单位雨水' }))
  return steps
}

function makeStackSteps(): RainStep[] {
  const stack: number[] = [], waterAt = zeros(), steps: RainStep[] = []
  let total = 0
  for (let i = 0; i < rainHeights.length; i++) {
    while (stack.length && rainHeights[i] > rainHeights[stack[stack.length - 1]]) {
      const top = stack.pop()!
      if (!stack.length) {
        steps.push(step({ phase: 'pop', index: i, stack: [], waterAt: [...waterAt], total, basin: [top], lineId: 'stack-break', message: `弹出下标 ${top} 后栈为空，没有左边界，不能形成积水` }))
        break
      }
      const left = stack[stack.length - 1]
      const width = i - left - 1
      const depth = Math.min(rainHeights[left], rainHeights[i]) - rainHeights[top]
      const currentWater = width * depth
      for (let j = left + 1; j < i; j++) waterAt[j] += depth
      total += currentWater
      steps.push(step({ phase: 'pop', index: i, left, right: i, stack: [...stack], waterAt: [...waterAt], currentWater, total, basin: [left, top, i], calculation: { kind: 'basin', leftIndex: left, bottomIndex: top, rightIndex: i, leftHeight: rainHeights[left], bottomHeight: rainHeights[top], rightHeight: rainHeights[i], width, waterHeight: depth }, lineId: 'stack-add', message: `左墙是下标 ${left}（高 ${rainHeights[left]}），坑底是 ${top}（高 ${rainHeights[top]}），右墙是 ${i}（高 ${rainHeights[i]}）：宽 ${width}，本层水高 ${depth}，新增 ${currentWater}` }))
    }
    stack.push(i)
    steps.push(step({ phase: 'push', index: i, stack: [...stack], waterAt: [...waterAt], total, basin: [], lineId: 'stack-push', message: `下标 ${i} 入栈；栈内柱高从底到顶保持递减` }))
  }
  steps.push(step({ phase: 'done', stack: [...stack], waterAt, total, lineId: 'stack-return', message: '每个下标最多入栈、出栈一次，最终雨水量为 6' }))
  return steps
}

function makePointerSteps(): RainStep[] {
  const waterAt = zeros(), steps: RainStep[] = []
  let left = 0, right = rainHeights.length - 1, leftPeak = 0, rightPeak = 0, total = 0
  while (left < right) {
    leftPeak = Math.max(leftPeak, rainHeights[left])
    rightPeak = Math.max(rightPeak, rainHeights[right])
    const leftMax = zeros(), rightMax = zeros()
    leftMax[left] = leftPeak; rightMax[right] = rightPeak
    if (rainHeights[left] < rainHeights[right]) {
      const currentWater = leftPeak - rainHeights[left]
      waterAt[left] = currentWater; total += currentWater
      steps.push(step({ phase: 'collect', index: left, left, right, leftMax, rightMax, waterAt: [...waterAt], currentWater, total, calculation: { kind: 'column', side: 'left', leftMax: leftPeak, rightMax: rightPeak, barHeight: rainHeights[left] }, lineId: 'pointer-add-left', message: `结算下标 ${left}：leftMax=${leftPeak} 是左侧走过位置的最高柱，height[${left}]=${rainHeights[left]} 是当前柱高，所以这里接水 ${leftPeak}-${rainHeights[left]}=${currentWater}；再执行 left++` }))
      left++
    } else {
      const currentWater = rightPeak - rainHeights[right]
      waterAt[right] = currentWater; total += currentWater
      steps.push(step({ phase: 'collect', index: right, left, right, leftMax, rightMax, waterAt: [...waterAt], currentWater, total, calculation: { kind: 'column', side: 'right', leftMax: leftPeak, rightMax: rightPeak, barHeight: rainHeights[right] }, lineId: 'pointer-add-right', message: `结算下标 ${right}：rightMax=${rightPeak} 是右侧走过位置的最高柱，height[${right}]=${rainHeights[right]} 是当前柱高，所以这里接水 ${rightPeak}-${rainHeights[right]}=${currentWater}；再执行 right--` }))
      right--
    }
  }
  steps.push(step({ phase: 'done', left, right, waterAt, total, lineId: 'pointer-return', message: '左右指针相遇，只用常数额外空间得到雨水总量 6' }))
  return steps
}

export const makeRainSteps = (method: RainMethod) => method === 'dp' ? makeDpSteps() : method === 'stack' ? makeStackSteps() : makePointerSteps()
