import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const maximumSubarrayProblem = {
  slug: 'maximum-subarray',
  number: '13',
  leetcodeId: 'LeetCode #53',
  title: '最大子数组和',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '动态规划', '贪心'],
  url: 'https://leetcode.cn/problems/maximum-subarray/',
  lead: <>找出整数数组中元素和最大的连续非空子数组，并返回它的最大和。</>,
  note: '子数组必须连续且不能为空。动态规划中的 f 表示“必须以当前元素结尾”的最大和；历史答案是所有 f 的最大值，不一定是最后一个 f。',
  example: <><code>nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]</code><strong>→ 6，对应 [4, -1, 2, 1]</strong></>,
  Visualizer: lazy(() => import('./MaximumSubarrayVisualizer').then((module) => ({ default: module.MaximumSubarrayVisualizer }))),
} satisfies ProblemDefinition
