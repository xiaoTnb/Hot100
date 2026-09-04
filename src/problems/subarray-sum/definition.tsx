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
  note: '子数组必须连续。当前前缀和减去某个旧前缀和，正好就是两者之间那段连续元素的和。因此代码查询“当前前缀和 − k”以前出现过多少次。',
  example: <><code>nums = [1, -1, 2, 1, -1, 2]，k = 2</code><strong>→ 7（动画会展示重复前缀和的次数合并）</strong></>,
  Visualizer: lazy(() => import('./SubarraySumVisualizer').then((module) => ({ default: module.SubarraySumVisualizer }))),
} satisfies ProblemDefinition
