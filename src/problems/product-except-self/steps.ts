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
  formula: string
  lineId: string
  message: string
}

export const productNumbers = [1, 2, 3, 4]
export const productMethods: PlayerMethod[] = [
  { id: 'arrays', label: '前缀积 + 后缀积', complexity: 'O(N) · O(N)', languages: ['java'] },
  { id: 'optimized', label: '复用输出数组', complexity: 'O(N) · O(1)', languages: ['java'] },
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
const step = (values: Partial<ProductStep>): ProductStep => ({ phase: 'pre-seed', index: -1, pre: empty(), suf: empty(), answer: empty(), preValue: 1, formula: '', lineId: '', message: '', ...values })

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
    steps.push(step({ phase: 'answer', index: i, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'ans[' + i + '] = ' + pre[i] + ' × ' + suf[i] + ' = ' + answer[i], lineId: 'a-ans-update', message: '左侧乘积 × 右侧乘积，恰好跳过 nums[' + i + '] = ' + productNumbers[i] }))
  }
  steps.push(step({ phase: 'done', index: n - 1, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'ans = [24, 12, 8, 6]', lineId: 'a-return', message: '返回 [24, 12, 8, 6]' }))
  return steps
}

function makeOptimizedSteps(): ProductStep[] {
  const n = productNumbers.length
  const suf = empty()
  const answer = empty()
  const steps: ProductStep[] = []
  suf[n - 1] = 1
  steps.push(step({ phase: 'suf-seed', index: n - 1, suf: [...suf], answer: [...answer], formula: 'suf[' + (n - 1) + '] = 1', lineId: 'o-suf-seed', message: '先把输出数组 suf 当作后缀积数组使用' }))
  for (let i = n - 2; i >= 0; i--) {
    suf[i] = (suf[i + 1] as number) * productNumbers[i + 1]
    steps.push(step({ phase: 'suf', index: i, suf: [...suf], answer: [...answer], formula: 'suf[' + i + '] = ' + suf[i + 1] + ' × ' + productNumbers[i + 1] + ' = ' + suf[i], lineId: 'o-suf-update', message: '从右向左得到下标 ' + i + ' 右侧的乘积' }))
  }
  let preValue = 1
  for (let i = 0; i < n; i++) {
    suf[i] = (suf[i] as number) * preValue
    answer[i] = suf[i]
    steps.push(step({ phase: 'answer', index: i, suf: [...suf], answer: [...answer], preValue, formula: 'suf[' + i + '] *= pre → ' + suf[i], lineId: 'o-answer', message: '此时 pre = ' + preValue + ' 是左侧乘积，直接乘进输出位置 suf[' + i + ']' }))
    const before = preValue
    preValue *= productNumbers[i]
    steps.push(step({ phase: 'pre-move', index: i, suf: [...suf], answer: [...answer], preValue, formula: 'pre = ' + before + ' × ' + productNumbers[i] + ' = ' + preValue, lineId: 'o-pre-move', message: '处理完答案后，才把 nums[' + i + '] 乘进 pre，供下一个位置使用' }))
  }
  steps.push(step({ phase: 'done', index: n - 1, suf: [...suf], answer: [...answer], preValue, formula: 'suf = [24, 12, 8, 6]', lineId: 'o-return', message: '输出数组复用完成，额外空间为 O(1)' }))
  return steps
}

export const makeProductSteps = (method: ProductMethod) => method === 'arrays' ? makeArraysSteps() : makeOptimizedSteps()
