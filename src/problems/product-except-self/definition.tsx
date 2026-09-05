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
  languages: ['javascript'],
  url: 'https://leetcode.cn/problems/product-of-array-except-self/',
  lead: <>返回数组 <code>answer</code>，其中每一项等于原数组中除自身之外所有元素的乘积。</>,
  note: '不能使用除法。pre[i] 保存 i 左侧全部元素的乘积，suf[i] 保存 i 右侧全部元素的乘积，两者相乘就是答案。',
  example: <><code>nums = [1,2,3,4]</code><strong>→ [24,12,8,6]</strong></>,
  Visualizer: lazy(() => import('./ProductExceptSelfVisualizer').then((module) => ({ default: module.ProductExceptSelfVisualizer }))),
} satisfies ProblemDefinition
