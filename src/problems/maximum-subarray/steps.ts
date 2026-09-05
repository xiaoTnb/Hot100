import type { CodeLanguage, CodeLine, PlayerMethod } from '../../components/player/types'

export type MaxMethod = 'prefix' | 'dp' | 'rolling'
export type MaxPhase = 'ready' | 'sum' | 'candidate' | 'minimum' | 'transition' | 'update' | 'done'
export interface MaxStep {
  phase: MaxPhase
  index: number
  preSum: number
  minPreSum: number
  candidate: number
  f: (number | null)[]
  currentF: number
  candidateStart: number
  bestStart: number
  bestEnd: number
  ans: number
  lineId: string
  message: string
}

export const maxNumbers = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
export const maxMethods: PlayerMethod[] = [
  { id: 'prefix', label: '前缀和 + 贪心', complexity: 'O(N) · O(1)', languages: ['java', 'javascript'] },
  { id: 'dp', label: '动态规划数组', complexity: 'O(N) · O(N)', languages: ['java'] },
  { id: 'rolling', label: '空间优化', complexity: 'O(N) · O(1)', languages: ['java'] },
]

const prefixCode: CodeLine[] = [
  { id: 'p-class', text: 'class Solution {' },
  { id: 'p-method', text: '  public int maxSubArray(int[] nums) {' },
  { id: 'p-ans', text: '    int ans = Integer.MIN_VALUE;' },
  { id: 'p-min', text: '    int minPreSum = 0;' },
  { id: 'p-sum', text: '    int preSum = 0;' },
  { id: 'p-loop', text: '    for (int x : nums) {' },
  { id: 'p-add', text: '      preSum += x;' },
  { id: 'p-update', text: '      ans = Math.max(ans, preSum - minPreSum);' },
  { id: 'p-min-update', text: '      minPreSum = Math.min(minPreSum, preSum);' },
  { id: 'p-loop-close', text: '    }' },
  { id: 'p-return', text: '    return ans;' },
  { id: 'p-method-close', text: '  }' },
  { id: 'p-class-close', text: '}' },
]

const dpCode: CodeLine[] = [
  { id: 'd-class', text: 'class Solution {' },
  { id: 'd-method', text: '  public int maxSubArray(int[] nums) {' },
  { id: 'd-array', text: '    int[] f = new int[nums.length];' },
  { id: 'd-first', text: '    f[0] = nums[0];' },
  { id: 'd-ans', text: '    int ans = f[0];' },
  { id: 'd-loop', text: '    for (int i = 1; i < nums.length; i++) {' },
  { id: 'd-transition', text: '      f[i] = Math.max(f[i - 1], 0) + nums[i];' },
  { id: 'd-update', text: '      ans = Math.max(ans, f[i]);' },
  { id: 'd-loop-close', text: '    }' },
  { id: 'd-return', text: '    return ans;' },
  { id: 'd-method-close', text: '  }' },
  { id: 'd-class-close', text: '}' },
]

const rollingCode: CodeLine[] = [
  { id: 'r-class', text: 'class Solution {' },
  { id: 'r-method', text: '  public int maxSubArray(int[] nums) {' },
  { id: 'r-ans', text: '    int ans = Integer.MIN_VALUE;' },
  { id: 'r-f', text: '    int f = 0;' },
  { id: 'r-loop', text: '    for (int x : nums) {' },
  { id: 'r-transition', text: '      f = Math.max(f, 0) + x;' },
  { id: 'r-update', text: '      ans = Math.max(ans, f);' },
  { id: 'r-loop-close', text: '    }' },
  { id: 'r-return', text: '    return ans;' },
  { id: 'r-method-close', text: '  }' },
  { id: 'r-class-close', text: '}' },
]

const prefixJavascriptCode: CodeLine[] = [
  { id: 'p-method', text: 'function maxSubArray(nums) {' },
  { id: 'p-ans', text: '    let ans = -Infinity' },
  { id: 'p-min', text: '    let minPreSum = 0' },
  { id: 'p-sum', text: '    let preSum = 0' },
  { id: 'p-blank-1', text: '' },
  { id: 'p-loop', text: '    for (let i = 0; i < nums.length; i++) {' },
  { id: 'p-add', text: '        preSum += nums[i]' },
  { id: 'p-update', text: '        ans = Math.max(ans, preSum - minPreSum)' },
  { id: 'p-min-update', text: '        minPreSum = Math.min(preSum, minPreSum)' },
  { id: 'p-loop-close', text: '    }' },
  { id: 'p-blank-2', text: '' },
  { id: 'p-return', text: '    return ans' },
  { id: 'p-method-close', text: '}' },
]

export const getMaxCode = (method: MaxMethod, language: CodeLanguage) => method === 'prefix' ? language === 'javascript' ? prefixJavascriptCode : prefixCode : method === 'dp' ? dpCode : rollingCode
const emptyF = () => Array<number | null>(maxNumbers.length).fill(null)
const base = (values: Partial<MaxStep>): MaxStep => ({ phase: 'ready', index: -1, preSum: 0, minPreSum: 0, candidate: 0, f: emptyF(), currentF: 0, candidateStart: -1, bestStart: -1, bestEnd: -1, ans: Number.NEGATIVE_INFINITY, lineId: '', message: '', ...values })

function makePrefixSteps(): MaxStep[] {
  const steps: MaxStep[] = [base({ lineId: 'p-sum', message: '初始化：preSum = 0，minPreSum = 0；答案必须包含元素，所以 ans 从负无穷开始' })]
  let preSum = 0
  let minPreSum = 0
  let minPosition = 0
  let ans = Number.NEGATIVE_INFINITY
  let bestStart = -1
  let bestEnd = -1
  maxNumbers.forEach((number, index) => {
    preSum += number
    steps.push(base({ phase: 'sum', index, preSum, minPreSum, candidateStart: minPosition, bestStart, bestEnd, ans, lineId: 'p-add', message: '读入 nums[' + index + '] = ' + number + '，preSum 更新为 ' + preSum }))
    const candidateStart = minPosition
    const candidate = preSum - minPreSum
    const previous = ans
    if (candidate > ans) {
      ans = candidate
      bestStart = minPosition
      bestEnd = index
    }
    steps.push(base({ phase: 'candidate', index, preSum, minPreSum, candidate, candidateStart, bestStart, bestEnd, ans, lineId: 'p-update', message: '先计算 preSum − minPreSum = ' + preSum + ' − ' + minPreSum + ' = ' + candidate + (ans > previous ? '，更新 ans = ' + ans : '，ans 保持 ' + ans) }))
    const oldMin = minPreSum
    if (preSum < minPreSum) {
      minPreSum = preSum
      minPosition = index + 1
    }
    steps.push(base({ phase: 'minimum', index, preSum, minPreSum, candidate, candidateStart, bestStart, bestEnd, ans, lineId: 'p-min-update', message: oldMin === minPreSum ? '再更新最小前缀和：min(' + oldMin + ', ' + preSum + ') = ' + minPreSum + '，保持不变' : '再更新最小前缀和：min(' + oldMin + ', ' + preSum + ') = ' + minPreSum + '，后续候选区间从下标 ' + minPosition + ' 开始' }))
  })
  steps.push(base({ phase: 'done', index: maxNumbers.length - 1, preSum, minPreSum, candidate: ans, candidateStart: bestStart, bestStart, bestEnd, ans, lineId: 'p-return', message: '最大和连续子数组是 [4, -1, 2, 1]，返回 6' }))
  return steps
}

function makeDpSteps(): MaxStep[] {
  const f = emptyF()
  const starts = Array(maxNumbers.length).fill(0)
  f[0] = maxNumbers[0]
  let ans = maxNumbers[0]
  let bestStart = 0
  let bestEnd = 0
  const steps: MaxStep[] = [base({ phase: 'transition', index: 0, f: [...f], currentF: f[0], candidate: f[0], candidateStart: 0, bestStart, bestEnd, ans, lineId: 'd-first', message: 'f[0] 表示必须以 nums[0] 结尾，只有 [-2] 可选，所以 f[0] = -2' })]
  for (let index = 1; index < maxNumbers.length; index++) {
    const previous = f[index - 1] as number
    const extend = previous > 0
    f[index] = Math.max(previous, 0) + maxNumbers[index]
    starts[index] = extend ? starts[index - 1] : index
    steps.push(base({ phase: 'transition', index, f: [...f], currentF: f[index] as number, candidate: f[index] as number, candidateStart: starts[index], bestStart, bestEnd, ans, lineId: 'd-transition', message: extend ? 'f[' + (index - 1) + '] = ' + previous + ' > 0，拼接 nums[' + index + ']，得到 f[' + index + '] = ' + f[index] : 'f[' + (index - 1) + '] = ' + previous + ' ≤ 0，丢掉左侧，从 nums[' + index + '] 重新开始，f[' + index + '] = ' + f[index] }))
    if ((f[index] as number) > ans) {
      ans = f[index] as number
      bestStart = starts[index]
      bestEnd = index
    }
    steps.push(base({ phase: 'update', index, f: [...f], currentF: f[index] as number, candidate: f[index] as number, candidateStart: starts[index], bestStart, bestEnd, ans, lineId: 'd-update', message: '用 f[' + index + '] = ' + f[index] + ' 更新历史最大值，ans = ' + ans }))
  }
  steps.push(base({ phase: 'done', index: maxNumbers.length - 1, f: [...f], currentF: f.at(-1) as number, candidate: ans, candidateStart: bestStart, bestStart, bestEnd, ans, lineId: 'd-return', message: 'max(f) = 6，对应连续子数组 [4, -1, 2, 1]' }))
  return steps
}

function makeRollingSteps(): MaxStep[] {
  const steps: MaxStep[] = [base({ lineId: 'r-f', message: '只保留上一个 f：它表示“必须以当前元素结尾”的最大子数组和' })]
  let f = 0
  let currentStart = 0
  let ans = Number.NEGATIVE_INFINITY
  let bestStart = -1
  let bestEnd = -1
  maxNumbers.forEach((number, index) => {
    const previous = f
    if (previous <= 0) currentStart = index
    f = Math.max(previous, 0) + number
    steps.push(base({ phase: 'transition', index, currentF: f, candidate: f, candidateStart: currentStart, bestStart, bestEnd, ans, lineId: 'r-transition', message: previous > 0 ? '旧 f = ' + previous + ' 为正，继续拼接 ' + number + '，新 f = ' + f : '旧 f = ' + previous + ' 不为正，不再拼接；从 ' + number + ' 重新开始，新 f = ' + f }))
    if (f > ans) {
      ans = f
      bestStart = currentStart
      bestEnd = index
    }
    steps.push(base({ phase: 'update', index, currentF: f, candidate: f, candidateStart: currentStart, bestStart, bestEnd, ans, lineId: 'r-update', message: 'ans = max(ans, f)，更新后 ans = ' + ans }))
  })
  steps.push(base({ phase: 'done', index: maxNumbers.length - 1, currentF: f, candidate: ans, candidateStart: bestStart, bestStart, bestEnd, ans, lineId: 'r-return', message: '返回最大子数组和 6' }))
  return steps
}

export const makeMaxSteps = (method: MaxMethod) => method === 'prefix' ? makePrefixSteps() : method === 'dp' ? makeDpSteps() : makeRollingSteps()
