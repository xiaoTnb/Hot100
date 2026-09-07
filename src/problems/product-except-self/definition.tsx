import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const productExceptSelfProblem = {
  slug: 'product-of-array-except-self',
  number: '16',
  leetcodeId: 'LeetCode #238',
  title: '除自身以外数组的乘积',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '前缀积'],
  languages: ['java'],
  url: 'https://leetcode.cn/problems/product-of-array-except-self/',
  lead: <>返回数组 <code>answer</code>，其中每一项等于原数组中除自身之外所有元素的乘积。</>,
  note: '不能使用除法。普通版用 pre[] 和 suf[] 分别保存左右乘积；优化版把 pre[] 压缩成一个滚动变量 pre，再把 suf[] 的每一格直接改成答案。',
  example: <><code>nums = [2,3,4,5]</code><strong>→ [60,40,30,24]</strong></>,
  Visualizer: lazy(() => import('./ProductExceptSelfVisualizer').then((module) => ({ default: module.ProductExceptSelfVisualizer }))),
} satisfies ProblemDefinition
