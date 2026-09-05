import type { CodeLine, PlayerMethod } from '../../components/player/types'

export type ProductPhase = 'pre-seed' | 'pre' | 'suf-seed' | 'suf' | 'answer' | 'done'

export interface ProductStep {
  phase: ProductPhase
  index: number
  pre: Array<number | null>
  suf: Array<number | null>
  answer: Array<number | null>
  formula: string
  lineId: string
  message: string
}

export const productNumbers = [1, 2, 3, 4]
export const productMethods: PlayerMethod[] = [{ id: 'prefix-suffix', label: '前缀积 × 后缀积', complexity: 'O(N) · O(N)', languages: ['javascript'] }]

export const productCode: CodeLine[] = [
  { id: 'product-method', text: 'function productExceptSelf(nums) {' },
  { id: 'product-n', text: '    const n = nums.length' },
  { id: 'product-pre', text: '    const pre = Array(n)  // 前缀积（prefix）' },
  { id: 'product-pre-seed', text: '    pre[0] = 1' },
  { id: 'product-pre-loop', text: '    for (let i = 1; i < n; i++) {' },
  { id: 'product-pre-update', text: '        pre[i] = pre[i - 1] * nums[i - 1]' },
  { id: 'product-pre-close', text: '    }' },
  { id: 'product-blank-1', text: '' },
  { id: 'product-suf', text: '    const suf = Array(n)  // 后缀积（suffix）' },
  { id: 'product-suf-seed', text: '    suf[n - 1] = 1' },
  { id: 'product-suf-loop', text: '    for (let i = n - 2; i >= 0; i--) {' },
  { id: 'product-suf-update', text: '        suf[i] = suf[i + 1] * nums[i + 1]' },
  { id: 'product-suf-close', text: '    }' },
  { id: 'product-blank-2', text: '' },
  { id: 'product-answer', text: '    const ans = Array(n)' },
  { id: 'product-answer-loop', text: '    for (let i = 0; i < n; i++) {' },
  { id: 'product-answer-update', text: '        ans[i] = pre[i] * suf[i]' },
  { id: 'product-answer-close', text: '    }' },
  { id: 'product-blank-3', text: '' },
  { id: 'product-return', text: '    return ans' },
  { id: 'product-method-close', text: '}' },
]

const empty = () => Array<number | null>(productNumbers.length).fill(null)

export function makeProductSteps(): ProductStep[] {
  const n = productNumbers.length
  const pre = empty()
  const suf = empty()
  const answer = empty()
  const steps: ProductStep[] = []

  pre[0] = 1
  steps.push({ phase: 'pre-seed', index: 0, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'pre[0] = 1', lineId: 'product-pre-seed', message: '下标 0 左侧没有元素，空乘积记为 1，所以 pre[0] = 1' })
  for (let i = 1; i < n; i++) {
    pre[i] = (pre[i - 1] as number) * productNumbers[i - 1]
    steps.push({ phase: 'pre', index: i, pre: [...pre], suf: [...suf], answer: [...answer], formula: `pre[${i}] = ${pre[i - 1]} × ${productNumbers[i - 1]} = ${pre[i]}`, lineId: 'product-pre-update', message: `pre[${i}] 只乘下标 ${i} 左侧的元素，得到 ${pre[i]}` })
  }

  suf[n - 1] = 1
  steps.push({ phase: 'suf-seed', index: n - 1, pre: [...pre], suf: [...suf], answer: [...answer], formula: `suf[${n - 1}] = 1`, lineId: 'product-suf-seed', message: `下标 ${n - 1} 右侧没有元素，空乘积记为 1` })
  for (let i = n - 2; i >= 0; i--) {
    suf[i] = (suf[i + 1] as number) * productNumbers[i + 1]
    steps.push({ phase: 'suf', index: i, pre: [...pre], suf: [...suf], answer: [...answer], formula: `suf[${i}] = ${suf[i + 1]} × ${productNumbers[i + 1]} = ${suf[i]}`, lineId: 'product-suf-update', message: `suf[${i}] 只乘下标 ${i} 右侧的元素，得到 ${suf[i]}` })
  }

  for (let i = 0; i < n; i++) {
    answer[i] = (pre[i] as number) * (suf[i] as number)
    steps.push({ phase: 'answer', index: i, pre: [...pre], suf: [...suf], answer: [...answer], formula: `ans[${i}] = ${pre[i]} × ${suf[i]} = ${answer[i]}`, lineId: 'product-answer-update', message: `左侧乘积 ${pre[i]} × 右侧乘积 ${suf[i]}，恰好跳过 nums[${i}] = ${productNumbers[i]}` })
  }
  steps.push({ phase: 'done', index: n - 1, pre: [...pre], suf: [...suf], answer: [...answer], formula: 'ans = [24, 12, 8, 6]', lineId: 'product-return', message: '全部位置计算完成，不使用除法得到 [24, 12, 8, 6]' })
  return steps
}
