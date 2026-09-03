import { lazy } from 'react'
import type { ProblemDefinition } from '../types'

export const longestConsecutiveProblem = {
  slug: 'longest-consecutive-sequence',
  number: '03',
  leetcodeId: 'LeetCode #128',
  title: '最长连续序列',
  difficulty: 'medium',
  difficultyLabel: '中等',
  tags: ['数组', '哈希表'],
  url: 'https://leetcode.cn/problems/longest-consecutive-sequence/',
  lead: <>给定一个未排序的整数数组 <code>nums</code>，找出数字连续的最长序列长度，要求时间复杂度为 <code>O(N)</code>。</>,
  note: '连续只看数值，不要求这些数字在原数组中相邻。先用 Set 去重，再只从没有前驱的数字开始向右寻找。',
  example: <><code>nums = [100, 4, 200, 1, 3, 2]</code><strong>输出：4（序列为 [1, 2, 3, 4]）</strong></>,
  Visualizer: lazy(() => import('./LongestConsecutiveVisualizer').then((module) => ({ default: module.LongestConsecutiveVisualizer }))),
} satisfies ProblemDefinition
