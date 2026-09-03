import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const subarraySumProblem = {
  slug: 'subarray-sum-equals-k',
  number: '10',
  leetcodeId: 'LeetCode #560',
  title: '和为 K 的子数组',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '哈希表', '前缀和'],
  url: 'https://leetcode.cn/problems/subarray-sum-equals-k/',
  lead: <>统计整数数组 <code>nums</code> 中，元素和恰好等于 <code>k</code> 的连续非空子数组个数。</>,
  note: '子数组必须连续。若 s[j] − s[i] = k，那么下标 i 到 j − 1 的元素和就是 k；因此枚举当前前缀和 s[j] 时，只需统计左侧出现过多少个 s[j] − k。',
  example: <><code>nums = [1, 1, 1]，k = 2</code><strong>→ 2</strong></>,
  Visualizer: lazy(() => import('./SubarraySumVisualizer').then((module) => ({ default: module.SubarraySumVisualizer }))),
} satisfies ProblemDefinition
