import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ProductMethod = 'arrays' | 'optimized'
export type ProductPhase = 'pre-seed' | 'pre' | 'suf-seed' | 'suf' | 'answer' | 'pre-move' | 'done'
export interface ProductStep {
  phase: ProductPhase
  index: number
  pre: Array<number | null>
  suf: Array<number | null>
  answer: Array<number | null>
  preValue: number
  rightProduct: number | null
  formula: string
  lineId: string
  message: string
}

export const productNumbers = [2, 3, 4, 5]
export const productMethods: PlayerMethod[] = [
  { id: 'optimized', label: '复用输出数组', complexity: 'O(N) · O(1)', languages: ['java'] },
  { id: 'arrays', label: '前缀积 + 后缀积', complexity: 'O(N) · O(N)', languages: ['java'] },
]

const arraysCode: CodeLine[] = [
  { id: 'a-class', text: 'class Solution {' },
  { id: 'a-method', text: '  public int[] productExceptSelf(int[] nums) {' },
  { id: 'a-n', text: '    int n = nums.length;' },
  { id: 'a-pre', text: '    int[] pre = new int[n];' },
  { id: 'a-pre-seed', text: '    pre[0] = 1;' },
  { id: 'a-pre-loop', text: '    for (int i = 1; i < n; i++) {' },
  { id: 'a-pre-update', text: '      pre[i] = pre[i - 1] * nums[i - 1];' },
  { id: 'a-pre-close', text: '    }' },
  { id: 'a-blank-1', text: '' },
  { id: 'a-suf', text: '    int[] suf = new int[n];' },
  { id: 'a-suf-seed', text: '    suf[n - 1] = 1;' },
  { id: 'a-suf-loop', text: '    for (int i = n - 2; i >= 0; i--) {' },
  { id: 'a-suf-update', text: '      suf[i] = suf[i + 1] * nums[i + 1];' },
  { id: 'a-suf-close', text: '    }' },
  { id: 'a-blank-2', text: '' },
  { id: 'a-ans', text: '    int[] ans = new int[n];' },
  { id: 'a-ans-loop', text: '    for (int i = 0; i < n; i++) {' },
  { id: 'a-ans-update', text: '      ans[i] = pre[i] * suf[i];' },
  { id: 'a-ans-close', text: '    }' },
  { id: 'a-return', text: '    return ans;' },
  { id: 'a-method-close', text: '  }' },
  { id: 'a-class-close', text: '}' },
]

const optimizedCode: CodeLine[] = [
  { id: 'o-class', text: 'class Solution {' },
  { id: 'o-method', text: '  public int[] productExceptSelf(int[] nums) {' },
  { id: 'o-n', text: '    int n = nums.length;' },
  { id: 'o-suf', text: '    int[] suf = new int[n];' },
  { id: 'o-suf-seed', text: '    suf[n - 1] = 1;' },
  { id: 'o-suf-loop', text: '    for (int i = n - 2; i >= 0; i--) {' },
  { id: 'o-suf-update', text: '      suf[i] = suf[i + 1] * nums[i + 1];' },
  { id: 'o-suf-close', text: '    }' },
  { id: 'o-blank', text: '' },
  { id: 'o-pre', text: '    int pre = 1;' },
  { id: 'o-loop', text: '    for (int i = 0; i < n; i++) {' },
  { id: 'o-answer', text: '      suf[i] *= pre;' },
  { id: 'o-pre-move', text: '      pre *= nums[i];' },
  { id: 'o-loop-close', text: '    }' },
  { id: 'o-return', text: '    return suf;' },
  { id: 'o-method-close', text: '  }' },
  { id: 'o-class-close', text: '}' },
]

export const getProductCode = (method: ProductMethod) => method === 'arrays' ? arraysCode : optimizedCode
const empty = () => Array<number | null>(productNumbers.length).fill(null)
const step = (values: Partial<ProductStep>): ProductStep => ({ phase: 'pre-seed', index: -1, pre: empty(), suf: empty(), answer: empty(), preValue: 1, rightProduct: null, formula: '', lineId: '', message: '', ...values })

function makeArraysSteps(): ProductStep[] {
  const n = productNumbers.length
  const pre = empty()
  const suf = empty()
  const answer = empty()
  const steps: ProductStep[] = []
  pre[0] = 1
  steps.push(step({ index: 0, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'pre[0] = 1', lineId: 'a-pre-seed', message: '下标 0 左侧为空，空乘积规定为 1' }))
  for (let i = 1; i < n; i++) {
    pre[i] = (pre[i - 1] as number) * productNumbers[i - 1]
    steps.push(step({ phase: 'pre', index: i, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'pre[' + i + '] = ' + pre[i - 1] + ' × ' + productNumbers[i - 1] + ' = ' + pre[i], lineId: 'a-pre-update', message: 'pre[' + i + '] 只包含 nums[' + i + '] 左侧的乘积' }))
  }
  suf[n - 1] = 1
  steps.push(step({ phase: 'suf-seed', index: n - 1, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'suf[' + (n - 1) + '] = 1', lineId: 'a-suf-seed', message: '最后一个下标右侧为空，空乘积规定为 1' }))
  for (let i = n - 2; i >= 0; i--) {
    suf[i] = (suf[i + 1] as number) * productNumbers[i + 1]
    steps.push(step({ phase: 'suf', index: i, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'suf[' + i + '] = ' + suf[i + 1] + ' × ' + productNumbers[i + 1] + ' = ' + suf[i], lineId: 'a-suf-update', message: 'suf[' + i + '] 只包含 nums[' + i + '] 右侧的乘积' }))
  }
  for (let i = 0; i < n; i++) {
    answer[i] = (pre[i] as number) * (suf[i] as number)
    steps.push(step({ phase: 'answer', index: i, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'ans[' + i + '] = ' + pre[i] + ' × ' + suf[i] + ' = ' + answer[i], lineId: 'a-ans-update', message: '左侧乘积 × 右侧乘积，两边都不包含 nums[' + i + '] = ' + productNumbers[i] }))
  }
  steps.push(step({ phase: 'done', index: n - 1, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'ans = [' + answer.join(', ') + ']', lineId: 'a-return', message: '返回 [' + answer.join(', ') + ']' }))
  return steps
}

function makeOptimizedSteps(): ProductStep[] {
  const n = productNumbers.length
  const suf = empty()
  const preTrace = empty()
  const answer = empty()
  const steps: ProductStep[] = []
  suf[n - 1] = 1
  steps.push(step({ phase: 'suf-seed', index: n - 1, pre: [...preTrace], suf: [...suf], answer: [...answer], formula: 'suf[' + (n - 1) + '] = 1', lineId: 'o-suf-seed', message: '先借用输出数组存“右侧乘积”。最后一个下标的右边没有数字，空乘积规定为 1' }))
  for (let i = n - 2; i >= 0; i--) {
    suf[i] = (suf[i + 1] as number) * productNumbers[i + 1]
    steps.push(step({ phase: 'suf', index: i, pre: [...preTrace], suf: [...suf], answer: [...answer], rightProduct: suf[i] as number, formula: 'suf[' + i + '] = ' + suf[i + 1] + ' × ' + productNumbers[i + 1] + ' = ' + suf[i], lineId: 'o-suf-update', message: '只乘 nums[' + i + '] 右边的 [' + productNumbers.slice(i + 1).join(', ') + ']，得到右侧乘积 ' + suf[i] }))
  }
  let preValue = 1
  preTrace[0] = preValue
  steps.push(step({ phase: 'pre-seed', index: 0, pre: [...preTrace], suf: [...suf], answer: [...answer], preValue, rightProduct: suf[0] as number, formula: 'pre = 1', lineId: 'o-pre', message: '准备从左向右写答案。i = 0 的左边没有数字，所以左侧乘积 pre 从 1 开始；动画把它记在 pre 轨迹的第 0 格' }))
  for (let i = 0; i < n; i++) {
    preTrace[i] = preValue
    const rightProduct = suf[i] as number
    suf[i] = rightProduct * preValue
    answer[i] = suf[i]
    steps.push(step({ phase: 'answer', index: i, pre: [...preTrace], suf: [...suf], answer: [...answer], preValue, rightProduct, formula: 'suf[' + i + '] = 右积 ' + rightProduct + ' × 左积 ' + preValue + ' = ' + suf[i], lineId: 'o-answer', message: '计算 answer[' + i + ']：pre 轨迹第 ' + i + ' 格给出左积 ' + preValue + '，suf 原值给出右积 ' + rightProduct + '，两者相乘得到 ' + suf[i] }))
    const before = preValue
    preValue *= productNumbers[i]
    if (i + 1 < n) preTrace[i + 1] = preValue
    steps.push(step({ phase: 'pre-move', index: i, pre: [...preTrace], suf: [...suf], answer: [...answer], preValue, rightProduct, formula: 'pre = ' + before + ' × nums[' + i + '] = ' + before + ' × ' + productNumbers[i] + ' = ' + preValue, lineId: 'o-pre-move', message: i + 1 < n ? '执行 pre *= nums[' + i + '] 后得到 ' + preValue + '；动画把它放入 pre 轨迹第 ' + (i + 1) + ' 格，下一轮直接使用' : '执行最后一次 pre *= nums[' + i + ']；随后循环结束，这个新值不会再参与答案计算' }))
  }
  steps.push(step({ phase: 'done', index: n - 1, pre: [...preTrace], suf: [...suf], answer: [...answer], preValue, formula: 'suf = [' + suf.join(', ') + ']', lineId: 'o-return', message: 'suf 的每一格都已从右侧乘积改成最终答案，直接返回它' }))
  return steps
}

export const makeProductSteps = (method: ProductMethod) => method === 'arrays' ? makeArraysSteps() : makeOptimizedSteps()
